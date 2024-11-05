

// Função para preencher a modal com os produtos do carrinho e calcular o subtotal
function preencherModalCarrinho() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const cartItemsTable = document.getElementById('cart-items'); // Referência à tabela
    const subtotalElement = document.getElementById('subtotal');

    let subtotal = 0;
    cartItemsTable.innerHTML = ''; // Limpa a tabela

   

    cart.forEach(item => {
        const produto = produtos.find(p => p.id_produto === item.produto.id_produto);
        if (produto) {
            const valorUnitario = produto.preco_produto;
            const valorTotal = valorUnitario * item.quantidade_cart;
            subtotal += valorTotal;

            // Cria uma nova linha para o item
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.desc_produto}</td>
                <td>R$${valorUnitario.toFixed(2)}</td>
                <td>${item.quantidade_cart}</td>
                <td>R$${valorTotal.toFixed(2)}</td>
            `;
            cartItemsTable.appendChild(row); // Adiciona a linha à tabela
        }
    });

    // Atualiza o subtotal na tela
    subtotalElement.textContent = subtotal.toFixed(2);
}


function mostrarFormulario(metodo) {
    let entrega = document.getElementById('verifica-entrega');
    const formulario = document.getElementById('formulario-cliente');
    const formulario_entrega = document.getElementById('entrega-form');
    const btn_entrega = document.getElementById('btn-entrega')
    const btn_retirada = document.getElementById('btn-retirada')
    if (metodo === 'entrega') {
        formulario.style.display = 'block';
        formulario_entrega.style.display = 'block'; // Mostra o formulário
        btn_entrega.style.backgroundColor = '#0301fa';
        btn_retirada.style.backgroundColor = '#ef6c00';
        document.getElementById('verifica-entrega').value = true;
        console.log('entrega: ', document.getElementById('verifica-entrega').value)
    } else if (metodo === 'retirada') {
        formulario.style.display = 'block';
        formulario_entrega.style.display = 'none'; // Esconde o formulário
        btn_retirada.style.backgroundColor = '#0301fa';
        btn_entrega.style.backgroundColor = '#ef6c00';
        document.getElementById('verifica-entrega').value = false;
        console.log('entrega: ', document.getElementById('verifica-entrega').value)
    }
}


async function confirmarPedido(event) {
    event.preventDefault();
    
    // Recuperar as tabelas do localStorage
    const notas = JSON.parse(localStorage.getItem('vendas')) || [];
    const itens = JSON.parse(localStorage.getItem('item_nota_venda')) || [];
    const bairros = JSON.parse(localStorage.getItem('bairros')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    // verifica se é para entrega
    let entrega =  document.getElementById('verifica-entrega');
    

    let cliente = {};

    const id_cliente = parseInt(document.getElementById('id_cliente').value) || null;
    const id_bairro = parseInt(document.getElementById('id_bairro').value) || null;
    const rua_entrega = document.getElementById('rua').value || null;
    const numero_entrega = document.getElementById('numero').value || null;
    const id_tipo_pagamento = document.getElementById('tipo_pagamento').value || null;
    let telefone_cliente = document.getElementById('telefone').value || null;
    if (telefone_cliente != null){

        telefone_cliente = telefone_cliente.replace(/\D/g, '');
    }

    if (entrega.value === true){
        // Recuperar os dados do cliente selecionado e outros campos

        cliente = {
            id_cliente: id_cliente,
            rua_entrega: rua_entrega,
            numero_entrega: numero_entrega,
            id_bairro_entrega: id_bairro,
            telefone_cliente: telefone_cliente
        };
    }   

    const bairroSelecionado = bairros.find(bairro => bairro.id_bairro === id_bairro);
    let frete = 0;
    if (bairroSelecionado) {
        frete = bairroSelecionado.frete_bairro;
    }

    let subtotal = 0;

    
    cart.forEach(item => {
        // Encontra o produto correspondente
        const produto = produtos.find(p => p.id_produto === item.produto.id_produto);
        if (produto) {
            const valorUnitario = produto.preco_produto;
            const valorTotal = valorUnitario * item.quantidade_cart;

            item.valorTotal = valorTotal;

            subtotal += valorTotal;
        }
    });

    subtotal += parseFloat(frete);
        
    // Criar o objeto nota_venda
    let novaNotaVenda = {
        id_nota_venda: null,
        valor_total: parseFloat(subtotal),
        data_nota_venda: new Date().toLocaleString('sv-SE', {
            timeZone: 'America/Sao_Paulo' // Define o fuso horário
        }).replace(' ', 'T'), // Gera formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)
        id_tipo_pagamento: id_tipo_pagamento,
        entrega: entrega.value,
        id_cliente: id_cliente,
        id_emitente: 1,
        rua_entrega: rua_entrega,
        numero_entrega: numero_entrega,
        id_bairro_entrega: id_bairro,
        telefone_entrega: telefone_cliente

    };

    console.log("hora: ", novaNotaVenda.data_nota_venda)
    



    


    try {
        // Adicionar a nova nota à lista de notas
        let nota_venda_retornada = null;
        nota_venda_retornada = await CRUD_API("notas-venda", "POST", null, novaNotaVenda);
        notas.push(nota_venda_retornada);

        

        const id_nota_venda = nota_venda_retornada.id_nota_venda;

        // Criar os objetos item_nota_venda associados a esta nota
        const itensNotaVenda = cart.map((item, index) => {
            
            
            return {
                id_item_da_nota: index + 1, // Incrementa o ID do item
                id_nota_venda: id_nota_venda, // Associa ao ID da nota de venda
                id_produto: item.produto.id_produto,
                quantidade_item: item.quantidade_cart,
                valor_total: item.valor_total
            };
        });

        

        

        //-------------------------------------novo--------------------

        const nota_JSON = {
            id_tipo_pagamento: 1,
            id_nota_venda: id_nota_venda,
            valor_frete: frete || null,
            entrega: entrega.value
        }

        const dados_produto_JSON = {
            itens: cart.map((item) => {
                return {  
                    id_produto: item.produto.id_produto,  // ID do produto a partir do item do carrinho
                    quantidade: item.quantidade_cart,      // Quantidade do produto no carrinho
                    valor_total: item.valorTotal           // Valor total do item no carrinho
                };
            })
        };
        
        let cliente_JSON = {

        };

        const documentoInput = document.getElementById('CPF/CNPJ_cliente');
        console.log('aqqqq', documentoInput.value)

        if (documentoInput) {
            // Remove caracteres não numéricos
            let valor_documento = documentoInput.value.replace(/\D/g, '');

            let tipo_documento = ""; // Declara a variável fora do bloco

            if (valor_documento.length === 11) {
                tipo_documento = "CPF"; // Corrigido para CPF
            } else if (valor_documento.length === 14) {
                tipo_documento = "CNPJ"; // Corrigido para CNPJ
            }

            // Apenas cria o objeto se o tipo de documento estiver definido
            if (tipo_documento) {
                cliente_JSON = {
                    valor_documento: valor_documento,
                    tipo_documento: tipo_documento
                };
            }
        } else {
            console.error('Elemento CPF/CNPJ_cliente não encontrado.');
        }

        let novoJson = {
            dados_nota: nota_JSON,
            cliente: cliente_JSON || null, // Use o dicionário criado acima
            produtos: dados_produto_JSON
        };
        
        
        try{
            resultado = await emitir_NFCE(novoJson);
            if (resultado){
                // Adicionar os itens da nota à lista existente
                itens.push(...itensNotaVenda);

                // Salvar os itens da nota no localStorage
                localStorage.setItem('item_nota_venda', JSON.stringify(itens));
                // Salvar no localStorage
                localStorage.setItem('vendas', JSON.stringify(notas));

                // Função principal para adicionar todos os itens
                await adicionarItens(itensNotaVenda);

                // Confirmar a ação
                localStorage.removeItem("cart");
                M.toast({html: `Venda cadastrada com sucesso!`, classes: 'green'});
                M.toast({html: `Nota emitida`, classes: 'green'});

                // Fechar Modal
                const modalInstance = M.Modal.getInstance(document.getElementById('modal-finalizar'));
                if (modalInstance) {
                    modalInstance.close();
                }

                // Atualizar a quantidade no HTML para cada produto
                itensNotaVenda.forEach(item => {
                    atualizarQuantidadeNoHTML(item.id_produto);
                });
                setTimeout(function (){
                    window.open('../pages/NFC-e.html','_blank');
                }, 1000);
            } else {
                 // Verifica se a mensagem de erro contém "Rejeição: CPF do destinatário inválido"
                 M.toast({html: `CPF do destinatário inválido`, classes: 'red'}); // Exibe mensagem de CPF inválido
                 await CRUD_API("notas-venda", "DELETE", id_nota_venda, null);
            }
        }
        catch(error) {
            console.error('erro ao emitir nfce ', error);
        }

    } catch (error) {
        console.error('Erro ao confirmar o pedido:', error);
    }
}

// Função para adicionar itens
async function adicionarItens(itensNotaVenda) {
    try {
        const promises = itensNotaVenda.map(async (item) => {
            await CRUD_API("itens-nota-venda", "POST", null, item); // Chama a função CRUD_API para cada item
        });
        await Promise.all(promises);
    } catch (error) {
        console.error('Erro ao adicionar itens:', error);
    }
}

async function emitir_NFCE(dados_JSON) {
    try {
        const response = (await CRUD_API("emitir-nfe", "POST", null, dados_JSON));
        
        if (response.status === 'success') {
            // Converte 'data' de string JSON para objeto JSON
            console.log("aqui: ", response);
            const data = (response.data);
            console.log('Objeto JSON:', data); // Exibe o objeto JSON corretamente

            if (data != null) {
                
                let JSON_dados = {'dados': data}
                console.log("teste: ", JSON.stringify(JSON_dados))
                localStorage.setItem('notaFiscalData', JSON.stringify(data));
                //await CRUD_API("salvar_NFE", "POST", null, JSON.stringify(data)); 
                await CRUD_API("nota-fiscal", 'POST', null, JSON_dados);
                return true; // Retorna true quando a nota é emitida com sucesso
            } else {
                M.toast({html: `Erro ao emitir Nota`, classes: 'red'});
                return false; // Retorna false se data for nulo
            }
        } else if (response.status === 'error') {
            console.log("cai aqui")
            M.toast({html: `${response.erro}`, classes: 'red'});
            return false; // Retorna false em caso de erro
        }
    } catch (error) {
        console.error('Erro ao emitir nota fiscal', error);
        return false; // Retorna false em caso de erro na função
    }
}

