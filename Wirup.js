var wirup = (function() {
  "use strict";
  const getElement = (elementId) => {
    return document.getElementById(elementId);
  };
  const jsonize = (objectName) => {
    try {
      return JSON.parse(window[objectName]);
    } catch (e) {
      return window[objectName];
    }
  };
  const loadScript = (scriptPath) => {
    return new Promise((resolve, reject) => {
      let newScript = document.createElement("script");
      newScript.type = "text/javascript";
      newScript.src = scriptPath;
      document.getElementsByTagName("head")[0].appendChild(newScript);
      newScript.onload = () => {
        resolve();
      };
      newScript.onerror = () => {
        reject(`Failed to load script: ${scriptPath}`);
      };
    });
  };
  const loadScriptsFromFolder = (folderPath, scriptNames) => {
    return new Promise((resolve, reject) => {
      const promises = scriptNames.map((scriptName) => {
        return loadScript(`${folderPath}/${scriptName}`);
      });
      Promise.all(promises).then(resolve).catch((err) => {
        console.error(`Error loading scripts from folder: ${err}`);
        reject(err);
      });
    }).catch((error) => {
      console.error(`Error in loadScriptsFromFolder: ${error}`);
    });
  };
  const escapeHtml = (unsafe) => {
    if (typeof unsafe !== "string") return unsafe;
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };
  const sanitize = (data) => {
    if (typeof data === "string") {
      return escapeHtml(data);
    }
    if (Array.isArray(data)) {
      return data.map((item) => sanitize(item));
    }
    if (typeof data === "object" && data !== null) {
      const safeObj = {};
      Object.keys(data).forEach((key) => {
        safeObj[key] = sanitize(data[key]);
      });
      return safeObj;
    }
    return data;
  };
  const wijax = async (callType, url, contentType, callback) => {
    try {
      const response = await fetch(url, {
        method: callType,
        headers: {
          "Content-Type": contentType,
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
        },
        cache: "no-store"
      });
      if (!response.ok) {
        const error = response.statusText || "Your ajax request threw an error.";
        throw error;
      }
      const responseText = await response.text();
      if (callback) {
        return callback(responseText);
      } else {
        return responseText;
      }
    } catch (error) {
      throw error;
    }
  };
  let profile = "";
  const ACTIONS_KEY = "wuActions";
  const registerProfile = (newProfile) => {
    profile = newProfile;
  };
  const registerAction = (actionName, actionElement, comment) => {
    const date = /* @__PURE__ */ new Date();
    const timestamp = date.getTime();
    const action = {
      name: actionName,
      element: actionElement,
      comment,
      profile,
      timestamp
    };
    const currentActions = localStorage.getItem(ACTIONS_KEY) || "";
    const separator = currentActions ? "," : "";
    localStorage.setItem(ACTIONS_KEY, currentActions + separator + JSON.stringify(action));
  };
  const dataStore = {};
  let updateComponentsCallback = (dataSourceName) => {
    console.warn("updateComponentsCallback not registered", dataSourceName);
  };
  const setUpdateComponentsCallback = (cb) => {
    updateComponentsCallback = cb;
  };
  const registerData = (dataItemName, value) => {
    let _data = value;
    if (typeof value === "object" && value !== null) {
      _data = new Proxy(value, {
        set: (target, property, value2) => {
          target[property] = value2;
          updateComponentsCallback(dataItemName);
          return true;
        },
        deleteProperty: (target, property) => {
          delete target[property];
          updateComponentsCallback(dataItemName);
          return true;
        }
      });
    }
    Object.defineProperty(dataStore, dataItemName, {
      get: function() {
        return _data;
      },
      set: function(newValue) {
        if (typeof newValue === "object" && newValue !== null) {
          _data = new Proxy(newValue, {
            set: (target, property, value2) => {
              target[property] = value2;
              updateComponentsCallback(dataItemName);
              return true;
            },
            deleteProperty: (target, property) => {
              delete target[property];
              updateComponentsCallback(dataItemName);
              return true;
            }
          });
        } else {
          _data = newValue;
        }
        updateComponentsCallback(dataItemName);
      },
      configurable: true
    });
  };
  const addData = (dataItemName, newData) => {
    if (!Array.isArray(dataStore[dataItemName])) {
      dataStore[dataItemName];
    }
    const currentData = dataStore[dataItemName];
    currentData.push(newData);
  };
  const findIndexByKey = (dataSourceName, keyName, keyValue) => {
    if (!dataStore[dataSourceName]) {
      throw new Error(`Data source '${dataSourceName}' not found in dataStore`);
    }
    const index = dataStore[dataSourceName].findIndex((dataItem) => {
      return dataItem[keyName] === keyValue;
    });
    return index;
  };
  const updateData = (dataItemName, position, newData) => {
    const currentData = dataStore[dataItemName];
    let targetIndex = position - 1 < 0 ? 0 : position - 1;
    currentData[targetIndex] = newData;
  };
  const removeData = (dataSourceName, position) => {
    const currentData = dataStore[dataSourceName];
    let targetIndex = position - 1 < 0 ? 0 : position - 1;
    currentData.splice(targetIndex, 1);
  };
  const components = {};
  const registerComponent = (componentName, template) => {
    components[componentName] = template;
  };
  const buildComponent = (componentName, datasourceName) => {
    let output = [];
    const dataSource = dataStore[datasourceName];
    if (!components[componentName]) {
      console.warn(`Component ${componentName} not found`);
      return "";
    }
    const dataSourceType = typeof dataSource;
    if (dataSource === void 0 || dataSource === null) {
      return "";
    }
    const safeData = sanitize(dataSource);
    switch (dataSourceType) {
      case "object":
        if (Array.isArray(safeData)) {
          output = safeData.map((item) => {
            return components[componentName](item);
          });
        } else {
          output.push(components[componentName](safeData));
        }
        break;
      case "string":
        output.push(components[componentName](safeData));
        break;
      default:
        throw new Error(`Unsupported data type: ${dataSourceType}`);
    }
    return Array.isArray(output) ? output.join("") : output;
  };
  const buildComponents = (componentNames, datasourceNames) => {
    let output = [];
    componentNames.forEach((componentName, index) => {
      const dataSource = dataStore[datasourceNames[index]];
      if (!components[componentName]) return;
      const dataSourceType = typeof dataSource;
      const safeData = sanitize(dataSource);
      switch (dataSourceType) {
        case "object":
          if (Array.isArray(safeData)) {
            output = output.concat(
              safeData.map((item) => components[componentName](item))
            );
          } else {
            output.push(components[componentName](safeData));
          }
          break;
        case "string":
          output.push(components[componentName](safeData));
          break;
        default:
          throw new Error(`Unsupported data type: ${dataSourceType}`);
      }
    });
    return Array.isArray(output) ? output.join("") : output;
  };
  let appLocation = window.location.pathname;
  let views = [];
  let routeParams = {};
  let renderViewComponents$1 = () => Promise.resolve();
  let initCallback = () => {
  };
  const setRenderViewComponentsCallback = (cb) => {
    renderViewComponents$1 = cb;
  };
  const setInitCallback = (cb) => {
    initCallback = cb;
  };
  const getRouteParams = () => routeParams;
  const getViews = (data) => {
    views = JSON.parse(data)["views"];
  };
  const registerViews = () => {
    return wijax(
      "GET",
      "views/views.json",
      "application/json; charset=UTF-8",
      getViews
    );
  };
  const fillView = (index, targetElementId) => {
    const htmlFilePath = "views/" + views[index]["viewFile"];
    return new Promise((resolve, reject) => {
      fetch(htmlFilePath + "?").then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          reject(`Failed to load HTML view: ${htmlFilePath}`);
        }
      }).then((htmlContent) => {
        const targetElement = getElement(targetElementId);
        if (targetElement) {
          targetElement.innerHTML = htmlContent;
          resolve();
        } else {
          reject(`Target element with ID "${targetElementId}" not found`);
        }
      }).catch(reject);
    });
  };
  const getTemplate = (target) => {
    return new Promise((resolve, reject) => {
      let index;
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
        const routePattern = views[i]["url"];
        if (routePattern.includes(":")) {
          const regexPattern = routePattern.replace(/:([^\s/]+)/g, "([^\\s/]+)");
          const matcher = new RegExp("^" + regexPattern + "$");
          const match = url.match(matcher);
          if (match) {
            index = i;
            routeParams = {};
            const paramNames = (routePattern.match(/:([^\s/]+)/g) || []).map((s) => s.slice(1));
            paramNames.forEach((name, idx) => {
              routeParams[name] = match[idx + 1];
            });
            break;
          }
        }
      }
      if (index === void 0) {
        console.warn(`No view found for the URL: ${url}. Redirecting to default view.`);
        index = 0;
      }
      fillView(index, target).then(() => resolve()).catch((error) => {
        console.error(`Error filling view for URL ${url}: ${error}`);
        reject(`Failed to fill view for ${url}`);
      });
    }).catch((error) => {
      console.error(`Error in getTemplate: ${error}`);
    });
  };
  const navigateTo = (url) => {
    history.pushState(null, null, url);
    appLocation = url;
    getTemplate("contentBody").then(() => {
      renderViewComponents$1();
    });
  };
  const bindRouter = () => {
    window.onpopstate = (event) => {
      appLocation = window.location.pathname;
      initCallback();
    };
  };
  const renderViewComponents = () => {
    return new Promise((resolve, reject) => {
      const contentBody = getElement("contentBody");
      if (!contentBody) {
        resolve();
        return;
      }
      const viewComponents = contentBody.querySelectorAll("[datasource]");
      [].forEach.call(viewComponents, (component) => {
        component.innerHTML = buildComponent(
          component.tagName.toLowerCase(),
          component.getAttribute("datasource")
        );
      });
      registerAction("Switched View", "CBody", "NA");
      resolve();
    });
  };
  const updateComponentsByDataSourceName = (dataSourceName) => {
    const contentBody = getElement("contentBody");
    if (!contentBody) return;
    contentBody.querySelectorAll('[datasource="' + dataSourceName + '"]').forEach((elem) => {
      elem.innerHTML = buildComponent(
        elem.tagName.toLowerCase(),
        dataSourceName
      );
      registerAction("Updated Data.", elem.tagName.toLowerCase(), "No Comment.");
    });
  };
  setRenderViewComponentsCallback(renderViewComponents);
  setUpdateComponentsCallback(updateComponentsByDataSourceName);
  const loadObserver = {};
  const onLoad = (value) => {
    Object.defineProperty(loadObserver, "trigger", {
      get: function() {
        return this["_trigger"];
      },
      set: function(newValue) {
        this["_trigger"] = newValue;
        if (typeof window[newValue] === "function") {
          window[newValue]();
        }
      }
    });
    loadObserver["trigger"] = value;
  };
  const onContentLoad = (functionName) => {
    if (typeof window[functionName] === "function") {
      return window[functionName]();
    }
  };
  const renderAll = (config) => {
    return new Promise((resolve, reject) => {
      let componentsFiles = ["components.js"];
      if (config?.components && Array.isArray(config.components) && config.components.length > 0) {
        componentsFiles = config.components;
      }
      loadScriptsFromFolder("components", componentsFiles).then(() => {
        registerViews().then(() => {
          getTemplate("contentBody").then(() => {
            renderViewComponents().then(() => {
              bindRouter();
              if (typeof config.callbackName !== "undefined") {
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
  setInitCallback(() => init());
  const eventHandlers = {};
  const registerEventHandler = (eventName, handler) => {
    eventHandlers[eventName] = handler;
  };
  if (typeof document !== "undefined") {
    document.addEventListener("click", (e) => {
      let target = e.target;
      while (target && target !== document) {
        if (target.hasAttribute && target.hasAttribute("wu-click")) {
          const handlerName = target.getAttribute("wu-click");
          const data = target.getAttribute("wu-data");
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
    wx: getElement,
    wijax,
    jsonize,
    loadScript,
    registerComponent,
    buildComponent,
    buildComponents,
    components,
    registerProfile,
    registerAction,
    registerEventHandler,
    navigateTo,
    getRouteParams,
    registerData,
    addData,
    findIndexByKey,
    updateData,
    removeData,
    dataStore,
    onLoad,
    init
  };
  if (typeof window !== "undefined") {
    window.wu = Wirup;
  }
  return Wirup;
})();
