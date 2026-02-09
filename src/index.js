import * as utils from './utils.js';
import * as network from './network.js';
import * as actions from './actions.js';
import * as data from './data.js';
import * as components from './components.js';
import * as router from './router.js';

// Implement renderViewComponents
const renderViewComponents = () => {
    return new Promise((resolve, reject) => {
        const contentBody = utils.getElement("contentBody");
        if (!contentBody) {
             resolve();
             return;
        }
        const viewComponents = contentBody.querySelectorAll("[datasource]");
        [].forEach.call(viewComponents, (component) => {
             component.innerHTML = components.buildComponent(
                component.tagName.toLowerCase(),
                component.getAttribute("datasource")
             );
        });
        actions.registerAction("Switched View", "CBody", "NA");
        resolve();
    });
};

const updateComponentsByDataSourceName = (dataSourceName) => {
    const contentBody = utils.getElement("contentBody");
    if (!contentBody) return;
    
    contentBody.querySelectorAll('[datasource="' + dataSourceName + '"]')
        .forEach((elem) => {
            elem.innerHTML = components.buildComponent(
                elem.tagName.toLowerCase(),
                dataSourceName
            );
            actions.registerAction("Updated Data.", elem.tagName.toLowerCase(), "No Comment.");
        });
};

// Wire up callbacks
router.setRenderViewComponentsCallback(renderViewComponents);
data.setUpdateComponentsCallback(updateComponentsByDataSourceName);

// onLoad observer
const loadObserver = {};
const onLoad = (value) => {
  Object.defineProperty(loadObserver, "trigger", {
    get: function () {
      return this["_trigger"];
    },
    set: function (newValue) {
      this["_trigger"] = newValue;
      if (typeof window[newValue] === 'function') {
        window[newValue]();
      }
    },
  });
  loadObserver["trigger"] = value;
};

const onContentLoad = (functionName) => {
    if (typeof window[functionName] === 'function') {
        return window[functionName]();
    }
};

const renderAll = (config) => {
    return new Promise((resolve, reject) => {
        let componentsFiles = ["components.js"];
        if (config?.components && Array.isArray(config.components) && config.components.length > 0) {
            componentsFiles = config.components;
        }
        
        utils.loadScriptsFromFolder("components", componentsFiles).then(() => {
             router.registerViews().then(() => {
                 router.getTemplate("contentBody").then(() => {
                     renderViewComponents().then(() => {
                         router.bindRouter(() => init());
                         if(typeof config.callbackName !== "undefined") {
                             onContentLoad(config.callbackName);
                         }
                         resolve();
                     });
                 });
             });
        });
    });
};

const init = (config) => {
    renderAll(config);
};

// Wire up router init callback
router.setInitCallback(() => init());

// Event Delegation System
const eventHandlers = {};

const registerEventHandler = (eventName, handler) => {
    eventHandlers[eventName] = handler;
};

if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
        let target = e.target;
        while (target && target !== document) {
            if (target.hasAttribute && target.hasAttribute('wu-click')) {
                const handlerName = target.getAttribute('wu-click');
                const data = target.getAttribute('wu-data');
                if (eventHandlers[handlerName]) {
                    eventHandlers[handlerName](e, data);
                }
                break;
            }
            target = target.parentNode;
        }
    });
}

const Wirup = {
    wx: utils.getElement,
    wijax: network.wijax,
    jsonize: utils.jsonize,
    loadScript: utils.loadScript,
    
    registerComponent: components.registerComponent,
    buildComponent: components.buildComponent,
    buildComponents: components.buildComponents,
    components: components.components,
    
    registerProfile: actions.registerProfile,
    registerAction: actions.registerAction,
    
    registerEventHandler: registerEventHandler,

    navigateTo: router.navigateTo,
    
    registerData: data.registerData,
    addData: data.addData,
    findIndexByKey: data.findIndexByKey,
    updateData: data.updateData,
    removeData: data.removeData,
    dataStore: data.dataStore,
    
    onLoad: onLoad,
    init: init
};

export default Wirup;

// Global assignment for backward compatibility
if (typeof window !== 'undefined') {
    window.wu = Wirup;
}
