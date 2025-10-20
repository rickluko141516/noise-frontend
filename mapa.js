// ===== SISTEMA DO MAPA DO AMOR =====
let visitas = {
    eu: 15,    // Você visitou ela
    ela: 12    // Ela te visitou
};

let proximaVisita = '2024-12-25'; // ⚠️ ALTERE PARA SUA PRÓXIMA VISITA!

async function carregarMapa() {
    atualizarInfoDistancias();
    atualizarContadorVisitas();
    atualizarProximaVisita();
    configurarMapaInterativo();
}

function atualizarInfoDistancias() {
    // Distância entre BH e JF (aproximadamente)
    const distancia = 180; // km
    const tempoViagem = '2h30';
    
    // Atualizar elementos
    const elementos = {
        'numero-distancia': `${distancia} km`,
        'tempo-viagem': `⏱️ ~${tempoViagem} de carro`
    };
    
    Object.entries(elementos).forEach(([classe, valor]) => {
        const elemento = document.querySelector(`.${classe}`);
        if (elemento) {
            elemento.textContent = valor;
        }
    });
}

function atualizarContadorVisitas() {
    document.getElementById('visitas-eu').textContent = `${visitas.eu} vezes`;
    document.getElementById('visitas-ela').textContent = `${visitas.ela} vezes`;
}

function atualizarProximaVisita() {
    const agora = new Date();
    const dataProxima = new Date(proximaVisita);
    const diffTempo = dataProxima - agora;
    const diasRestantes = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
    
    const contador = document.getElementById('contador-proxima-visita');
    if (contador) {
        if (diasRestantes > 0) {
            contador.innerHTML = `
                <div class="contador-dias">${diasRestantes} <small>dias</small></div>
                <div class="contador-data">${formatarData(proximaVisita)}</div>
            `;
        } else {
            contador.innerHTML = `
                <div class="contador-hoje">🎉 É hoje! 🎉</div>
            `;
        }
    }
}

function configurarMapaInterativo() {
    // Configurar interações do mapa SVG
    const cidadeBH = document.querySelector('.cidade-bh');
    const cidadeJF = document.querySelector('.cidade-jf');
    
    if (cidadeBH) {
        cidadeBH.addEventListener('click', mostrarInfoBH);
        cidadeBH.style.cursor = 'pointer';
    }
    
    if (cidadeJF) {
        cidadeJF.addEventListener('click', mostrarInfoJF);
        cidadeJF.style.cursor = 'pointer';
    }
}

function mostrarInfoBH() {
    mostrarNotificacao('🌆 Belo Horizonte - Onde meu amor mora! 💝', 'love');
}

function mostrarInfoJF() {
    mostrarNotificacao('🏙️ Juiz de Fora - Onde eu te espero! 💕', 'love');
}

function registrarVisita() {
    const tipo = prompt('Quem está visitando?\n1. Eu estou visitando ela (BH)\n2. Ela está me visitando (JF)');
    
    if (tipo === '1') {
        visitas.eu++;
        mostrarNotificacao('🚗 Registrada sua visita para BH! 💖', 'success');
    } else if (tipo === '2') {
        visitas.ela++;
        mostrarNotificacao('🚗 Registrada visita dela para JF! 💕', 'success');
    } else {
        return;
    }
    
    atualizarContadorVisitas();
    
    // Salvar no localStorage (em uma versão real, salvaria no backend)
    localStorage.setItem('visitasCasal', JSON.stringify(visitas));
}

function planejarVisita() {
    const novaData = prompt('Digite a data da próxima visita (YYYY-MM-DD):', proximaVisita);
    
    if (novaData) {
        const dataValida = /^\d{4}-\d{2}-\d{2}$/.test(novaData);
        
        if (dataValida) {
            proximaVisita = novaData;
            atualizarProximaVisita();
            mostrarNotificacao('📅 Próxima visita planejada! 🎯', 'success');
            
            // Salvar no localStorage
            localStorage.setItem('proximaVisita', proximaVisita);
        } else {
            mostrarNotificacao('❌ Formato de data inválido! Use YYYY-MM-DD', 'error');
        }
    }
}

// Carregar dados salvos
function carregarDadosMapa() {
    const visitasSalvas = localStorage.getItem('visitasCasal');
    const visitaSalva = localStorage.getItem('proximaVisita');
    
    if (visitasSalvas) {
        visitas = JSON.parse(visitasSalvas);
    }
    
    if (visitaSalva) {
        proximaVisita = visitaSalva;
    }
}

// Inicializar dados do mapa
carregarDadosMapa();