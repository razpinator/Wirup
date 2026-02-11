import { wijax } from './network.js';
import { getElement } from './utils.js';

let appLocation = window.location.pathname;
let views = [];
let routeParams = {};

// Callback placeholders
let renderViewComponents = () => Promise.resolve();
let initCallback = () => {};

export const setRenderViewComponentsCallback = (cb) => { renderViewComponents = cb; };
export const setInitCallback = (cb) => { initCallback = cb; };
export const getRouteParams = () => routeParams;

const getViews = (data) => {
    // If wijax returns string (it does), parse it.
    // Ensure we handle if it's already object matching original logic? 
    // Original: _views = JSON.parse(data)["views"];
    views = JSON.parse(data)["views"];
};

export const registerViews = () => {
    return wijax(
        "GET",
        "views/views.json",
        "application/json; charset=UTF-8",
        getViews
    );
};

const fillView = (index, targetElementId) => {
    // Original: const htmlFilePath = "views/" + _views[index]["viewFile"];
    // Note: This relies on relative path "views/".
    const htmlFilePath = "views/" + views[index]["viewFile"];
    return new Promise((resolve, reject) => {
        fetch(htmlFilePath + "?") // Original had + "?"
             .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    reject(`Failed to load HTML view: ${htmlFilePath}`);
                }
            })
            .then((htmlContent) => {
                const targetElement = getElement(targetElementId);
                if (targetElement) {
                    targetElement.innerHTML = htmlContent;
                    resolve();
                } else {
                    reject(`Target element with ID "${targetElementId}" not found`);
                }
            })
            .catch(reject);
    });
};

export const getTemplate = (target) => {
    return new Promise((resolve, reject) => {
        let index;
        // Fallback: if appLocation is not defined (can happen?), default to root "/"
        // Original logic:
        const url = appLocation || "/";

        if (!views || views.length === 0) {
            reject("Views are undefined or empty, cannot load template.");
            return;
        }

        for (let i = 0; i < views.length; i++) {
            if (views[i]["url"] === url) {
                index = i;
                routeParams = {};
                break;
            }
            
            // Check for route parameters
            const routePattern = views[i]["url"];
            if (routePattern.includes(":")) {
                const regexPattern = routePattern.replace(/:([^\s/]+)/g, '([^\\s/]+)');
                const matcher = new RegExp('^' + regexPattern + '$');
                const match = url.match(matcher);

                if (match) {
                    index = i;
                    routeParams = {};
                    
                    // Extract param names
                    const paramNames = (routePattern.match(/:([^\s/]+)/g) || []).map(s => s.slice(1));
                    
                    // Assign values
                    paramNames.forEach((name, idx) => {
                        routeParams[name] = match[idx + 1];
                    });
                    break;
                }
            }
        }

        if (index === undefined) {
             console.warn(`No view found for the URL: ${url}. Redirecting to default view.`);
             index = 0;
        }

        fillView(index, target)
            .then(() => resolve())
            .catch((error) => {
                console.error(`Error filling view for URL ${url}: ${error}`);
                reject(`Failed to fill view for ${url}`);
            });
    }).catch((error) => {
        console.error(`Error in getTemplate: ${error}`);
    });
};

export const navigateTo = (url) => {
    history.pushState(null, null, url);
    appLocation = url;
    getTemplate("contentBody").then(() => {
        renderViewComponents();
    });
};

export const bindRouter = () => {
    window.onpopstate = (event) => {
        appLocation = window.location.pathname;
        initCallback();
    };
};
