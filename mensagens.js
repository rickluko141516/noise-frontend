// ===== SISTEMA DE MENSAGENS =====
let mensagensCarregadas = [];

async function carregarMensagens() {
    try {
        mostrarLoading(document.getElementById('lista-mensagens'));
        
        const response = await fetch(`${API_URL}/mensagens`);
        mensagensCarregadas = await response.json();
        
        exibirMensagens(mensagensCarregadas);
        exibirMensagensDestacadas();
        configurarFiltrosMensagens();
        
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        document.getElementById('lista-mensagens').innerHTML = `
            <div class="error-message">
                <p>❌ Erro ao carregar as mensagens</p>
                <button onclick="carregarMensagens()">🔄 Tentar Novamente</button>
            </div>
        `;
    }
}

function exibirMensagens(mensagens) {
    const listaMensagens = document.getElementById('lista-mensagens');
    
    if (mensagens.length === 0) {
        listaMensagens.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💌</div>
                <h3>Nenhuma mensagem ainda</h3>
                <p>Seja o primeiro a enviar uma mensagem especial!</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por data (mais recente primeiro)
    mensagens.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    listaMensagens.innerHTML = mensagens.map(mensagem => `
        <div class="mensagem-item ${mensagem.tipo}" data-id="${mensagem.id}">
            <div class="mensagem-header">
                <span class="mensagem-autor">${getEmojiAutor(mensagem.autor)}</span>
                <span class="mensagem-data">${formatarDataHora(mensagem.data)}</span>
                <div class="mensagem-acoes">
                    <button class="btn-acao" onclick="marcarDestaque(${mensagem.id})" 
                            title="${mensagem.destaque ? 'Remover destaque' : 'Destacar'}">
                        ${mensagem.destaque ? '⭐' : '✰'}
                    </button>
                    <button class="btn-acao" onclick="excluirMensagem(${mensagem.id})" title="Excluir">
                        🗑️
                    </button>
                </div>
            </div>
            
            <div class="mensagem-conteudo">
                <p>${mensagem.texto}</p>
            </div>
            
            <div class="mensagem-tipo">
                <span class="tipo-badge ${mensagem.tipo}">${formatarTipoMensagem(mensagem.tipo)}</span>
                ${mensagem.lida ? '<span class="lida-badge">📖 Lida</span>' : '<span class="nao-lida-badge">📨 Nova</span>'}
            </div>
        </div>
    `).join('');
}

function exibirMensagensDestacadas() {
    const mensagensDestacadas = mensagensCarregadas.filter(m => m.destaque);
    const container = document.getElementById('mensagens-destaque');
    
    if (mensagensDestacadas.length === 0) {
        container.innerHTML = `
            <div class="empty-destaque">
                <p>Nenhuma mensagem em destaque ainda</p>
                <small>Clique no ✰ para destacar uma mensagem</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = mensagensDestacadas.map(mensagem => `
        <div class="mensagem-destaque ${mensagem.tipo}">
            <div class="destaque-header">
                <span class="destaque-autor">${getEmojiAutor(mensagem.autor)}</span>
                <span class="destaque-data">${formatarDataHora(mensagem.data)}</span>
            </div>
            <div class="destaque-conteudo">
                <p>${mensagem.texto}</p>
            </div>
        </div>
    `).join('');
}

function getEmojiAutor(autor) {
    const autores = {
        'eu': '😊 Você',
        'ela': '🥰 Ela',
        'anonimo': '💝 Anônimo'
    };
    return autores[autor] || '💝 Anônimo';
}

function formatarTipoMensagem(tipo) {
    const tipos = {
        'amor': '💖 Amor',
        'saudade': '😔 Saudade',
        'motivacao': '🌟 Motivação',
        'surpresa': '🎁 Surpresa'
    };
    return tipos[tipo] || tipo;
}

function formatarDataHora(dataString) {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function enviarMensagem() {
    const texto = document.getElementById('texto-mensagem').value.trim();
    const tipo = document.getElementById('tipo-mensagem').value;
    
    if (!texto) {
        mostrarNotificacao('❌ Por favor, digite uma mensagem!', 'error');
        return;
    }
    
    if (texto.length > 500) {
        mostrarNotificacao('❌ A mensagem é muito longa! (máx. 500 caracteres)', 'error');
        return;
    }
    
    const novaMensagem = {
        texto,
        tipo,
        autor: 'anonimo' // Poderia ser 'eu' ou 'ela' baseado em login
    };
    
    try {
        const response = await fetch(`${API_URL}/mensagens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaMensagem)
        });
        
        if (response.ok) {
            const mensagemSalva = await response.json();
            mensagensCarregadas.unshift(mensagemSalva);
            exibirMensagens(mensagensCarregadas);
            exibirMensagensDestacadas();
            
            // Limpar formulário
            document.getElementById('texto-mensagem').value = '';
            
            mostrarNotificacao('💌 Mensagem enviada com sucesso!', 'success');
            
            // Efeito especial para mensagens de amor
            if (tipo === 'amor') {
                criarEfeitoCoracoes();
            }
        } else {
            throw new Error('Erro ao enviar mensagem');
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        mostrarNotificacao('❌ Erro ao enviar mensagem', 'error');
    }
}

async function marcarDestaque(mensagemId) {
    const mensagem = mensagensCarregadas.find(m => m.id == mensagemId);
    if (!mensagem) return;
    
    const novoDestaque = !mensagem.destaque;
    
    try {
        const response = await fetch(`${API_URL}/mensagens/${mensagemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destaque: novoDestaque
            })
        });
        
        if (response.ok) {
            const mensagemIndex = mensagensCarregadas.findIndex(m => m.id == mensagemId);
            if (mensagemIndex !== -1) {
                mensagensCarregadas[mensagemIndex].destaque = novoDestaque;
                exibirMensagens(mensagensCarregadas);
                exibirMensagensDestacadas();
                
                mostrarNotificacao(
                    novoDestaque ? '⭐ Mensagem destacada!' : '✰ Destaque removido!',
                    'success'
                );
            }
        } else {
            throw new Error('Erro ao atualizar mensagem');
        }
    } catch (error) {
        console.error('Erro ao marcar destaque:', error);
        mostrarNotificacao('❌ Erro ao atualizar mensagem', 'error');
    }
}

async function excluirMensagem(mensagemId) {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?\nEsta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/mensagens/${mensagemId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            mensagensCarregadas = mensagensCarregadas.filter(m => m.id != mensagemId);
            exibirMensagens(mensagensCarregadas);
            exibirMensagensDestacadas();
            mostrarNotificacao('🗑️ Mensagem excluída!', 'success');
        } else {
            throw new Error('Erro ao excluir mensagem');
        }
    } catch (error) {
        console.error('Erro ao excluir mensagem:', error);
        mostrarNotificacao('❌ Erro ao excluir mensagem', 'error');
    }
}

function configurarFiltrosMensagens() {
    const botoesFiltro = document.querySelectorAll('.tipo-btn');
    
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', function() {
            // Remover active de todos
            botoesFiltro.forEach(b => b.classList.remove('active'));
            // Adicionar active no clicado
            this.classList.add('active');
            
            const tipo = this.dataset.tipo;
            filtrarMensagens(tipo);
        });
    });
}

function filtrarMensagens(tipo) {
    let mensagensFiltradas = mensagensCarregadas;
    
    if (tipo !== 'todas') {
        mensagensFiltradas = mensagensCarregadas.filter(mensagem => 
            mensagem.tipo === tipo
        );
    }
    
    exibirMensagens(mensagensFiltradas);
}

function criarEfeitoCoracoes() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.className = 'heart-rain';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 3000);
        }, i * 200);
    }
}