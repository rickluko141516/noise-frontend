// ===== SISTEMA DE JOGOS INTERATIVOS =====
async function carregarJogos() {
    const areaJogo = document.getElementById('area-jogo');
    areaJogo.innerHTML = `
        <div class="jogos-welcome">
            <h3>🎮 Escolha um jogo para começar!</h3>
            <p>Temos várias opções divertidas para jogarmos juntos 💕</p>
        </div>
    `;
}

// ===== JOGO 1: QUIZ DO CASAL =====
async function iniciarQuiz() {
    const areaJogo = document.getElementById('area-jogo');
    
    const perguntas = [
        {
            pergunta: "Qual é minha comida favorita?",
            opcoes: ["Pizza", "Sushi", "Hambúrguer", "Lasanha"],
            resposta: 1,
            dica: "🍣"
        },
        {
            pergunta: "Onde foi nosso primeiro encontro?",
            opcoes: ["Cinema", "Parque", "Restaurante", "Shopping"],
            resposta: 2,
            dica: "🍽️"
        },
        {
            pergunta: "Qual é meu filme preferido?",
            opcoes: ["Titanic", "Harry Potter", "Star Wars", "Marvel"],
            resposta: 0,
            dica: "🚢"
        }
    ];
    
    let perguntaAtual = 0;
    let pontuacao = 0;
    
    function mostrarPergunta() {
        const pergunta = perguntas[perguntaAtual];
        
        areaJogo.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h3>❓ Quiz do Casal</h3>
                    <div class="quiz-progress">
                        Pergunta ${perguntaAtual + 1} de ${perguntas.length}
                    </div>
                </div>
                
                <div class="pergunta-atual">
                    <h4>${pergunta.pergunta}</h4>
                    <small>Dica: ${pergunta.dica}</small>
                </div>
                
                <div class="opcoes-quiz">
                    ${pergunta.opcoes.map((opcao, index) => `
                        <button class="opcao-btn" onclick="verificarResposta(${index})">
                            ${opcao}
                        </button>
                    `).join('')}
                </div>
                
                <div class="quiz-pontuacao">
                    Pontuação: ${pontuacao} 💖
                </div>
            </div>
        `;
    }
    
    window.verificarResposta = function(respostaIndex) {
        const pergunta = perguntas[perguntaAtual];
        const botoes = document.querySelectorAll('.opcao-btn');
        
        // Desabilitar todos os botões
        botoes.forEach(btn => btn.disabled = true);
        
        if (respostaIndex === pergunta.resposta) {
            botoes[respostaIndex].classList.add('correto');
            pontuacao += 10;
            mostrarNotificacao('✅ Resposta correta! +10 pontos!', 'success');
        } else {
            botoes[respostaIndex].classList.add('errado');
            botoes[pergunta.resposta].classList.add('correto');
            mostrarNotificacao('❌ Resposta errada!', 'error');
        }
        
        // Próxima pergunta após 2 segundos
        setTimeout(() => {
            perguntaAtual++;
            
            if (perguntaAtual < perguntas.length) {
                mostrarPergunta();
            } else {
                finalizarQuiz();
            }
        }, 2000);
    };
    
    function finalizarQuiz() {
        let mensagem = '';
        if (pontuacao >= 25) {
            mensagem = '🎉 Incrível! Você me conhece muito bem! 💕';
        } else if (pontuacao >= 15) {
            mensagem = '😊 Muito bom! Precisamos nos conhecer melhor!';
        } else {
            mensagem = '🤔 Hmm... Vamos marcar mais encontros! 💖';
        }
        
        areaJogo.innerHTML = `
            <div class="quiz-final">
                <h3>🎯 Quiz Concluído!</h3>
                <div class="pontuacao-final">
                    <h4>Sua pontuação: ${pontuacao} pontos</h4>
                    <p>${mensagem}</p>
                </div>
                <button onclick="iniciarQuiz()" class="btn-jogar-novamente">
                    🔄 Jogar Novamente
                </button>
                <button onclick="carregarJogos()" class="btn-voltar">
                    ← Voltar aos Jogos
                </button>
            </div>
        `;
    }
    
    mostrarPergunta();
}

// ===== JOGO 2: MEMÓRIA ROMÂNTICA =====
function iniciarMemoria() {
    const areaJogo = document.getElementById('area-jogo');
    
    const pares = [
        { emoji: '❤️', id: 1 },
        { emoji: '😊', id: 2 },
        { emoji: '🌟', id: 3 },
        { emoji: '💕', id: 4 },
        { emoji: '🎉', id: 5 },
        { emoji: '🥰', id: 6 }
    ];
    
    // Duplicar para formar pares
    let cartas = [...pares, ...pares];
    
    // Embaralhar cartas
    cartas = cartas.sort(() => Math.random() - 0.5);
    
    let primeiraCarta = null;
    let segundaCarta = null;
    let bloqueado = false;
    let paresEncontrados = 0;
    
    areaJogo.innerHTML = `
        <div class="memoria-container">
            <h3>🧠 Memória do Amor</h3>
            <div class="memoria-tabuleiro" id="tabuleiro-memoria">
                ${cartas.map((carta, index) => `
                    <div class="carta" data-id="${carta.id}" data-index="${index}">
                        <div class="carta-frente">?</div>
                        <div class="carta-verso">${carta.emoji}</div>
                    </div>
                `).join('')}
            </div>
            <div class="memoria-contador">
                Pares encontrados: <span id="contador-pares">0</span> / ${pares.length}
            </div>
        </div>
    `;
    
    const cartasElementos = document.querySelectorAll('.carta');
    
    cartasElementos.forEach(carta => {
        carta.addEventListener('click', virarCarta);
    });
    
    function virarCarta() {
        if (bloqueado) return;
        if (this === primeiraCarta) return;
        
        this.classList.add('virada');
        
        if (!primeiraCarta) {
            primeiraCarta = this;
            return;
        }
        
        segundaCarta = this;
        bloqueado = true;
        
        verificarPar();
    }
    
    function verificarPar() {
        const saoIguais = primeiraCarta.dataset.id === segundaCarta.dataset.id;
        
        if (saoIguais) {
            desabilitarCartas();
            paresEncontrados++;
            document.getElementById('contador-pares').textContent = paresEncontrados;
            
            if (paresEncontrados === pares.length) {
                setTimeout(() => {
                    mostrarNotificacao('🎉 Parabéns! Você completou o jogo da memória!', 'success');
                }, 500);
            }
        } else {
            desvirarCartas();
        }
    }
    
    function desabilitarCartas() {
        primeiraCarta.removeEventListener('click', virarCarta);
        segundaCarta.removeEventListener('click', virarCarta);
        resetarTurno();
    }
    
    function desvirarCartas() {
        setTimeout(() => {
            primeiraCarta.classList.remove('virada');
            segundaCarta.classList.remove('virada');
            resetarTurno();
        }, 1000);
    }
    
    function resetarTurno() {
        [primeiraCarta, segundaCarta, bloqueado] = [null, null, false];
    }
}

// ===== JOGO 3: CAÇA AO TESOURO =====
function iniciarCaçaTesouro() {
    const areaJogo = document.getElementById('area-jogo');
    
    const pistas = [
        {
            pista: "Onde nosso amor começou a florescer? 🌸",
            resposta: "parque",
            dica: "Um lugar com árvores e bancos"
        },
        {
            pista: "Qual é a data mais especial para nós? 📅",
            resposta: "14fevereiro",
            dica: "Dia dos namorados"
        },
        {
            pista: "Qual é nosso lugar favorito para jantar? 🍽️",
            resposta: "italiano",
            dica: "Comida com massa"
        }
    ];
    
    let pistaAtual = 0;
    
    function mostrarPista() {
        const pista = pistas[pistaAtual];
        
        areaJogo.innerHTML = `
            <div class="caca-tesouro-container">
                <h3>🗺️ Caça ao Tesouro do Amor</h3>
                <div class="pista-atual">
                    <h4>Pista ${pistaAtual + 1}:</h4>
                    <p>${pista.pista}</p>
                    <small>💡 Dica: ${pista.dica}</small>
                </div>
                
                <div class="resposta-area">
                    <input type="text" id="resposta-input" placeholder="Digite sua resposta...">
                    <button onclick="verificarRespostaTesouro()">🔍 Verificar</button>
                </div>
                
                <div class="progresso-tesouro">
                    ${pistaAtual + 1} / ${pistas.length} pistas
                </div>
            </div>
        `;
    }
    
    window.verificarRespostaTesouro = function() {
        const input = document.getElementById('resposta-input');
        const resposta = input.value.toLowerCase().trim();
        const pista = pistas[pistaAtual];
        
        if (resposta === pista.resposta) {
            mostrarNotificacao('✅ Resposta correta! Próxima pista!', 'success');
            pistaAtual++;
            
            if (pistaAtual < pistas.length) {
                setTimeout(mostrarPista, 1000);
            } else {
                areaJogo.innerHTML = `
                    <div class="tesouro-encontrado">
                        <h3>🎉 Tesouro Encontrado! 💎</h3>
                        <p>Você completou todas as pistas! Nosso maior tesouro é nosso amor! 💖</p>
                        <button onclick="iniciarCaçaTesouro()" class="btn-jogar-novamente">
                            🔄 Jogar Novamente
                        </button>
                    </div>
                `;
            }
        } else {
            mostrarNotificacao('❌ Resposta incorreta! Tente novamente.', 'error');
            input.value = '';
            input.focus();
        }
    };
    
    mostrarPista();
}

// ===== JOGO 4: FORCA ROMÂNTICA =====
function iniciarForca() {
    const areaJogo = document.getElementById('area-jogo');
    
    const palavras = [
        { palavra: "AMOR", dica: "O que sentimos um pelo outro" },
        { palavra: "CASAL", dica: "Nós dois juntos" },
        { palavra: "ROMANCE", dica: "Nossa história" },
        { palavra: "FELICIDADE", dica: "O que você me traz" },
        { palavra: "SAUDADE", dica: "O que sinto quando estamos longe" }
    ];
    
    const palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
    let letrasCorretas = [];
    let letrasErradas = [];
    let tentativas = 6;
    
    function inicializarJogo() {
        letrasCorretas = Array(palavraSecreta.palavra.length).fill('_');
        atualizarInterface();
    }
    
    function atualizarInterface() {
        const palavraExibida = letrasCorretas.join(' ');
        const letrasErradasExibidas = letrasErradas.join(', ');
        
        areaJogo.innerHTML = `
            <div class="forca-container">
                <h3>🎯 Forca do Amor</h3>
                <div class="forca-dica">
                    <p>💡 Dica: ${palavraSecreta.dica}</p>
                </div>
                
                <div class="forca-palavra">
                    <h2>${palavraExibida}</h2>
                </div>
                
                <div class="forca-tentativas">
                    <p>Tentativas restantes: ${tentativas} ❤️</p>
                    <p>Letras erradas: ${letrasErradasExibidas || 'Nenhuma'}</p>
                </div>
                
                <div class="forca-teclado">
                    ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letra => `
                        <button class="tecla" 
                                onclick="adivinharLetra('${letra}')"
                                ${letrasCorretas.includes(letra) || letrasErradas.includes(letra) ? 'disabled' : ''}>
                            ${letra}
                        </button>
                    `).join('')}
                </div>
                
                <div class="forca-boneco">
                    ${desenharBoneco()}
                </div>
            </div>
        `;
    }
    
    window.adivinharLetra = function(letra) {
        if (palavraSecreta.palavra.includes(letra)) {
            // Letra correta
            for (let i = 0; i < palavraSecreta.palavra.length; i++) {
                if (palavraSecreta.palavra[i] === letra) {
                    letrasCorretas[i] = letra;
                }
            }
            
            if (!letrasCorretas.includes('_')) {
                // Vitória
                setTimeout(() => {
                    mostrarNotificacao('🎉 Parabéns! Você acertou a palavra!', 'success');
                    areaJogo.innerHTML += `
                        <div class="vitoria-forca">
                            <h3>🏆 Você venceu!</h3>
                            <button onclick="iniciarForca()">🔄 Jogar Novamente</button>
                        </div>
                    `;
                }, 500);
            }
        } else {
            // Letra errada
            letrasErradas.push(letra);
            tentativas--;
            
            if (tentativas === 0) {
                // Derrota
                setTimeout(() => {
                    mostrarNotificacao('💔 Fim de jogo! A palavra era: ' + palavraSecreta.palavra, 'error');
                    areaJogo.innerHTML += `
                        <div class="derrota-forca">
                            <h3>😔 Tente novamente!</h3>
                            <p>A palavra era: <strong>${palavraSecreta.palavra}</strong></p>
                            <button onclick="iniciarForca()">🔄 Jogar Novamente</button>
                        </div>
                    `;
                }, 500);
            }
        }
        
        atualizarInterface();
    };
    
    function desenharBoneco() {
        const partes = [
            tentativas < 6 ? '😊' : '',
            tentativas < 5 ? '👕' : '',
            tentativas < 4 ? '👖' : '',
            tentativas < 3 ? '👋' : '',
            tentativas < 2 ? '👋' : '',
            tentativas < 1 ? '👞👞' : ''
        ].filter(Boolean);
        
        return partes.join(' ');
    }
    
    inicializarJogo();
}

// ===== JOGO 5: JOGO DA VELHA PERSONALIZADO =====
function iniciarJogoVelha() {
    const areaJogo = document.getElementById('area-jogo');
    
    let tabuleiro = Array(9).fill('');
    let jogadorAtual = '❤️';
    let jogoAtivo = true;
    
    const combinacoesVitoria = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6] // Diagonais
    ];
    
    areaJogo.innerHTML = `
        <div class="velha-container">
            <h3>⭕ Jogo da Nossa Velha</h3>
            <div class="velha-jogador">
                Jogador atual: <span id="jogador-atual">${jogadorAtual}</span>
            </div>
            
            <div class="velha-tabuleiro" id="tabuleiro-velha">
                ${Array(9).fill().map((_, index) => `
                    <div class="celula-velha" data-index="${index}" onclick="fazerJogada(${index})"></div>
                `).join('')}
            </div>
            
            <button onclick="reiniciarVelha()" class="btn-reiniciar">🔄 Reiniciar Jogo</button>
        </div>
    `;
    
    window.fazerJogada = function(index) {
        if (!jogoAtivo || tabuleiro[index] !== '') return;
        
        tabuleiro[index] = jogadorAtual;
        document.querySelector(`[data-index="${index}"]`).textContent = jogadorAtual;
        
        if (verificarVitoria()) {
            jogoAtivo = false;
            setTimeout(() => {
                mostrarNotificacao(`🎉 ${jogadorAtual} venceu!`, 'success');
            }, 500);
            return;
        }
        
        if (tabuleiro.every(celula => celula !== '')) {
            jogoAtivo = false;
            setTimeout(() => {
                mostrarNotificacao('🤝 Empate!', 'info');
            }, 500);
            return;
        }
        
        jogadorAtual = jogadorAtual === '❤️' ? '💕' : '❤️';
        document.getElementById('jogador-atual').textContent = jogadorAtual;
    };
    
    window.reiniciarVelha = function() {
        tabuleiro = Array(9).fill('');
        jogadorAtual = '❤️';
        jogoAtivo = true;
        
        document.querySelectorAll('.celula-velha').forEach(celula => {
            celula.textContent = '';
        });
        
        document.getElementById('jogador-atual').textContent = jogadorAtual;
    };
    
    function verificarVitoria() {
        return combinacoesVitoria.some(combinacao => {
            return combinacao.every(index => {
                return tabuleiro[index] === jogadorAtual;
            });
        });
    }
}

// ===== JOGO 6: QUEBRA-CABEÇA DAS FOTOS =====
function iniciarQuebraCabeca() {
    const areaJogo = document.getElementById('area-jogo');
    
    areaJogo.innerHTML = `
        <div class="quebracabeca-container">
            <h3>🧩 Quebra-cabeça do Amor</h3>
            <p>Em breve... Este jogo está em desenvolvimento! 💖</p>
            <p>Enquanto isso, que tal jogar um dos outros jogos?</p>
            <button onclick="carregarJogos()" class="btn-voltar">
                ← Voltar aos Jogos
            </button>
        </div>
    `;
}