// Função para manipular o menu hambúrguer animado
document.addEventListener('DOMContentLoaded', function () {
    // Procura por todos os checkboxes do menu hambúrguer
    const hamburgerInputs = document.querySelectorAll('.hamburger input');

    // Adiciona um listener para cada checkbox
    hamburgerInputs.forEach(input => {
        input.addEventListener('change', function () {
            const drawer = document.getElementById('drawer');

            if (this.checked) {
                // Se o checkbox estiver marcado, abre o menu
                drawer.classList.add('open');
            } else {
                // Se o checkbox não estiver marcado, fecha o menu
                drawer.classList.remove('open');
            }
        });
    });

    // Adiciona um listener para o backdrop do menu
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', function () {
            closeMenu();
        });
    }

    // Sobrescreve a função toggleDrawer para garantir compatibilidade
    window.toggleDrawer = function () {
        const drawer = document.getElementById('drawer');
        const checkbox = document.querySelector('.hamburger input');

        if (drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            if (checkbox) checkbox.checked = false;
        } else {
            drawer.classList.add('open');
            if (checkbox) checkbox.checked = true;
        }
    };
});

// Função para fechar o menu quando um link é clicado
function closeMenu() {
    // Fecha o menu
    document.getElementById('drawer').classList.remove('open');

    // Desmarca o checkbox
    const checkbox = document.querySelector('.hamburger input');
    if (checkbox) {
        checkbox.checked = false;
    }
}
