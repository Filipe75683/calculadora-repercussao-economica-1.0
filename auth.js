// Arquivo de autenticação global
const API_BASE_URL = '/api'; // Usar caminho relativo para produção

// Classe para gerenciar autenticação
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        this.userData = JSON.parse(localStorage.getItem('user_data') || 'null');
    }
    
    // Verificar se o usuário está autenticado
    isAuthenticated() {
        return !!this.token;
    }
    
    // Verificar se o usuário é administrador
    isAdmin() {
        return this.userData && this.userData.is_admin;
    }
    
    // Obter dados do usuário
    getUser() {
        return this.userData;
    }
    
    // Obter token de autenticação
    getToken() {
        return this.token;
    }
    
    // Obter headers de autenticação
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
    
    // Fazer login
    async login(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                this.userData = data.user;
                
                localStorage.setItem('auth_token', this.token);
                localStorage.setItem('user_data', JSON.stringify(this.userData));
                
                return { success: true, data: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }
    
    // Fazer logout
    async logout() {
        try {
            if (this.token) {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: this.getAuthHeaders()
                });
            }
        } catch (error) {
            console.error('Erro no logout:', error);
        }
        
        this.token = null;
        this.userData = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    }
    
    // Verificar status de autenticação no servidor
    async checkAuthStatus() {
        if (!this.token) {
            return { authenticated: false };
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/check`, {
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                this.userData = data.user;
                localStorage.setItem('user_data', JSON.stringify(this.userData));
                return { authenticated: true, user: data.user };
            } else {
                this.logout();
                return { authenticated: false };
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return { authenticated: false, error: error.message };
        }
    }
    
    // Redirecionar para login se não autenticado
    requireAuth(redirectToLogin = true) {
        if (!this.isAuthenticated()) {
            if (redirectToLogin) {
                window.location.href = 'login.html';
            }
            return false;
        }
        return true;
    }
    
    // Redirecionar para login se não for admin
    requireAdmin(redirectToLogin = true) {
        if (!this.isAuthenticated() || !this.isAdmin()) {
            if (redirectToLogin) {
                window.location.href = 'login.html';
            }
            return false;
        }
        return true;
    }
}

// Instância global do gerenciador de autenticação
const authManager = new AuthManager();

// Função para adicionar elementos de autenticação ao cabeçalho
function addAuthElements() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Criar container para elementos de autenticação
    const authContainer = document.createElement('div');
    authContainer.id = 'auth-container';
    authContainer.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.5rem 1rem;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;
    
    if (authManager.isAuthenticated()) {
        const user = authManager.getUser();
        authContainer.innerHTML = `
            <span style="color: #333; font-size: 0.9rem;">
                Olá, <strong>${user.username}</strong>
                ${user.is_admin ? '<span style="background: #9b59b6; color: white; padding: 0.1rem 0.3rem; border-radius: 3px; font-size: 0.7rem; margin-left: 0.5rem;">ADMIN</span>' : ''}
            </span>
            ${user.is_admin ? '<a href="admin.html" style="color: #3498db; text-decoration: none; font-size: 0.9rem;">Administração</a>' : ''}
            <button id="logout-btn" style="background: #e74c3c; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 3px; cursor: pointer; font-size: 0.8rem;">Sair</button>
        `;
        
        // Adicionar event listener para logout
        const logoutBtn = authContainer.querySelector('#logout-btn');
        logoutBtn.addEventListener('click', async () => {
            await authManager.logout();
            window.location.href = 'login.html';
        });
    } else {
        authContainer.innerHTML = `
            <a href="login.html" style="background: #3498db; color: white; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none; font-size: 0.9rem;">Fazer Login</a>
        `;
    }
    
    header.style.position = 'relative';
    header.appendChild(authContainer);
}

// Função para proteger páginas que requerem autenticação
function protectPage(requireAdmin = false) {
    document.addEventListener('DOMContentLoaded', async () => {
        // Verificar autenticação no servidor
        const authStatus = await authManager.checkAuthStatus();
        
        if (!authStatus.authenticated) {
            showLoginModal();
            return;
        }
        
        if (requireAdmin && !authManager.isAdmin()) {
            alert('Acesso negado. Apenas administradores podem acessar esta página.');
            showLoginModal();
            return;
        }
        
        // Adicionar elementos de autenticação ao cabeçalho
        addAuthElements();
    });
}

// Função para mostrar modal de login
function showLoginModal() {
    // Ocultar conteúdo principal
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.display = 'none';
    }

    // Remover modal existente
    const existingModal = document.getElementById('login-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Criar modal de login
    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 400px; width: 90%; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <h2 style="text-align: center; margin-bottom: 1.5rem; color: #333;">Acesso Restrito</h2>
            <p style="text-align: center; margin-bottom: 2rem; color: #666;">Esta calculadora requer autenticação para uso.</p>
            
            <form id="modal-login-form">
                <div style="margin-bottom: 1rem;">
                    <label for="modal-username" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Usuário:</label>
                    <input type="text" id="modal-username" required 
                           style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label for="modal-password" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Senha:</label>
                    <input type="password" id="modal-password" required 
                           style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; box-sizing: border-box;">
                </div>
                <button type="submit" style="width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; margin-bottom: 1rem;">
                    Entrar
                </button>
            </form>
            
            <div id="modal-login-message" style="text-align: center; margin-top: 1rem; display: none;"></div>
            
            <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 0.9rem;">
                <p>Entre em contato com o administrador para obter credenciais de acesso.</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listener para o formulário
    document.getElementById('modal-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('modal-username').value;
        const password = document.getElementById('modal-password').value;
        const messageEl = document.getElementById('modal-login-message');
        
        messageEl.style.display = 'block';
        messageEl.textContent = 'Verificando credenciais...';
        messageEl.style.color = '#007bff';

        const result = await authManager.login(username, password);
        
        if (result.success) {
            messageEl.textContent = 'Login realizado com sucesso!';
            messageEl.style.color = '#28a745';
            
            setTimeout(() => {
                modal.remove();
                if (mainContent) {
                    mainContent.style.display = 'block';
                }
                addAuthElements();
                location.reload(); // Recarregar para aplicar autenticação
            }, 1000);
        } else {
            messageEl.textContent = result.message || 'Erro no login';
            messageEl.style.color = '#dc3545';
        }
    });
}

// Função para verificar se o servidor está rodando
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'GET',
            timeout: 5000
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Função para mostrar aviso se o servidor não estiver rodando
async function showServerWarning() {
    const isServerRunning = await checkServerStatus();
    
    if (!isServerRunning) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #f39c12;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 9999;
            font-weight: bold;
        `;
        warning.innerHTML = `
            ⚠️ Servidor não está rodando. As funcionalidades de login não estarão disponíveis.
            <br>
            <small>Para usar o sistema completo, inicie o servidor backend conforme as instruções.</small>
        `;
        
        document.body.insertBefore(warning, document.body.firstChild);
        
        // Ajustar padding do body para compensar o aviso
        document.body.style.paddingTop = '80px';
    }
}

// Verificar status do servidor ao carregar qualquer página
document.addEventListener('DOMContentLoaded', () => {
    showServerWarning();
});

// Exportar para uso global
window.authManager = authManager;
window.protectPage = protectPage;
window.API_BASE_URL = API_BASE_URL;

