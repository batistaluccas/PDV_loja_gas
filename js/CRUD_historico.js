async function filtrarVendas() {
    const dataInicio = document.getElementById("data-inicio").value; // Obter data de início
    const dataFim = document.getElementById("data-fim").value; // Obter data de fim
    document.getElementById("tabela-clientes").style.display = '';

    // Função para converter data do formato MM/DD/YYYY para YYYY-MM-DD
    function converterData(data) {
        const partes = data.split("/");
        if (partes.length === 3) {
            // Verifica se o formato está correto
            return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
        return data; // Retorna a data original se não estiver no formato esperado
    }

    // Convertendo as datas para o formato correto
    const dataInicioFormatada = converterData(dataInicio);
    const dataFimFormatada = converterData(dataFim);

    const dados = {
        data_inicio: dataInicioFormatada,
        data_fim: dataFimFormatada
    };

    console.log(dados);

    try {
        // Chamar a função CRUD_API para fazer a requisição
        const vendas = await CRUD_API('filtrar-vendas/listar_vendas_periodo', 'POST', null, dados);

        // Verifica se retornou vendas
        if (vendas && Array.isArray(vendas)) {
            popularTabela(vendas);
        } else {
            console.warn('Nenhuma venda encontrada para o período informado.');
            popularTabela([]); // Limpar a tabela se não houver vendas
        }
    } catch (error) {
        console.error('Erro ao filtrar vendas:', error);
    }
}

function popularTabela(vendas) {
    clientes = JSON.parse(localStorage.getItem("clientes"));

    function getNomeCliente(idCliente) {
        const clienteEncontrado = clientes.find(cliente => cliente.id_cliente === idCliente);
        return clienteEncontrado ? clienteEncontrado.nome_cliente : 'Não informado'; // Retorna 'N/A' se não encontrar
    }

    const tabelaCorpo = document.getElementById("tabela-corpo");
    tabelaCorpo.innerHTML = ""; // Limpa a tabela antes de adicionar novas linhas

    vendas.forEach(venda => {
        const nome_cliente = getNomeCliente(venda.id_cliente);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${venda.id_nota_venda}</td>
            <td>${nome_cliente || 'Não informado'}</td>
            <td>${formatar_data(venda.data_nota_venda).dataFormatada || 'N/A'}</td>
            <td>${formatar_data(venda.data_nota_venda).horaFormatada || 'N/A'}</td>
            <td>${venda.rua_entrega || 'retirada'}</td>
            <td>${venda.telefone_entrega || 'Não informado'}</td>
            <td>${venda.valor_total.toFixed(2)}</td>
            <td>
                <a class="table-icons waves-effect waves-light btn-small modal-trigger" 
                id="btns-home" 
                data-target="detalhar-venda" 
                onclick="detalharVenda(${venda.id_nota_venda})">
                    <i class="material-icons venda-icon">visibility</i>
                </a>
            </td>
        `;
        tabelaCorpo.appendChild(row);
    });
}

function formatar_data(data_nao_formatada) {
    // Converte para um objeto Date
    const dataObj = new Date(data_nao_formatada);

    // Formata para dd/mm/aaaa hh:mm:ss
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês é indexado de 0 a 11
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    const segundos = String(dataObj.getSeconds()).padStart(2, '0');

    // Monta a string no formato desejado
    return {
        dataFormatada: `${dia}/${mes}/${ano}`,
        horaFormatada: `${horas}:${minutos}:${segundos}`
    }
}