// ===== SISTEMA DO MURAL DE FOTOS =====
let fotosCarregadas = [];

async function carregarMuralFotos() {
    try {
        mostrarLoading(document.getElementById('galeria'));
        
        const response = await fetch(`${API_URL}/fotos`);
        fotosCarregadas = await response.json();
        
        exibirFotos(fotosCarregadas);
        configurarFiltrosFotos();
        configurarUploadFotos();
        
    } catch (error) {
        console.error('Erro ao carregar fotos:', error);
        document.getElementById('galeria').innerHTML = `
            <div class="error-message">
                <p>❌ Erro ao carregar as fotos</p>
                <button onclick="carregarMuralFotos()">🔄 Tentar Novamente</button>
            </div>
        `;
    }
}

function exibirFotos(fotos) {
    const galeria = document.getElementById('galeria');
    
    if (fotos.length === 0) {
        galeria.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📸</div>
                <h3>Nenhuma foto ainda</h3>
                <p>Adicione a primeira foto ao nosso mural!</p>
            </div>
        `;
        return;
    }
    
    galeria.innerHTML = fotos.map(foto => `
        <div class="foto-item" onclick="mostrarModalFoto(${JSON.stringify(foto).replace(/"/g, '&quot;')})">
            <img src="${foto.imagem}" alt="${foto.titulo}" loading="lazy">
            <div class="foto-info">
                <h4>${foto.titulo}</h4>
                <p>${foto.descricao || ''}</p>
                <small>${formatarData(foto.data)}</small>
            </div>
        </div>
    `).join('');
}

function configurarFiltrosFotos() {
    const botoesFiltro = document.querySelectorAll('.filtro-btn');
    
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', function() {
            // Remover active de todos
            botoesFiltro.forEach(b => b.classList.remove('active'));
            // Adicionar active no clicado
            this.classList.add('active');
            
            const categoria = this.dataset.categoria;
            filtrarFotos(categoria);
        });
    });
}

function filtrarFotos(categoria) {
    let fotosFiltradas = fotosCarregadas;
    
    if (categoria !== 'todas') {
        fotosFiltradas = fotosCarregadas.filter(foto => 
            foto.categoria === categoria
        );
    }
    
    exibirFotos(fotosFiltradas);
}

function configurarUploadFotos() {
    const inputUpload = document.getElementById('upload-foto');
    
    inputUpload.addEventListener('change', function(e) {
        const arquivos = e.target.files;
        
        if (arquivos.length > 0) {
            processarUploadFotos(arquivos);
        }
    });
}

function processarUploadFotos(arquivos) {
    Array.from(arquivos).forEach(arquivo => {
        if (!arquivo.type.startsWith('image/')) {
            mostrarNotificacao('❌ Por favor, selecione apenas imagens!', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imagemBase64 = e.target.result;
            
            // Criar objeto da foto
            const novaFoto = {
                titulo: arquivo.name.split('.')[0],
                descricao: `Foto adicionada em ${new Date().toLocaleDateString()}`,
                categoria: 'momentos',
                data: new Date().toISOString(),
                imagem: imagemBase64
            };
            
            salvarFotoBackend(novaFoto);
        };
        
        reader.readAsDataURL(arquivo);
    });
}

async function salvarFotoBackend(foto) {
    try {
        const response = await fetch(`${API_URL}/fotos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foto)
        });
        
        if (response.ok) {
            const fotoSalva = await response.json();
            fotosCarregadas.unshift(fotoSalva);
            exibirFotos(fotosCarregadas);
            mostrarNotificacao('📸 Foto adicionada com sucesso!', 'success');
        } else {
            throw new Error('Erro ao salvar foto');
        }
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        mostrarNotificacao('❌ Erro ao salvar foto', 'error');
    }
}

function mostrarModalFoto(foto) {
    const modal = document.getElementById('modal-foto');
    const imgAmpliada = document.getElementById('foto-ampliada');
    const tituloFoto = document.getElementById('titulo-foto');
    const dataFoto = document.getElementById('data-foto');
    const descricaoFoto = document.getElementById('descricao-foto');
    
    imgAmpliada.src = foto.imagem;
    tituloFoto.textContent = foto.titulo;
    dataFoto.textContent = formatarData(foto.data);
    descricaoFoto.textContent = foto.descricao || 'Sem descrição';
    
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Configurar fechamento
    const fecharBtn = modal.querySelector('.fechar-modal');
    fecharBtn.onclick = () => fecharModal('modal-foto');
}

function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.classList.remove('active');
    modal.style.display = 'none';
}