// Aurora Boreal Background Effect - Vanilla JavaScript
class AuroraBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.material = null;
    this.mesh = null;
    this.animationId = null;
    this.startTime = Date.now();
    
    this.init();
  }

  init() {
    if (!this.container) {
      console.error('Container not found');
      return;
    }

    // Verificar se Three.js está carregado
    if (typeof THREE === 'undefined') {
      console.error('Three.js não está carregado');
      return;
    }

    this.setupScene();
    this.createMaterial();
    this.createMesh();
    this.animate();
    this.handleResize();
  }

  setupScene() {
    // Configurar cena
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Configurar renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    // Usar viewport completo
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    
    // Garantir que o canvas não cause overflow e fique atrás do conteúdo
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100vw';
    this.renderer.domElement.style.height = '100vh';
    this.renderer.domElement.style.overflow = 'hidden';
    this.renderer.domElement.style.zIndex = '-1';
    this.renderer.domElement.style.pointerEvents = 'none';
    
    this.container.appendChild(this.renderer.domElement);
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2() }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 2 // Reduzido de 3 para 2

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        void main() {
          vec2 shake = vec2(sin(iTime * 0.8) * 0.003, cos(iTime * 1.2) * 0.003); // Reduzido movimento
          vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(4.0, -3.0, 3.0, 4.0); // Simplificado
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 1.5 + fbm(p + vec2(iTime * 3.0, 0.0)) * 0.3; // Reduzido movimento

          for (float i = 0.0; i < 20.0; i++) { // Reduzido de 35 para 20
            v = p + cos(i * i + (iTime + p.x * 0.05) * 0.02 + i * vec2(10.0, 8.0)) * 2.5 + vec2(sin(iTime * 2.0 + i) * 0.002, cos(iTime * 2.5 - i) * 0.002);
            float tailNoise = fbm(v + vec2(iTime * 0.3, i)) * 0.2 * (1.0 - (i / 20.0));
            vec4 auroraColors = vec4(
              0.1 + 0.2 * sin(i * 0.15 + iTime * 0.3),
              0.3 + 0.4 * cos(i * 0.2 + iTime * 0.4),
              0.6 + 0.2 * sin(i * 0.3 + iTime * 0.2),
              0.7
            );
            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.6)) / length(max(v, vec2(v.x * f * 0.01, v.y * 1.2)));
            float thinnessFactor = smoothstep(0.0, 1.0, i / 20.0) * 0.5;
            o += currentContribution * (1.0 + tailNoise * 0.6) * thinnessFactor;
          }

          o = tanh(pow(o / 80.0, vec4(1.4))); // Reduzido de 100 para 80
          gl_FragColor = o * 1.2; // Reduzido de 1.5 para 1.2
        }
      `,
      transparent: true
    });
  }

  createMesh() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  animate() {
    const animate = () => {
      const elapsedTime = (Date.now() - this.startTime) / 1000;
      this.material.uniforms.iTime.value = elapsedTime;
      this.renderer.render(this.scene, this.camera);
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  handleResize() {
    const resize = () => {
      // Usar viewport completo
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', resize);
    resize(); // Chamar uma vez para configurar tamanho inicial
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
    
    if (this.material) {
      this.material.dispose();
    }
    
    if (this.mesh && this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Verificar performance do dispositivo
  function shouldEnableAurora() {
    // Verificar se é um dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Verificar se tem GPU adequada
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    
    // Verificar memória disponível (se suportado)
    const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    // Verificar se o usuário prefere reduzir movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Desabilitar em dispositivos móveis, sem WebGL, com pouca memória ou que preferem movimento reduzido
    return !isMobile && hasWebGL && !hasLowMemory && !prefersReducedMotion;
  }
  
  // Aguardar Three.js carregar se não estiver disponível
  function initAurora() {
    if (typeof THREE !== 'undefined') {
      // Verificar se deve habilitar aurora
      if (shouldEnableAurora()) {
        // Inicializar aurora global para todo o site
        const globalAurora = new AuroraBackground('global-aurora-container');
        
        // Adicionar controle de performance
        let isPaused = false;
        let lastTime = 0;
        const targetFPS = 30; // Reduzir FPS para economizar recursos
        const frameInterval = 1000 / targetFPS;
        
        // Pausar animação quando a aba não está visível
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            isPaused = true;
          } else {
            isPaused = false;
            lastTime = Date.now();
          }
        });
        
        // Pausar animação quando o usuário para de interagir
        let interactionTimeout;
        const resetInteraction = () => {
          isPaused = false;
          clearTimeout(interactionTimeout);
          interactionTimeout = setTimeout(() => {
            isPaused = true;
          }, 5000); // Pausar após 5 segundos de inatividade
        };
        
        document.addEventListener('mousemove', resetInteraction);
        document.addEventListener('scroll', resetInteraction);
        document.addEventListener('touchstart', resetInteraction);
        
        // Modificar o método animate para respeitar o FPS e pausar quando necessário
        const originalAnimate = globalAurora.animate;
        globalAurora.animate = function() {
          const animate = () => {
            const now = Date.now();
            if (!isPaused && (now - lastTime) >= frameInterval) {
              const elapsedTime = (Date.now() - this.startTime) / 1000;
              this.material.uniforms.iTime.value = elapsedTime;
              this.renderer.render(this.scene, this.camera);
              lastTime = now;
            }
            this.animationId = requestAnimationFrame(animate);
          };
          animate();
        };
        
        // Inicializar com pausa
        resetInteraction();
      } else {
        // Se não deve habilitar aurora, remover o container
        const container = document.getElementById('global-aurora-container');
        if (container) {
          container.style.display = 'none';
        }
      }
    } else {
      setTimeout(initAurora, 100);
    }
  }
  
  initAurora();
});