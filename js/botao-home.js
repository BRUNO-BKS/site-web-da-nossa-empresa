// scroll-to-top.js - Script do botão voltar ao topo

;(function () {
  "use strict"

  // Configurações
  const config = {
    showAfter: 500, // Pixels que precisa rolar para mostrar o botão
    scrollDuration: 200, // Duração da animação de scroll em ms
  }

  // Selecionar o botão
  const scrollToTopBtn = document.getElementById("scrollToTopBtn")

  if (!scrollToTopBtn) {
    console.error("Botão #scrollToTopBtn não encontrado!")
    return
  }

  // Função para verificar posição do scroll
  function checkScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > config.showAfter) {
      scrollToTopBtn.classList.add("visible")
    } else {
      scrollToTopBtn.classList.remove("visible")
    }
  }

  // Função de scroll suave
  function smoothScrollToTop() {
    const startPosition = window.pageYOffset
    const startTime = performance.now()

    function animation(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / config.scrollDuration, 1)

      // Easing function (easeInOutCubic)
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

      window.scrollTo(0, startPosition * (1 - ease))

      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  // Event Listeners

  // Verificar scroll na inicialização
  checkScroll()

  // Verificar scroll ao rolar a página
  let scrollTimeout
  window.addEventListener(
    "scroll",
    function () {
      // Throttle para melhor performance
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout)
      }

      scrollTimeout = window.requestAnimationFrame(function () {
        checkScroll()
      })
    },
    { passive: true }
  )

  // Clicar no botão
  scrollToTopBtn.addEventListener("click", function (e) {
    e.preventDefault()
    smoothScrollToTop()
  })

  // Acessibilidade: ativar com Enter ou Space
  scrollToTopBtn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      smoothScrollToTop()
    }
  })
})()
