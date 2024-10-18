const { app, BrowserWindow, ipcMain } = require('electron');
const escpos = require('escpos');
const QRCode = require('qrcode');
const path = require('path');

// Remover ou comentar a configuração da impressora
// escpos.USB = require('escpos-usb');
// const device = new escpos.USB();
// const printer = new escpos.Printer(device);

// Função para formatar a NFC-e a ser impressa
function formatNFCe(data) {
    let content = '';

    content += `Emitente:\n`;
    content += `Nome: ${data.emitente.nome}\n`;
    content += `CNPJ: ${data.emitente.cnpj}\n`;
    content += `Endereço: ${data.emitente.endereco}, ${data.emitente.numero}\n`;
    content += `Bairro: ${data.emitente.bairro}\n`;
    content += `Cidade: ${data.emitente.cidade} - ${data.emitente.estado}\n\n`;

    content += `Produtos:\n`;
    data.produtos.forEach(produto => {
        content += `Descrição: ${produto.descricao}\n`;
        content += `Quantidade: ${produto.quantidade}\n`;
        content += `Valor Unitário: R$ ${produto.valor_unitario.toFixed(2)}\n`;
        content += `Valor Total: R$ ${produto.valor_total.toFixed(2)}\n\n`;
    });

    content += `Total: R$ ${data.total}\n\n`;

    return content;
}

// Função para imprimir a NFC-e (apenas logando os dados para teste)
ipcMain.on('print', async (event, nfeData) => {
    const formattedContent = formatNFCe(nfeData); // Formata os dados da NFC-e

    // Em vez de imprimir, loga os dados no console
    console.log(formattedContent); // Loga o conteúdo formatado

    // Testa a geração do QR Code
    try {
        const qrCodeImage = await QRCode.toDataURL(nfeData.qr_code);
        console.log('QR Code gerado com sucesso:', qrCodeImage); // Loga a imagem do QR Code
    } catch (qrError) {
        console.error('Erro ao gerar QR Code:', qrError);
    }
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    win.loadFile(path.join(__dirname, 'pages', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
