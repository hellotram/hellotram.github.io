// Constants
const WINDOW_HEIGHT = window.innerHeight;
const BODY = document.body;
const PAGES = document.getElementsByClassName('page');
const NUM_PAGES = PAGES.length;
const BLACKOUT = document.getElementsByClassName('blackout')[0];
const BLACKOUT_OPACITY = 0.8;

// Variables
let lastScrollY = 0; // value used for animation
let ticking = false;

const setDocumentBodyHeight = () => {
    const bodyHeight = WINDOW_HEIGHT * NUM_PAGES;
    BODY.style.height = bodyHeight + 'px';
}

const setBlackoutElement = (zIndex, opacity) => {
    BLACKOUT.style.zIndex = zIndex;
    BLACKOUT.style.opacity = opacity;
}

const onLoad = () => {
    // init body height
    setDocumentBodyHeight();

    // init page z-indexes
    let currentZIndex = NUM_PAGES;
    for (let i = 0; i < PAGES.length; i++) {
        const page = PAGES[i];
        page.style.visibility = 'visible';
        page.style.zIndex = currentZIndex;
        currentZIndex--;
    }

    // init blackout opacity and z-index
    setBlackoutElement(BLACKOUT_OPACITY, NUM_PAGES);
};

const onScroll = (e) => {
    lastScrollY = window.scrollY || window.pageYOffset;
    requestTick();
}

const requestTick = () => {
    if (!ticking) {
        requestAnimationFrame(updateElements);
    }
    ticking = true;
}

const getCurrentPageIndex = () => {
    return Math.floor(lastScrollY / WINDOW_HEIGHT);
}

const getCurrentPages = () => {
    const currentPageIndex = getCurrentPageIndex();

    return {
        currentPage: PAGES[currentPageIndex],
        prevPage: PAGES[currentPageIndex - 1],
        nextPage: PAGES[currentPageIndex + 1]
    };
}

const updateElements = () => {
    // reset ticking
    ticking = false;

    const currentScrollY = lastScrollY;
    const currentPageIndex = getCurrentPageIndex();
    const { currentPage, prevPage, nextPage } = getCurrentPages();

    if (prevPage) {
        prevPage.className = 'page prev-page';
        prevPage.style.transform = 'none';
    }
    if (nextPage) {
        nextPage.className = 'page next-page';
        nextPage.style.transform = 'none';
    }

    // set current page style if not last page
    if (currentPageIndex < PAGES.length - 1) {
        currentPage.className = 'page current-page';

        if (currentScrollY % WINDOW_HEIGHT === 0) {
            // don't transform when at edge of page
            currentPage.style.transform = 'none';
        } else {
            currentPage.style.transform = `translateY(${-(currentScrollY / WINDOW_HEIGHT)}%)`;
        }
    }

    // set blackout opacity and z-index
    const currentPageZIndex = currentPage.style.zIndex;
    const currentBlackoutOpacity = BLACKOUT_OPACITY - (((currentScrollY % WINDOW_HEIGHT) / WINDOW_HEIGHT) * BLACKOUT_OPACITY);
    setBlackoutElement(currentPageZIndex, currentBlackoutOpacity);

    console.log('currentScrollY: ', currentScrollY);
}

const onResize = () => {
    // reset body height
    setDocumentBodyHeight();

    console.log(`new body height: ${bodyHeight}px`);
}

const snapToNext = (e) => {
    const currentScrollY = lastScrollY;
    const { currentPage } = getCurrentPages();

    let nextScrollY;

    if (e.keyCode === 38) {
        // scroll up
        nextScrollY = currentScrollY - (currentScrollY % WINDOW_HEIGHT || WINDOW_HEIGHT);
    } else {
        // scroll down
        nextScrollY = currentScrollY + WINDOW_HEIGHT - (currentScrollY % WINDOW_HEIGHT);
    }

    window.scrollTo({
        top: nextScrollY,
        behavior: 'smooth'
    });
}

const onKeyDown = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
        snapToNext(e);
    }
}

window.addEventListener('load', onLoad);
window.addEventListener('scroll', onScroll);
window.addEventListener('resize', onResize);
window.addEventListener('keydown', onKeyDown);
