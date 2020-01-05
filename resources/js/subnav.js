/* Optimized for when each subnav section is equal to viewport height */

const SUBNAV_PAGES = [
    {
        id: 'page-2',
        startAfterPage: 1,
        numPages: 4
    }, {
        id: 'page-6',
        startAfterPage: 4,
        numPages: 1
    }, {
        id: 'page-7',
        startAfterPage: 5,
        numPages: 3
    }, {
        id: 'page-10',
        startAfterPage: 8,
        numPages: 3
    }
];
const SUBNAV_ITEMS = document.getElementById('subnav').children;
const WINDOW_HEIGHT = window.innerHeight;
const NUM_HERO_PAGES = 1;
let lastScrollY = 0;

const scrollToElement = (id, index) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', inline: 'start' });
}

const updateSubnav = (index) => {
    if (typeof index === 'number') {
        // a subnav was clicked on, so highlight it
        const currentItem = SUBNAV_ITEMS[index];
        if (currentItem) {
            currentItem.classList.remove('selectable');
            currentItem.classList.add('selected-subnav');
            currentItem.onclick = null;

            // un-highlight other items
            for (let i = 0; i < SUBNAV_ITEMS.length; i++) {
                if (i === index) continue;
                const item = SUBNAV_ITEMS[i];
                item.classList.remove('selected-subnav');
                item.classList.add('selectable');
                item.onclick = () => {
                    scrollToElement(SUBNAV_PAGES[i].id);
                }
            }
        }
    } else {
        // deselect all items
        for (let i = 0; i < SUBNAV_ITEMS.length; i++) {
            const item = SUBNAV_ITEMS[i];
            item.classList.remove('selected-subnav');
            item.classList.add('selectable');
            item.onclick = () => {
                scrollToElement(SUBNAV_PAGES[i].id);
            }
        }
    }
};

const onScroll = () => {
    lastScrollY = window.scrollY || window.pageYOffset;

    if (lastScrollY < (NUM_HERO_PAGES * WINDOW_HEIGHT)) {
        // scrolled to hero, so unhighlight all subnav items
        updateSubnav();
    } else {
        // detect window scroll position and highlight correct subnav item
        let itemIndex;
        for (let i = 0; i < SUBNAV_PAGES.length; i++) {
            const item = SUBNAV_PAGES[i];
            if (lastScrollY >= (WINDOW_HEIGHT * item.startAfterPage) && lastScrollY < (WINDOW_HEIGHT * (item.startAfterPage + item.numPages))) {
                itemIndex = i;
                break;
            }
        }

        updateSubnav(itemIndex);
    }
}

window.addEventListener('load', onScroll);
window.addEventListener('scroll', onScroll);