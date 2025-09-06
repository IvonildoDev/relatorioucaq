// Função para alternar a visibilidade do menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Adiciona animações aos elementos da página quando carregada
document.addEventListener('DOMContentLoaded', function () {
    // Anima os elementos principais com um pequeno atraso para criar efeito cascata
    const heroSection = document.querySelector('.hero-section');
    const infoSections = document.querySelectorAll('.info-section');
    const developerInfo = document.querySelector('.developer-info');

    setTimeout(() => {
        if (heroSection) {
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'translateY(-20px)';
            heroSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                heroSection.style.opacity = '1';
                heroSection.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 200);

    // Anima cada seção de informação com atraso incremental
    if (infoSections) {
        infoSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 400 + (index * 200));
        });
    }

    // Anima a seção do desenvolvedor no final
    setTimeout(() => {
        if (developerInfo) {
            developerInfo.style.opacity = '0';
            developerInfo.style.transition = 'opacity 0.8s ease';

            setTimeout(() => {
                developerInfo.style.opacity = '1';
            }, 800);
        }
    }, 1000);
});
