// OBJETIVOS

// Objetivo 1 quando o usuário clicar no botão de mostrar mais deve abrir os projetos que estão escondidos no html

// Passo 1 - pegar o botão mostrar mais no JS pra poder verificar quando o usuário clicar em cima dele

// Passo 2 - identificar o clique no botão

// Passo 3 - adicionar a classe ativo nos projetos escondidos

// Objetivo 2 esconder o botão de mostrar mais

// Passo 1 - pegar o botão e esconder ele


//////////////////////////////////////////////////////////////////////////////////////////

const botaoMostrarProjetos = document.querySelector('.btn-mostrar-projetos');
const projetosInativos = document.querySelectorAll('.projeto:not(.ativo)');

botaoMostrarProjetos.addEventListener('click', () => {
  mostrarMaisProjetos();
  esconderBotao();
});

function mostrarMaisProjetos() {
  projetosInativos.forEach((projetoInativo) => {
    projetoInativo.classList.add('ativo');
  });
}

function esconderBotao() {
  botaoMostrarProjetos.classList.add('remover');
}

// Espera o carregamento completo da página
window.addEventListener("DOMContentLoaded", () => {
  const botao = document.querySelector(".b-home");

  // Começa invisível
  botao.style.display = "none";

  // Detecta o scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      // Mostra o botão
      botao.style.display = "block";
      botao.style.opacity = "1";
    } else {
      // Esconde o botão
      botao.style.display = "none";
      botao.style.opacity = "0";
    }
  });
});