// Dados dos portfolios dos membros da equipe
const portfolioData = {
    portfolio1: {
        name: "João Silva",
        role: "CEO & Desenvolvedor Full-Stack",
        bio: "Líder técnico com mais de 8 anos de experiência em desenvolvimento de software. Especialista em arquiteturas escaláveis e liderança de equipes.",
        projects: [
            {
                title: "Sistema de E-commerce",
                description: "Plataforma completa de vendas online com mais de 10.000 produtos e 50.000 usuários ativos.",
                technologies: ["React", "Node.js", "MongoDB", "AWS"],
                year: "2023"
            },
            {
                title: "App de Delivery",
                description: "Aplicativo mobile para entrega de comida com geolocalização em tempo real.",
                technologies: ["React Native", "Firebase", "Google Maps API"],
                year: "2022"
            },
            {
                title: "Sistema ERP",
                description: "Sistema de gestão empresarial para pequenas e médias empresas.",
                technologies: ["Vue.js", "Laravel", "MySQL"],
                year: "2021"
            }
        ],
        skills: ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
        achievements: [
            "Liderou equipe de 15 desenvolvedores",
            "Reduziu tempo de desenvolvimento em 40%",
            "Implementou metodologias ágeis"
        ]
    },
    portfolio2: {
        name: "Maria Santos",
        role: "CTO & Especialista em Arquitetura",
        bio: "Arquiteta de software com foco em soluções cloud e microserviços. Experiência em transformação digital e otimização de infraestrutura.",
        projects: [
            {
                title: "Plataforma de Streaming",
                description: "Sistema de streaming de vídeo com suporte a milhões de usuários simultâneos.",
                technologies: ["Kubernetes", "Docker", "AWS", "Redis"],
                year: "2023"
            },
            {
                title: "Migração para Cloud",
                description: "Migração completa de infraestrutura on-premise para AWS, reduzindo custos em 60%.",
                technologies: ["AWS", "Terraform", "Jenkins", "Prometheus"],
                year: "2022"
            },
            {
                title: "Sistema de Monitoramento",
                description: "Plataforma de monitoramento em tempo real para aplicações distribuídas.",
                technologies: ["Elasticsearch", "Kibana", "Grafana", "Python"],
                year: "2021"
            }
        ],
        skills: ["AWS", "Docker", "Node.js", "Kubernetes", "Python", "Terraform", "DevOps"],
        achievements: [
            "Certificada AWS Solutions Architect",
            "Reduziu custos de infraestrutura em 60%",
            "Implementou DevOps em 10+ projetos"
        ]
    },
    portfolio3: {
        name: "Carlos Oliveira",
        role: "Designer UX/UI & Frontend",
        bio: "Designer especializado em experiência do usuário e interfaces modernas. Criativo e focado em soluções que encantam os usuários.",
        projects: [
            {
                title: "Dashboard Analytics",
                description: "Interface moderna para visualização de dados e métricas de negócio.",
                technologies: ["React", "D3.js", "Figma", "Storybook"],
                year: "2023"
            },
            {
                title: "App de Finanças",
                description: "Aplicativo mobile para controle financeiro pessoal com design intuitivo.",
                technologies: ["React Native", "Figma", "Adobe XD"],
                year: "2022"
            },
            {
                title: "Website Corporativo",
                description: "Redesign completo de website corporativo com foco em conversão.",
                technologies: ["HTML5", "CSS3", "JavaScript", "Figma"],
                year: "2021"
            }
        ],
        skills: ["Figma", "React", "CSS3", "Adobe XD", "Sketch", "Principle", "User Research"],
        achievements: [
            "Aumentou conversão em 35%",
            "Prêmio de Melhor UX Design 2022",
            "Especialista em Design System"
        ]
    },
    portfolio4: {
        name: "Ana Costa",
        role: "Especialista DevOps & Backend",
        bio: "Especialista em automação e infraestrutura como código. Focada em criar pipelines de CI/CD eficientes e ambientes estáveis.",
        projects: [
            {
                title: "Pipeline CI/CD",
                description: "Automação completa de deploy com testes automatizados e rollback automático.",
                technologies: ["Jenkins", "Docker", "Kubernetes", "SonarQube"],
                year: "2023"
            },
            {
                title: "API Gateway",
                description: "Gateway de API com rate limiting, autenticação e monitoramento.",
                technologies: ["Kong", "Python", "Redis", "Prometheus"],
                year: "2022"
            },
            {
                title: "Sistema de Backup",
                description: "Solução automatizada de backup com recuperação em 15 minutos.",
                technologies: ["Python", "AWS S3", "MongoDB", "Cron"],
                year: "2021"
            }
        ],
        skills: ["Kubernetes", "Python", "MongoDB", "Jenkins", "AWS", "Docker", "Terraform"],
        achievements: [
            "Reduziu tempo de deploy em 80%",
            "Zero downtime em 2 anos",
            "Certificada Kubernetes Administrator"
        ]
    }
};

// Elementos do DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const teamMembers = document.querySelectorAll('.team-member');
const modal = document.getElementById('portfolio-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close');
const contactForm = document.querySelector('.contact-form');

// Menu mobile
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Abrir modal do portfolio
teamMembers.forEach(member => {
    member.addEventListener('click', () => {
        const portfolioId = member.getAttribute('data-portfolio');
        const portfolio = portfolioData[portfolioId];
        
        if (portfolio) {
            showPortfolioModal(portfolio);
        }
    });
});

// Função para mostrar o modal do portfolio
function showPortfolioModal(portfolio) {
    modalBody.innerHTML = `
        <div class="portfolio-content">
            <h2>${portfolio.name}</h2>
            <p><strong>Cargo:</strong> ${portfolio.role}</p>
            <p><strong>Sobre:</strong> ${portfolio.bio}</p>
            
            <h3>Projetos Principais</h3>
            <div class="portfolio-grid">
                ${portfolio.projects.map(project => `
                    <div class="portfolio-item">
                        <h4>${project.title} (${project.year})</h4>
                        <p>${project.description}</p>
                        <p><strong>Tecnologias:</strong> ${project.technologies.join(', ')}</p>
                    </div>
                `).join('')}
            </div>
            
            <h3>Habilidades Técnicas</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                ${portfolio.skills.map(skill => `
                    <span style="background: #4F46E5; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem;">
                        ${skill}
                    </span>
                `).join('')}
            </div>
            
            <h3>Principais Conquistas</h3>
            <ul style="color: #666; line-height: 1.6;">
                ${portfolio.achievements.map(achievement => `
                    <li>${achievement}</li>
                `).join('')}
            </ul>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Fechar modal ao clicar fora dele
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Formulário de contato
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const subject = contactForm.querySelectorAll('input[type="text"]')[1].value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simulação de envio (aqui você integraria com seu backend)
    alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!`);
    
    // Limpar formulário
    contactForm.reset();
});

// Animação de scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .team-member, .stat');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Efeito parallax no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (heroGraphic) {
        heroGraphic.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Contador animado para estatísticas
function animateCounters() {
    const counters = document.querySelectorAll('.stat h4');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// Iniciar animação dos contadores quando a seção about estiver visível
const aboutSection = document.querySelector('.about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// Adicionar classe ativa ao link de navegação atual
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Preloader (opcional)
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Validação de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Adicionar validação em tempo real ao formulário
const emailInput = document.querySelector('input[type="email"]');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            emailInput.style.borderColor = '#DC2626';
            emailInput.style.color = '#DC2626';
        } else {
            emailInput.style.borderColor = '#E5E7EB';
            emailInput.style.color = '#333';
        }
    });
}
