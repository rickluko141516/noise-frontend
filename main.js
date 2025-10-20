// ===== CONFIGURAÇÕES GLOBAIS =====
const API_URL = 'https://seu-backend-noise.onrender.com/api';
let paginaAtual = 'index';

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarSite();
    carregarContadorTempo();
    carregarMensagemDiaria();
    configurarEventListeners();
});

function inicializarSite() {
    // Verificar se há uma página específica carregada
    const path = window.location.hash.replace('#', '');
    if (path) {
        navegarPara(path);
    }
    
    // Configurar efeitos visuais
    criarCoraçõesFlutuantes();
    inicializarEfeitosRomanticos();
}

// ===== NAVEGAÇÃO =====
function navegarPara(pagina) {
    // Animação de saída
    document.querySelector('main').classList.add('fade-out');
    
    setTimeout(() => {
        window.location.hash = pagina;
        paginaAtual = pagina;
        
        // Carregar conteúdo específico da página
        carregarConteudoPagina(pagina);
        
        // Animação de entrada
        setTimeout(() => {
            document.querySelector('main').classList.remove('fade-out');
            document.querySelector('main').classList.add('fade-in');
        }, 100);
    }, 300);
}

function carregarConteudoPagina(pagina) {
    switch(pagina) {
        case 'mural-fotos':
            carregarMuralFotos();
            break;
        case 'jogos-interativos':
            carregarJogos();
            break;
        case 'metas-casais':
            carregarMetas();
            break;
        case 'mapa-amor':
            carregarMapa();
            break;
        case 'mensagens':
            carregarMensagens();
            break;
        case 'timeline':
            carregarTimeline();
            break;
    }
}

// ===== CONTADOR DE TEMPO JUNTOS =====
function carregarContadorTempo() {
    // Data do início do relacionamento (ajuste para a data de vocês!)
    const dataInicio = new Date('2023-01-01'); // ⚠️ ALTERE PARA SUA DATA!
    const agora = new Date();
    
    const diffTempo = agora - dataInicio;
    const dias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const anos = Math.floor(meses / 12);
    
    const contador = document.getElementById('contador-tempo');
    if (contador) {
        contador.innerHTML = `
            <div class="tempo-item">${anos} <small>anos</small></div>
            <div class="tempo-item">${meses % 12} <small>meses</small></div>
            <div class="tempo-item">${dias} <small>dias</small></div>
        `;
    }
}

// ===== MENSAGEM DIÁRIA =====
async function carregarMensagemDiaria() {
    const mensagens = [
        "Te amo mais do que todas as estrelas no céu! ✨",
        "Você é a razão do meu sorriso todos os dias! 😊",
        "Cada momento contigo é um tesouro para sempre! 💎",
        "Meu coração bate mais forte quando estou com você! 💓",
        "Você é meu maior sonho realizado! 🌟",
        "A distância não diminui meu amor, só aumenta minha saudade! 💕",
        "Cada dia ao seu lado é uma nova aventura! 🚀",
        "Você é a pessoa mais especial da minha vida! 🥰",
        "Meu amor por você cresce a cada segundo! 🌱",
        "Você é minha felicidade em forma de pessoa! 😍"
    ];
    
    const hoje = new Date().getDate();
    const mensagemIndex = hoje % mensagens.length;
    const mensagemElement = document.getElementById('mensagem-diaria');
    
    if (mensagemElement) {
        mensagemElement.textContent = mensagens[mensagemIndex];
        mensagemElement.classList.add('typewriter');
    }
}

// ===== EFEITOS VISUAIS =====
function criarCoraçõesFlutuantes() {
    const cores = ['#ff6b8b', '#c47ac0', '#5d7af2', '#7ae7a5', '#ffd166'];
    
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% de chance de criar coração
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.className = 'heart-rain';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.color = cores[Math.floor(Math.random() * cores.length)];
            heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            document.body.appendChild(heart);
            
            // Remover após animação
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 5000);
        }
    }, 1000);
}

function inicializarEfeitosRomanticos() {
    // Efeito de glitter nos títulos
    const titulos = document.querySelectorAll('h1, h2, h3');
    titulos.forEach(titulo => {
        titulo.addEventListener('mouseenter', function() {
            this.classList.add('text-glow');
        });
        
        titulo.addEventListener('mouseleave', function() {
            this.classList.remove('text-glow');
        });
    });
}

// ===== FUNÇÕES RÁPIDAS =====
function adicionarMetaRapida() {
    navegarPara('metas-casais');
    setTimeout(() => {
        document.getElementById('titulo-meta').focus();
    }, 500);
}

function enviarMensagemRapida() {
    navegarPara('mensagens');
    setTimeout(() => {
        document.getElementById('texto-mensagem').focus();
    }, 500);
}

async function verFotoAleatoria() {
    try {
        const response = await fetch(`${API_URL}/fotos`);
        const fotos = await response.json();
        
        if (fotos.length > 0) {
            const fotoAleatoria = fotos[Math.floor(Math.random() * fotos.length)];
            mostrarModalFoto(fotoAleatoria);
        } else {
            mostrarNotificacao('📸 Ainda não temos fotos no mural!', 'info');
        }
    } catch (error) {
        console.error('Erro ao carregar foto aleatória:', error);
        mostrarNotificacao('❌ Erro ao carregar foto', 'error');
    }
}

function iniciarJogoRapido() {
    navegarPara('jogos-interativos');
    setTimeout(() => {
        const jogos = document.querySelectorAll('.jogo-card');
        if (jogos.length > 0) {
            jogos[0].click();
        }
    }, 500);
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-popup ${tipo}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getIconeNotificacao(tipo)}</span>
            <span class="notification-text">${mensagem}</span>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getCorNotificacao(tipo)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        animation: slideInFromRight 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

function getIconeNotificacao(tipo) {
    const icones = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': '💡',
        'love': '💖'
    };
    return icones[tipo] || '💡';
}

function getCorNotificacao(tipo) {
    const cores = {
        'success': '#7ae7a5',
        'error': '#ff6b8b',
        'warning': '#ffd166',
        'info': '#5d7af2',
        'love': '#c47ac0'
    };
    return cores[tipo] || '#5d7af2';
}

// ===== SISTEMA DE CÓDIGOS SECRETOS =====
let codigoSecreto = '';
document.addEventListener('keydown', function(e) {
    codigoSecreto += e.key.toLowerCase();
    
    if (codigoSecreto.includes('amor')) {
        ativarSurpresaSecreta();
        codigoSecreto = '';
    }
    
    // Limitar tamanho do código
    if (codigoSecreto.length > 10) {
        codigoSecreto = codigoSecreto.slice(-10);
    }
});

function ativarSurpresaSecreta() {
    // Chover corações
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.className = 'heart-rain';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 25 + 20) + 'px';
            heart.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 3000);
        }, i * 100);
    }
    
    // Mostrar mensagem especial
    mostrarNotificacao('💝 Você descobriu o segredo! Te amo!', 'love');
    
    // Tocar som especial (se houver)
    const audio = new Audio();
    audio.src = 'assets/music/surpresa.mp3'; // Adicione um arquivo MP3
    audio.play().catch(e => console.log('Áudio não disponível'));
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
function configurarEventListeners() {
    // Fechar modal ao clicar fora
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('modal-foto');
        if (modal && e.target === modal) {
            fecharModal('modal-foto');
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal-foto');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    fecharModal(modal.id);
                }
            });
        }
    });
}

// ===== FUNÇÕES UTILITÁRIAS =====
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function gerarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function mostrarLoading(elemento) {
    elemento.innerHTML = '<div class="loading-spinner"></div>';
}

function esconderLoading(elemento, conteudo) {
    elemento.innerHTML = conteudo;
}