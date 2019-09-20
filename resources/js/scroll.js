// Constants
const blackoutOpacity = 0.8;

function onLoad() {
    const bodyEl = document.body;
    const pages = document.getElementsByClassName('page');
    const numPages = pages.length;
    const blackout = document.getElementsByClassName('blackout')[0];

    // init body height
    const bodyHeight = window.innerHeight * numPages;
    bodyEl.style.height = bodyHeight + 'px';

    // init page z-indexes
    let currentZIndex = numPages;
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        page.style.visibility = 'visible';
        page.style.zIndex = currentZIndex;
        currentZIndex--;
    }

    // init blackout opacity and z-index
    blackout.style.opacity = blackoutOpacity;
    blackout.style.zIndex = numPages;
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
    const windowHeight = window.innerHeight;
    const pages = document.getElementsByClassName('page');
    const currentPageIndex = Math.floor(currentScrollY / windowHeight);

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
        currentPage.style.transform = `translateY(${-(currentScrollY / windowHeight)}%)`;
    }

    // set blackout opacity and z-index
    const blackout = document.getElementsByClassName('blackout')[0];
    blackout.style.zIndex = currentPage.style.zIndex;
    blackout.style.opacity = blackoutOpacity - (((currentScrollY % windowHeight) / windowHeight) * blackoutOpacity);

    console.log('currentScrollY: ', currentScrollY);

}

window.addEventListener('load', onLoad);
window.addEventListener('scroll', onScroll);
// TODO: add event listener for arrow key press to animate page transitions