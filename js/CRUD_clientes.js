function listarClientes() {

    const dadosContainer = document.getElementById('dados-api');

    clientes = JSON.parse(localStorage.getItem("clientes"));
    bairros = JSON.parse(localStorage.getItem("bairros"));
    clientes.forEach(item => {
        const row = document.createElement('tr'); // Cria uma nova linha de tabela
        row.id = "cliente-" + item.id_cliente;

        // Cria células para cada campo do item
        const cellCodigo = document.createElement('td');
        cellCodigo.textContent = item.id_cliente;
        row.appendChild(cellCodigo);

        const cellNome = document.createElement('td');
        cellNome.textContent = item.nome_cliente;
        row.appendChild(cellNome);

        const cellTell = document.createElement('td');
        cellTell.textContent = item.telefone_cliente || 'N/A';
        row.appendChild(cellTell);

        const cellRua = document.createElement('td');
        cellRua.textContent = item.rua_cliente || 'N/A';
        row.appendChild(cellRua);

        const cellNumero = document.createElement('td');
        cellNumero.textContent = item.numero_cliente || 'N/A';
        row.appendChild(cellNumero);


            // BAIRRO
        const index = bairros.findIndex(c => c.id_bairro === parseInt(item.id_bairro));

        bairro = bairros[index];

        const cellBairro = document.createElement('td');
        cellBairro.textContent = bairro.nome_bairro || 'N/A';
        row.appendChild(cellBairro);

        document.querySelector('tbody').appendChild(row);

        // Cria a célula de ações com os ícones
        const cellAcoes = document.createElement('td');
        const divAcoes = document.createElement('div');
        divAcoes.className = 'icon-actions'; // Classe para estilizar a div de ações

        // Botão de Editar com ícone
        const btnEditar = document.createElement('a');
        btnEditar.className = '  table-icons waves-effect waves-light btn-small modal-trigger'; // Classes do Materialize CSS
        btnEditar.id = "btns-home";
        btnEditar.setAttribute('data-target', 'editar-cliente'); // Define o ID do modal
        btnEditar.onclick = () => {
            editarCliente(item.id_cliente); // Chama a função de edição com o ID do cliente
        };

        // Cria o ícone de editar do Materialize
        const iconEditar = document.createElement('i');
        iconEditar.className = 'material-icons client-icon'; // Classe do Material Icons
        iconEditar.textContent = 'edit'; // Nome do ícone

        // Adiciona o ícone ao link
        btnEditar.appendChild(iconEditar);

        // Adiciona o link ao container de ações
        divAcoes.appendChild(btnEditar);

        // Botão de Excluir com ícone
        const btnRemover = document.createElement('a');
        btnRemover.id = "btns-home";
        btnRemover.className = ' table-icons waves-effect waves-light btn-small'; // Classes do Materialize CSS
        btnRemover.onclick = () => deletarCliente(item.id_cliente); // Define o evento onclick

        // Cria o ícone de remover do Materialize
        const iconRemover = document.createElement('i');
        iconRemover.className = 'material-icons client-icon'; // Classe do Material Icons
        iconRemover.textContent = 'delete'; // Nome do ícone

        // Adiciona o ícone ao link
        btnRemover.appendChild(iconRemover);

        // Adiciona o link ao container de ações
        divAcoes.appendChild(btnRemover);

        // Adiciona o container de ações à célula
        cellAcoes.appendChild(divAcoes);

        // Adiciona a célula de ações à linha da tabela
        row.appendChild(cellAcoes);

        dadosContainer.appendChild(row);
    });
}

function editarCliente(id_cliente) {

    $(document).ready(function () {
        M.updateTextFields();
    });
    
    let clientes = [];
    
    async function carregarDados() {
        clientes = JSON.parse(localStorage.getItem("clientes")); // Chama a função e espera sua resolução
        
        console.log('teste ok', clientes); // Exibe os cientea recuperados
        if (!Array.isArray(clientes)) {
            console.error('O retorno de getLocalStorage não é um array.', clientes);
            return;
        }
        const cliente = clientes.find(c => c.id_cliente === parseInt(id_cliente));

        if (cliente) {
            console.log('Cliente encontrado:', cliente);

            // Preenche os campos do formulário com os dados do cliente
           preencherFormulario(cliente);

        } else {
            console.error('Cliente não encontrado no localStorage.');
        }
    }
    
    carregarDados();  
        
    
    function preencherFormulario(cliente) {
        // Verifique se todos os elementos existem antes de acessar suas propriedades
        const inputId = document.getElementById('id');
        const inputNome = document.getElementById('nome');
        const inputTelefone = document.getElementById('telefone');
        const inputRua = document.getElementById('rua');
        const inputNumero = document.getElementById('numero');
        const inputID_Bairro = document.getElementById('id_bairro');
        const inputBairro = document.getElementById('input-bairro');

        
        if (inputId && inputNome && inputTelefone && inputRua && inputNumero && inputBairro) {
            inputId.value = cliente.id_cliente || '';
            inputNome.value = cliente.nome_cliente || '';
            inputTelefone.value = cliente.telefone_cliente || '';
            inputRua.value = cliente.rua_cliente || '';
            inputNumero.value = cliente.numero_cliente || '';
            inputID_Bairro.value = cliente.id_bairro || '';
            
            
            // Obtém a lista de bairros do localStorage
            const bairros = JSON.parse(localStorage.getItem('bairros')) || [];
            // Busca o bairro pelo ID
            const bairro = bairros.find(b => b.id_bairro === cliente.id_bairro);
            // Preenche o campo de bairro com o nome do bairro, se encontrado
            if (bairro) {
                inputBairro.value = bairro.nome_bairro;
            } else {
                inputBairro.value = ''; // Limpa o campo se não encontrado
                document.getElementById('id_bairro').value = ''; // Limpa o ID do bairro se não encontrado
            }
        } else {
            console.error("Um ou mais elementos do formulário não foram encontrados no DOM.");
        }
    }
    
    // Obtém o formulário e adiciona um ouvinte de evento para o envio
    document.getElementById('cliente-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário
    
        // Obtém os dados do formulário
        const id_cliente = parseInt(document.getElementById('id').value);
        const nome_cliente = document.getElementById('nome').value;
        const telefone_cliente = document.getElementById('telefone').value;
        const rua_cliente = document.getElementById('rua').value;
        const numero_cliente = document.getElementById('numero').value;
        const id_bairro = parseInt(document.getElementById('id_bairro').value);
    
        // Dados a serem enviados
        const clienteAtualizado = {
            id_cliente: id_cliente,
            nome_cliente: nome_cliente,
            telefone_cliente: telefone_cliente,
            rua_cliente: rua_cliente,
            numero_cliente: numero_cliente,
            id_bairro: id_bairro
        };

        

        CRUD_API("clientes", "PUT", id_cliente, clienteAtualizado);
    
        // o próximo código deve ser removido e o código comentado deve voltar quando for conectar com a API
    
        function atualizarLocalStorage() {
            let clientes = JSON.parse(localStorage.getItem("clientes")) || []; // Obtém clientes ou inicializa como array vazio
    
            // Encontra o índice do cliente a ser atualizado
            const index = clientes.findIndex(c => c.id_cliente === parseInt(clienteAtualizado.id_cliente));
    
            if (index !== -1) {
                // Atualiza o cliente no array
                clientes[index] = clienteAtualizado;
                // Salva o array atualizado no localStorage
                localStorage.setItem('clientes', JSON.stringify(clientes));
                M.toast({html: `Cliente com ID ${id_cliente} editado com sucesso!`, classes: 'green'});
                window.location.reload(); // Recarrega a página para refletir as alterações
            } else {
                console.error('Cliente não encontrado no localStorage.');
            }
        }
    
        // Chama a função para atualizar o localStorage
        atualizarLocalStorage();
    });
    
}

async function deletarCliente(idCliente) {
    try {
        // Chama a API para deletar o cliente
        await CRUD_API("clientes", "DELETE", idCliente);
        
        // Obter a lista de clientes do localStorage
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

        // Filtrar a lista de clientes para remover o cliente específico
        clientes = clientes.filter(cliente => cliente.id_cliente !== idCliente);

        // Atualizar o localStorage com a nova lista de clientes
        localStorage.setItem('clientes', JSON.stringify(clientes));

        // Remover o elemento da tabela na interface
        const row = document.getElementById(`cliente-${idCliente}`);
        if (row) {
            row.remove();
        }

        // Exibir mensagem de sucesso
        M.toast({html: `Cliente com ID ${idCliente} deletado com sucesso!`, classes: 'green'});
    } catch (error) {
        // Exibir mensagem de erro
        M.toast({html: `Erro ao deletar o cliente: ${error.message}`, classes: 'red '});
    }
}


async function cadastrarCliente() {
    // Obtendo os valores dos campos


    
    const nome_cliente = document.getElementById('nome_cliente').value;
    const telefone_cliente = document.getElementById('telefone_cliente').value;
    const rua_cliente = document.getElementById('rua_cliente').value;
    const numero_cliente = document.getElementById('numero_cliente').value;
    const id_bairro = parseInt(document.getElementById('id_bairro').value);

    // Criar um objeto de cliente
    let cliente = {
        nome_cliente,
        telefone_cliente,
        rua_cliente,
        numero_cliente,
        id_bairro
    };

    cliente_retornado_API = await CRUD_API("clientes", "POST",null , cliente);

    console.log(cliente_retornado_API);
    // Recuperar clientes existentes do localStorage
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    // Adicionar o novo cliente
    clientes.push(cliente_retornado_API);


    // Atualizar o localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));

    M.toast({html: `Cliente cadastrado com sucesso!`, classes: 'green centered'});

    M.updateTextFields(); // Atualizar os campos do Materialize

    // Limpar o formulário após o cadastro
    document.getElementById('cadastrar-cliente-form').reset();
}


