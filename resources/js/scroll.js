function onLoad() {
    const bodyEl = document.body;
    const pages = document.getElementsByClassName('page');
    const numPages = pages.length;

    // set body height
    const bodyHeight = window.innerHeight * numPages;
    bodyEl.style.height = bodyHeight + 'px';

    // set page z-indexes
    let currentZIndex = numPages;
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        page.style.visibility = 'visible';
        page.style.zIndex = currentZIndex;
        currentZIndex--;
    }
};

let lastScrollY = 0; // value used for animation
let ticking = false;

function onScroll(e) {
    lastScrollY = window.scrollY || window.pageYOffset;
    requestTick();
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateElements);
    }
    ticking = true;
}

function updateElements() {
    // reset ticking
    ticking = false;

    const currentScrollY = lastScrollY;
    const pages = document.getElementsByClassName('page');
    const currentPageIndex = Math.floor(currentScrollY / window.innerHeight);

    const currentPage = pages[currentPageIndex];
    const prevPage = pages[currentPageIndex - 1];
    const nextPage = pages[currentPageIndex + 1];

    if (prevPage) {
        prevPage.className = 'page prev-page';
        prevPage.style.transform = 'none';
    }
    if (nextPage) {
        nextPage.className = 'page next-page';
    }

    // set current page style if not last page
    if (currentPageIndex < pages.length - 1) {
        currentPage.className = 'page current-page';
        currentPage.style.transform = `translateY(${-(currentScrollY / window.innerHeight)}%)`;
    }

    console.log('currentScrollY: ', currentScrollY);

}

window.addEventListener('load', onLoad);
window.addEventListener('scroll', onScroll);
// TODO: add event listener for arrow key press to animate page transitions