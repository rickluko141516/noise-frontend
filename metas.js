// ===== SISTEMA DE METAS DO CASAL =====
let metasCarregadas = [];

async function carregarMetas() {
    try {
        mostrarLoading(document.getElementById('lista-metas'));
        
        const response = await fetch(`${API_URL}/metas`);
        metasCarregadas = await response.json();
        
        exibirMetas(metasCarregadas);
        atualizarEstatisticas();
        configurarFiltrosMetas();
        
    } catch (error) {
        console.error('Erro ao carregar metas:', error);
        document.getElementById('lista-metas').innerHTML = `
            <div class="error-message">
                <p>❌ Erro ao carregar as metas</p>
                <button onclick="carregarMetas()">🔄 Tentar Novamente</button>
            </div>
        `;
    }
}

function exibirMetas(metas) {
    const listaMetas = document.getElementById('lista-metas');
    
    if (metas.length === 0) {
        listaMetas.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎯</div>
                <h3>Nenhuma meta ainda</h3>
                <p>Vamos criar nossa primeira meta juntos!</p>
            </div>
        `;
        return;
    }
    
    listaMetas.innerHTML = metas.map(meta => `
        <div class="meta-item ${meta.status}" data-id="${meta.id}">
            <div class="meta-header">
                <h4>${getEmojiCategoria(meta.categoria)} ${meta.titulo}</h4>
                <div class="meta-acoes">
                    <button class="btn-acao" onclick="marcarConcluida(${meta.id})" 
                            ${meta.status === 'concluida' ? 'disabled' : ''}>
                        ✅
                    </button>
                    <button class="btn-acao" onclick="editarMeta(${meta.id})">
                        ✏️
                    </button>
                    <button class="btn-acao" onclick="excluirMeta(${meta.id})">
                        🗑️
                    </button>
                </div>
            </div>
            
            <p class="meta-descricao">${meta.descricao || 'Sem descrição'}</p>
            
            <div class="meta-detalhes">
                <span class="meta-categoria ${meta.categoria}">${formatarCategoria(meta.categoria)}</span>
                <span class="meta-prioridade ${meta.prioridade}">${formatarPrioridade(meta.prioridade)}</span>
                ${meta.prazo ? `<span class="meta-prazo">📅 ${formatarData(meta.prazo)}</span>` : ''}
                <span class="meta-status ${meta.status}">${formatarStatus(meta.status)}</span>
            </div>
            
            ${meta.status !== 'concluida' ? `
                <div class="meta-progresso">
                    <div class="progresso-bar">
                        <div class="progresso-fill" style="width: ${meta.progresso}%"></div>
                    </div>
                    <span>${meta.progresso}% concluído</span>
                </div>
            ` : ''}
            
            <div class="meta-data">
                <small>Criado em: ${formatarData(meta.criadoEm)}</small>
            </div>
        </div>
    `).join('');
}

function getEmojiCategoria(categoria) {
    const emojis = {
        'viagem': '✈️',
        'casa': '🏠',
        'carreira': '💼',
        'saude': '💪',
        'romance': '💖',
        'outro': '⭐'
    };
    return emojis[categoria] || '⭐';
}

function formatarCategoria(categoria) {
    const categorias = {
        'viagem': 'Viagem',
        'casa': 'Casa',
        'carreira': 'Carreira',
        'saude': 'Saúde',
        'romance': 'Romance',
        'outro': 'Outro'
    };
    return categorias[categoria] || categoria;
}

function formatarPrioridade(prioridade) {
    const prioridades = {
        'alta': '🔥 Alta',
        'media': '⚡ Média',
        'baixa': '💤 Baixa'
    };
    return prioridades[prioridade] || prioridade;
}

function formatarStatus(status) {
    const statusMap = {
        'pendente': '⏳ Pendente',
        'andamento': '🚀 Em Andamento',
        'concluida': '✅ Concluída'
    };
    return statusMap[status] || status;
}

async function adicionarMeta() {
    const titulo = document.getElementById('titulo-meta').value.trim();
    const descricao = document.getElementById('descricao-meta').value.trim();
    const categoria = document.getElementById('categoria-meta').value;
    const prazo = document.getElementById('prazo-meta').value;
    
    if (!titulo) {
        mostrarNotificacao('❌ Por favor, digite um título para a meta!', 'error');
        return;
    }
    
    const novaMeta = {
        titulo,
        descricao,
        categoria,
        prazo,
        prioridade: 'media',
        status: 'pendente',
        progresso: 0
    };
    
    try {
        const response = await fetch(`${API_URL}/metas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaMeta)
        });
        
        if (response.ok) {
            const metaSalva = await response.json();
            metasCarregadas.unshift(metaSalva);
            exibirMetas(metasCarregadas);
            atualizarEstatisticas();
            
            // Limpar formulário
            document.getElementById('titulo-meta').value = '';
            document.getElementById('descricao-meta').value = '';
            document.getElementById('prazo-meta').value = '';
            
            mostrarNotificacao('🎯 Meta adicionada com sucesso!', 'success');
        } else {
            throw new Error('Erro ao salvar meta');
        }
    } catch (error) {
        console.error('Erro ao adicionar meta:', error);
        mostrarNotificacao('❌ Erro ao adicionar meta', 'error');
    }
}

async function marcarConcluida(metaId) {
    try {
        const response = await fetch(`${API_URL}/metas/${metaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'concluida',
                progresso: 100
            })
        });
        
        if (response.ok) {
            const metaIndex = metasCarregadas.findIndex(m => m.id == metaId);
            if (metaIndex !== -1) {
                metasCarregadas[metaIndex].status = 'concluida';
                metasCarregadas[metaIndex].progresso = 100;
                exibirMetas(metasCarregadas);
                atualizarEstatisticas();
                mostrarNotificacao('✅ Meta concluída! Parabéns! 🎉', 'success');
            }
        } else {
            throw new Error('Erro ao atualizar meta');
        }
    } catch (error) {
        console.error('Erro ao marcar meta como concluída:', error);
        mostrarNotificacao('❌ Erro ao concluir meta', 'error');
    }
}

async function editarMeta(metaId) {
    const meta = metasCarregadas.find(m => m.id == metaId);
    if (!meta) return;
    
    // Em uma versão futura, podemos implementar um modal de edição
    const novoTitulo = prompt('Editar título da meta:', meta.titulo);
    if (novoTitulo === null) return;
    
    const novaDescricao = prompt('Editar descrição:', meta.descricao || '');
    
    try {
        const response = await fetch(`${API_URL}/metas/${metaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: novoTitulo.trim(),
                descricao: novaDescricao.trim()
            })
        });
        
        if (response.ok) {
            const metaIndex = metasCarregadas.findIndex(m => m.id == metaId);
            if (metaIndex !== -1) {
                metasCarregadas[metaIndex].titulo = novoTitulo.trim();
                metasCarregadas[metaIndex].descricao = novaDescricao.trim();
                exibirMetas(metasCarregadas);
                mostrarNotificacao('📝 Meta atualizada!', 'success');
            }
        } else {
            throw new Error('Erro ao atualizar meta');
        }
    } catch (error) {
        console.error('Erro ao editar meta:', error);
        mostrarNotificacao('❌ Erro ao editar meta', 'error');
    }
}

async function excluirMeta(metaId) {
    if (!confirm('Tem certeza que deseja excluir esta meta?\nEsta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/metas/${metaId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            metasCarregadas = metasCarregadas.filter(m => m.id != metaId);
            exibirMetas(metasCarregadas);
            atualizarEstatisticas();
            mostrarNotificacao('🗑️ Meta excluída!', 'success');
        } else {
            throw new Error('Erro ao excluir meta');
        }
    } catch (error) {
        console.error('Erro ao excluir meta:', error);
        mostrarNotificacao('❌ Erro ao excluir meta', 'error');
    }
}

function configurarFiltrosMetas() {
    const botoesFiltro = document.querySelectorAll('.filtro-meta');
    
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', function() {
            // Remover active de todos
            botoesFiltro.forEach(b => b.classList.remove('active'));
            // Adicionar active no clicado
            this.classList.add('active');
            
            const status = this.dataset.status;
            filtrarMetas(status);
        });
    });
}

function filtrarMetas(status) {
    let metasFiltradas = metasCarregadas;
    
    if (status !== 'todas') {
        metasFiltradas = metasCarregadas.filter(meta => 
            meta.status === status
        );
    }
    
    exibirMetas(metasFiltradas);
}

function atualizarEstatisticas() {
    const totalMetas = metasCarregadas.length;
    const metasConcluidas = metasCarregadas.filter(m => m.status === 'concluida').length;
    const metasAndamento = metasCarregadas.filter(m => m.status === 'andamento').length;
    
    const progressoGeral = totalMetas > 0 ? Math.round((metasConcluidas / totalMetas) * 100) : 0;
    
    // Atualizar elementos da interface
    const elementos = {
        'total-metas': totalMetas,
        'metas-concluidas': metasConcluidas,
        'metas-andamento': metasAndamento,
        'progresso-geral': `${progressoGeral}%`
    };
    
    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
    });
}