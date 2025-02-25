// Chama a função para verificar e executar setLocalStorage
setarLocalStorageUmaVezPorDia();

function setarLocalStorageUmaVezPorDia() {
  const chaveDataAtualizacao = 'ultimaAtualizacao';
  const dataAtual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  // Verifica se a chave existe no localStorage
  const ultimaAtualizacao = localStorage.getItem(chaveDataAtualizacao);

  if (ultimaAtualizacao === null) {
      // Se a chave não existe, significa que nunca foi atualizado
      setLocalStorage();
      localStorage.setItem(chaveDataAtualizacao, dataAtual);
      console.log('setLocalStorage() chamado pela primeira vez.');
  } else if (ultimaAtualizacao !== dataAtual) {
    // Se a última atualização não for igual à data atual, atualiza
    setLocalStorage();
    localStorage.setItem(chaveDataAtualizacao, dataAtual);
    console.log('setLocalStorage() chamado e localStorage atualizado.');
  } else {
    console.log('setLocalStorage() já foi chamado hoje.');
  }
}

async function setLocalStorage() {
  try {
    // Dados padrão para produtos e clientes, usando await para esperar o resultado das chamadas assíncronas
    const produtos = await CRUD_API("produtos", "GET");
    const clientes = await CRUD_API("clientes", "GET");  
    const bairros = await CRUD_API("bairros", "GET");
    const vendas = await CRUD_API("balanco-diario", "GET");
    const tipo_pagamento = await CRUD_API("tipos-pagamento", "GET");
    
    const cart = [];
    const nota_venda = [];
    const item_nota_venda = [];
    
    // Define os dados no localStorage
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('bairros', JSON.stringify(bairros));
    localStorage.setItem('nota_venda', JSON.stringify(nota_venda));
    localStorage.setItem('item_nota_venda', JSON.stringify(item_nota_venda));
    localStorage.setItem('vendas', JSON.stringify(vendas));
    localStorage.setItem('tipo_pagamento', JSON.stringify(tipo_pagamento));
      
      console.log('Dados armazenados com sucesso no localStorage');
    } catch (error) {
      console.error('Erro ao definir dados no localStorage:', error);
    }
  }


  
async function CRUD_API(tabela, metodo, id, dados = null) {
  // URL da API onde os dados serão enviados
  let url = `https://zzgdqoz2m1.execute-api.sa-east-1.amazonaws.com/${tabela}/${id ? `${id}/` : ''}`; // Adiciona o ID à URL se ele existir
  //let url = `http://127.0.0.1:8000/API/${tabela}/${id ? `${id}/` : ''}`; // Adiciona o ID à URL se ele existir
  const token = sessionStorage.getItem("authToken");
  
  if (tabela === 'nota-fiscal' && metodo === 'GET'){
    url = url.replace(/\/$/, '');
  }

  console.log(token);

  // Configuração da requisição
  const options = {
    method: metodo,
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    }
  };

  // Adiciona o corpo da requisição se for necessário
  if (dados && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
    options.body = JSON.stringify(dados); // Converte os dados para JSON
  };

   // Adiciona a confirmação para o método DELETE
  if (metodo === 'DELETE' && tabela !== 'notas-venda') {
    const confirmacao = confirm('Você tem certeza que deseja excluir este item?');
    if (!confirmacao) {
      console.log('Operação cancelada pelo usuário.');
      return "cancelado"; // Cancela a operação se o usuário clicar em "Cancelar"
    }
  }

  try {
    const response = await fetch(url, options); // Realiza a requisição HTTP
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    if (response.status === 204) {
      console.log('Operação bem-sucedida, nenhum conteúdo retornado.');
      return; // Não há conteúdo para retornar
    }

    const resultado = await response.json(); // Converte a resposta para JSON
    
    console.log('aqui', resultado); // Exibe o resultado no console
    return resultado; // Retorna o resultado
  } catch (error) {
    console.error("Erro ao consumir a API:", error); // Trata erros na requisição
  }
}






