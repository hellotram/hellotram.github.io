document.getElementById('work-nav').onclick = function() {
    document.getElementById('work-subnav').classList.toggle('show');
}

document.getElementById('work-nav-mob').onclick = function() {
    document.getElementById('work-subnav-mob').classList.toggle('show');
}

document.getElementById('hamburger').onclick = function() {
    const navList = document.getElementById('nav-list-container');
    const nav = document.getElementById('mobile-nav');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    navList.classList.toggle('shown');

    if (navList.classList.contains('shown')) {
        nav.style.boxShadow = '0 0 8px #949494';
        nav.style.height = 'auto';
        nav.style.paddingRight = '40px';
        hamburgerIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        nav.style.boxShadow = 'none';
        nav.style.height = '100%';
        nav.style.paddingRight = '20px';
        closeIcon.style.display = 'none';
        hamburgerIcon.style.display = 'block';
    }
}
