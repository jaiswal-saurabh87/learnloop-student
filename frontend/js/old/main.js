document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.getElementById('main-content');
    let menuOpen = false;

    menuBtn.addEventListener('click', () => {
        if (!menuOpen) {
            menuBtn.classList.add('open');
            sidebar.classList.add('open');
            menuOpen = true;
        } else {
            menuBtn.classList.remove('open');
            sidebar.classList.remove('open');
            menuOpen = false;
        }
    });

    sidebar.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            const page = e.target.getAttribute('data-page');
            fetch(page)
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                });
        }
    });
});