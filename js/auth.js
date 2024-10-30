async function login_API(dados_usuario) {
    try {
        const response = await auth_API("login", dados_usuario); // Realiza a requisição HTTP

        console.log('Response:', response); // Exibe a resposta no console

        // Verifique se a resposta contém o token
        if (!response || !response.token) {
            throw new Error("Token não recebido da API");
        }

        console.log('Logado com sucesso! Token:', response.token); // Exibe o token no console

        // Salvar o token em localStorage
        sessionStorage.setItem('authToken', response.token);

        return response.token; // Retorna o token
    } catch (error) {
        console.error("Erro ao logar", error); // Trata erros na requisição
        alert("Falha ao logar. Verifique suas credenciais."); // Mensagem de erro para o usuário
    }
}

async function verificarAutenticacao() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        // Se não houver token, redireciona para a página de login
        window.location.href = '/login.html'; // URL correta da página de login
        return; // Adiciona return para evitar continuar a execução
    }

    try {
        const response = await auth_API("validate-token", token); // Realiza a requisição HTTP
        
        // Verifica se a resposta é válida
        if (response) {
            console.log('Logado com sucesso! Usuário:', response.user); // Exibe o usuário no console
            return response.user;
        } else {
            console.log('Não autorizado'); // Exibe mensagem de não autorizado
            window.location.href = '/login.html'; // Redireciona para a página de login
        }
    } catch (error) {
        console.error("Erro ao verificar a autenticação", error); // Trata erros na requisição
    }
}

async function auth_API(tabela, dados) {
    //const url = `http://127.0.0.1:8000/API/${tabela}/`;
    const url = `https://zzgdqoz2m1.execute-api.sa-east-1.amazonaws.com/${tabela}/`;

    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (tabela === "validate-token") {
        options.headers.Authorization = `Token ${dados}`; // Adiciona o token no cabeçalho
    }

    if (dados && tabela === "login") {
        options.body = JSON.stringify(dados); // Converte os dados para JSON
    }

    try {
        const response = await fetch(url, options); // Realiza a requisição HTTP
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        return await response.json(); // Converte a resposta para JSON
    } catch (error) {
        console.error("Erro ao consumir a API:", error); // Trata erros na requisição
        return null; // Retorna null em caso de erro
    }
}
