const HOME_PAGE = "homePage";
const EXPERIENCE_PAGE = "experiencePage";
const CONTACT_PAGE = "contactPage";
const PAGES = [HOME_PAGE, EXPERIENCE_PAGE, CONTACT_PAGE];
const EXPERIENCE_PAGE_PATTERN = /^\/?\#\/experience\/?$/;
const CONTACT_PAGE_PATTERN = /^\/?\#\/contact\/?$/;
const ROUTES = [
    {"pattern": CONTACT_PAGE_PATTERN, "page": CONTACT_PAGE, "path": "/#/contact"},
    {"pattern": EXPERIENCE_PAGE_PATTERN, "page": EXPERIENCE_PAGE, "path": "/#/experience"},
];
let currentPage = HOME_PAGE;

const updateBody = () => {
    if (currentPage === CONTACT_PAGE) {
        document.body.setAttribute("contact", "");
    } else if (document.body.hasAttribute("contact")) {
        document.body.removeAttribute("contact");
    }
};

// Switch to the specified page with an animation.
const switchToPage = (fromPageId, toPageId, path) => {
    history.pushState({}, "Panagiotis Roubatsis", path);
    currentPage = toPageId;

    const fromPage = document.getElementById(fromPageId);
    const toPage = document.getElementById(toPageId);
    fromPage.style.display = "flex";
    toPage.style.display = "flex";
    fromPage.style.zIndex = "100";
    toPage.style.zIndex = "50";

    fromPage.classList.add("change-content");
    setTimeout(() => {
        fromPage.style.display = "none";
        toPage.style.display = "flex";
        fromPage.style.zIndex = "";
        toPage.style.zIndex = "";
        fromPage.classList.remove("change-content");
        setTimeout(() => {
            updateBody();
            window.eventLogClient.sendEvent("SWITCH_TO_PAGE", {
                pageId: toPageId,
            });
        }, 100);
    }, 500);
};

const contactButton = document.getElementById("contactButton");
contactButton.onclick = () => {
    switchToPage(currentPage, CONTACT_PAGE, "/#/contact");
};
const experienceButton = document.getElementById("experienceButton");
experienceButton.onclick = () => {
    switchToPage(currentPage, EXPERIENCE_PAGE, "/#/experience");
};

const loadPage = (pageIdToLoad) => {
    PAGES.forEach((pageId) => {
        const page = document.getElementById(pageId);
        page.style.display = "none";
    });
    const page = document.getElementById(pageIdToLoad);
    page.style.display = "flex";
    currentPage = pageIdToLoad;
    updateBody();
};

const getRoute = () => ROUTES.find((route) => location.hash.match(route.pattern));

// Make sure we display the correct page when the user loads the site
window.onload = () => {
    const route = getRoute();
    if (route) {
        loadPage(route.page);
        window.eventLogClient.initialize().then(() => {
            window.eventLogClient.sendEvent("LOAD_PAGE", {
                pageId: route.page,
            });
        });
    } else {
        window.eventLogClient.initialize().then(() => {
            window.eventLogClient.sendEvent("LOAD_PAGE", {
                pageId: HOME_PAGE,
            });
        });
    }

    // Check if the contact API is available
    fetch("http://contact-api.panagiotis.io/ping").then((response) => {
        if (!response.ok) {
            contactButton.style.display = "none";
        }
    });
};

// When the user navigates via browser history, we should switch to the corresponding page.
window.onhashchange = () => {
    const route = getRoute();
    if (route) {
        switchToPage(currentPage, route.page, route.url);
    } else {
        switchToPage(currentPage, HOME_PAGE, "/#");
    }
};
