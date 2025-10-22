// BACKGROUND TECNOLÓGICO DO JÃO 😎
// ↓      ↓       ↓       ↓       ↓
// Configuração do Canvas
const canvas = document.getElementById("techCanvas")
const ctx = canvas.getContext("2d")

// Ajusta o tamanho do canvas para cobrir toda a tela
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Redimensiona o canvas quando a janela muda de tamanho
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initParticles()
})

// Configurações das partículas
const particlesArray = []
const numberOfParticles = 100

// Classe para criar partículas
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 3 + 1
    this.speedX = Math.random() * 1 - 0.5
    this.speedY = Math.random() * 1 - 0.5
    this.color = this.getRandomColor()
  }

  // Gera cores aleatórias no tema tecnológico
  getRandomColor() {
    const colors = [
      "rgba(0, 255, 255, 0.8)", // Ciano
      "rgba(0, 150, 255, 0.8)", // Azul
      "rgba(100, 200, 255, 0.8)", // Azul claro
      "rgba(255, 255, 255, 0.6)", // Branco
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Atualiza a posição da partícula
  update() {
    this.x += this.speedX
    this.y += this.speedY

    // Faz as partículas reaparecerem do outro lado quando saem da tela
    if (this.x > canvas.width) this.x = 0
    if (this.x < 0) this.x = canvas.width
    if (this.y > canvas.height) this.y = 0
    if (this.y < 0) this.y = canvas.height
  }

  // Desenha a partícula
  draw() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Inicializa as partículas
function initParticles() {
  particlesArray.length = 0
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle())
  }
}

// Conecta partículas próximas com linhas
function connectParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x
      const dy = particlesArray[i].y - particlesArray[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Conecta partículas que estão próximas
      if (distance < 120) {
        const opacity = 1 - distance / 120
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
        ctx.stroke()
      }
    }
  }
}

// Cria efeito de grade tecnológica no fundo
function drawGrid() {
  ctx.strokeStyle = "rgba(0, 255, 255, 0.05)"
  ctx.lineWidth = 1

  // Linhas verticais
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }

  // Linhas horizontais
  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }
}

// Função principal de animação
function animate() {
  // Limpa o canvas completamente (sem rastro)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Preenche com a cor de fundo
  ctx.fillStyle = "rgba(10, 14, 39, 1)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Desenha a grade
  drawGrid()

  // Atualiza e desenha cada partícula
  particlesArray.forEach((particle) => {
    particle.update()
    particle.draw()
  })

  // Conecta as partículas
  connectParticles()

  // Continua a animação
  requestAnimationFrame(animate)
}

// Interação com o mouse
let mouse = {
  x: null,
  y: null,
  radius: 150,
}

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x
  mouse.y = event.y

  // Adiciona efeito de repulsão das partículas pelo mouse
  particlesArray.forEach((particle) => {
    const dx = mouse.x - particle.x
    const dy = mouse.y - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < mouse.radius) {
      const angle = Math.atan2(dy, dx)
      const force = (mouse.radius - distance) / mouse.radius
      particle.x -= Math.cos(angle) * force * 3
      particle.y -= Math.sin(angle) * force * 3
    }
  })
})

// Inicia a aplicação
initParticles()
animate()