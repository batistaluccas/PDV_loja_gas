function exibir_user() {
    const username = sessionStorage.getItem('username');
    if (username) {
        document.getElementById("username").textContent = "Usuário logado: " + username;
    } else {
        document.getElementById("username").textContent = "Usuário não autenticado";
    }
}

// Função para carregar a sidebar de um arquivo externo
function loadSidebar(caminho) {
    fetch(caminho)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            // Inicializar a sidebar após carregá-la
            var elems = document.querySelectorAll('.sidenav');
            M.Sidenav.init(elems);

            // Chamar a função para exibir o usuário após a sidebar ser carregada
            exibir_user();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function logout() {
    // Adiciona uma confirmação
    const confirmLogout = confirm("Você realmente deseja sair do sistema?");
    
    // Se o usuário confirmar, prossegue com o logout
    if (confirmLogout) {
        // Remover token ou limpar dados de autenticação do localStorage ou sessionStorage
        sessionStorage.removeItem('authToken'); // Remove o token de autenticação
        sessionStorage.removeItem('username'); // Remove o nome de usuário, se armazenado

        // Redirecionar para a página de login
        window.location.href = '/login.html'; // Ajuste o caminho conforme sua aplicação
    }
}
