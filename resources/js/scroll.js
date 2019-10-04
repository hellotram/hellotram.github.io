// Constants
const WINDOW_HEIGHT = window.innerHeight;
// const WINDOW_HEIGHT = 1000;
const BODY = document.body;
const PAGES = document.getElementsByClassName('page');
const NUM_PAGES = PAGES.length;
const BLACKOUT = document.getElementsByClassName('blackout')[0];
const BLACKOUT_OPACITY = 0.8;
const PAGE_BUFFER = 180;
const NUM_PARALLAX_PAGES = 2;

// Variables
let lastScrollY = 0; // value used for animation
let ticking = false;

const setDocumentBodyHeight = () => {
    const bodyHeight = WINDOW_HEIGHT * NUM_PAGES + (PAGE_BUFFER * (NUM_PAGES - 1));
    BODY.style.height = bodyHeight + 'px';

    console.log(`new body height: ${bodyHeight}px`);
}

const setBlackoutElement = (zIndex, opacity, currentScrollY) => {
    currentScrollY = currentScrollY || window.pageYOffset;

    // hide blackout on first pages
    BLACKOUT.style.visibility = currentScrollY < (WINDOW_HEIGHT + PAGE_BUFFER) ? 'hidden' : 'visible';
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
    setBlackoutElement(NUM_PAGES, BLACKOUT_OPACITY);

    // hack for preventing parallax item from jumping
    lastScrollY = window.scrollY || window.pageYOffset;
    if (lastScrollY >= WINDOW_HEIGHT) {
        const parallax2 = document.getElementById('parallax-2');
        parallax2.style.left = `${800 * 0.33}px`
    }
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
    if (lastScrollY < WINDOW_HEIGHT) {
        return 0;
    }

    return Math.floor((lastScrollY - WINDOW_HEIGHT) / (WINDOW_HEIGHT + PAGE_BUFFER)) + 1;
}

const updateElements = () => {
    // reset ticking
    ticking = false;

    const currentScrollY = lastScrollY;
    const currentPageIndex = getCurrentPageIndex();
    console.log('currentPageIndex:', currentPageIndex);
    const currentPageBuffer = currentPageIndex * PAGE_BUFFER;
    const currentPageZIndex = NUM_PAGES - currentPageIndex;
    let currentBlackoutOpacity;

    /* PARALLAX ITEMS */
    // name logo
    const parallax1 = document.getElementById('parallax-1');
    parallax1.style.transform = `translateX(-${(currentScrollY / WINDOW_HEIGHT) * 175}%)`;
    const parallax2 = document.getElementById('parallax-2');
    const currentLeft2 = parallax2.getBoundingClientRect().left;

    // mockup image
    if (currentScrollY < WINDOW_HEIGHT) {
        // move across
        parallax2.style.transform = `translateX(-${(currentScrollY / WINDOW_HEIGHT) * 45}%)`;
        parallax2.style.left = '800px';
    } else if (currentScrollY >= WINDOW_HEIGHT && currentScrollY <= WINDOW_HEIGHT + PAGE_BUFFER) {
        // stay in place
        parallax2.style.left = `${currentLeft2}px`;
        parallax2.style.transform = 'none';
    } else {
        // move up
        parallax2.style.left = `${currentLeft2}px`;
        parallax2.style.transform = `translateY(${-(currentScrollY - (WINDOW_HEIGHT + PAGE_BUFFER))}px)`;
    }

    /* PAGE ITEMS */
    for (let i = 0; i < PAGES.length; i++) {
        const page = PAGES[i];

        if (page) {
            if (i < currentPageIndex) {
                // prev page
                page.className = 'page prev-page';
                page.style.transform = 'none';
                page.style.top = 0;
            } else if (i > currentPageIndex) {
                // next page
                page.className = 'page next-page';
                page.style.transform = 'none';
                page.style.position = 'fixed';
                page.style.top = 0;
            } else {
                // current page
                page.className = 'page current-page';

                // don't transform last page
                if (currentPageIndex === PAGES.length - 1) {
                    page.style.position = 'fixed';
                }

                if ((currentScrollY - WINDOW_HEIGHT) % (WINDOW_HEIGHT + PAGE_BUFFER) >= 0 && (currentScrollY - WINDOW_HEIGHT) % (WINDOW_HEIGHT + PAGE_BUFFER) < PAGE_BUFFER) {
                    // don't transform when in between pages
                    page.style.transform = 'none';
                    page.style.position = 'fixed';
                    page.style.top = 0;
                    currentBlackoutOpacity = BLACKOUT_OPACITY;
                } else {
                    page.style.position = 'relative';
                    page.style.top = `${currentPageBuffer}px`;
                    page.style.transform = `translateY(${-((currentScrollY % WINDOW_HEIGHT) / WINDOW_HEIGHT)}px)`;
                    currentBlackoutOpacity = BLACKOUT_OPACITY - (((currentScrollY % (WINDOW_HEIGHT + PAGE_BUFFER)) / WINDOW_HEIGHT) * BLACKOUT_OPACITY);
                }
            }
        }
    }

    // set blackout opacity and z-index
    setBlackoutElement(currentPageZIndex, currentBlackoutOpacity, currentScrollY);

    console.log('currentScrollY: ', currentScrollY);
}

const onResize = () => {
    // reset body height
    setDocumentBodyHeight();
    // location.reload();
}

const snapToNext = (e) => {
    const currentScrollY = lastScrollY;
    const currentPageIndex = getCurrentPageIndex();
    const currentPage = PAGES[currentPageIndex];

    let nextScrollY;

    if (e.keyCode === 38) {
        // scroll up
        nextScrollY = currentScrollY - (currentScrollY % (WINDOW_HEIGHT + PAGE_BUFFER) || (WINDOW_HEIGHT + PAGE_BUFFER));
    } else {
        // scroll down
        nextScrollY = currentScrollY + WINDOW_HEIGHT + PAGE_BUFFER - (currentScrollY % (WINDOW_HEIGHT + PAGE_BUFFER));
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
