const tabuleiro = document.getElementById('game-board');
const visorTempo = document.getElementById('timer');
const visorPontos = document.getElementById('score');
const btnReiniciar = document.getElementById('reiniciar');
const btnResetar = document.getElementById('resetar');
const mensagemDiv = document.getElementById('mensagem');

const somAcerto = document.getElementById('som-acerto');
const somErro = document.getElementById('som-erro');

let icones = ["🐶", "🐱", "🦊", "🐻", "🐼", "🐨"];

let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let travarJogo = false;
let pontuacao = 0;
let totalPares = icones.length;
let tempoRestante = 60;
let intervaloTempo = null;

function iniciarJogo() {
    cartas = duplicarIcones(icones);
    embaralharCartas(cartas);
    criarCartasNoTabuleiro(cartas);
    resetarContador();
    mensagemDiv.innerHTML = '';
    pontuacao = 0;
    visorPontos.innerText = pontuacao;
}

function duplicarIcones(lista) {
    let pares = [];
    for (let icon of lista) {
        pares.push(icon);
        pares.push(icon);
    }
    return pares;
}

function embaralharCartas(lista) {
    for (let i = lista.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
}

function criarCartasNoTabuleiro(listaCartas) {
    tabuleiro.innerHTML = '';
    for (let icone of listaCartas) {
        const carta = document.createElement('div');
        carta.className = 'card';
        carta.dataset.icone = icone;
        carta.textContent = '';
        carta.addEventListener('click', ()=> virarCarta(carta));
        tabuleiro.appendChild(carta);
    }
}

function resetarContador() {
    clearInterval(intervaloTempo);
    tempoRestante = 60;
    visorTempo.innerText = tempoRestante;
    intervaloTempo = setInterval(() => {
        tempoRestante--;
        visorTempo.innerText = tempoRestante;
        if (tempoRestante <= 0) {
            clearInterval(intervaloTempo);
            fimDeJogo('Fim de jogo! Tempo esgotado.');
        }
    }, 1000);
}

function virarCarta(carta) {
    if (travarJogo || carta.classList.contains('card-revealed') || carta.classList.contains('matched')) return;
    carta.textContent = carta.dataset.icone;
    carta.classList.add('card-revealed');

    if (!primeiraCarta) {
        primeiraCarta = carta;
        return;
    }
    segundaCarta = carta;
    travarJogo = true;
    verificarPar();
}

function verificarPar() {
    if (primeiraCarta.dataset.icone === segundaCarta.dataset.icone) {
        primeiraCarta.classList.add('matched');
        segundaCarta.classList.add('matched');
        pontuacao += 2;
        visorPontos.innerText = pontuacao;
        somAcerto.currentTime=0;
        somAcerto.play();
        limparSelecao();

        if (pontuacao === totalPares * 2) {
            fimDeJogo('Parabéns! Você venceu!');
        }
    } else {
        somErro.currentTime=0;
        somErro.play();
        setTimeout(() => {
            primeiraCarta.textContent = '';
            segundaCarta.textContent = '';
            primeiraCarta.classList.remove('card-revealed');
            segundaCarta.classList.remove('card-revealed');
            limparSelecao();
        }, 1000);
    }
}

function limparSelecao() {
    primeiraCarta = null;
    segundaCarta = null;
    travarJogo = false;
}

function fimDeJogo(msg) {
    clearInterval(intervaloTempo);
    mensagemDiv.innerHTML = `<b>${msg}</b>`;
}

document.getElementById('reiniciar').addEventListener('click', iniciarJogo);
document.getElementById('resetar').addEventListener('click', iniciarJogo);

iniciarJogo();