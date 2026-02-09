export const getElement = (elementId) => {
  return document.getElementById(elementId);
};

export const jsonize = (objectName) => {
  try {
    return JSON.parse(window[objectName]);
  } catch (e) {
    return window[objectName];
  }
};

export const loadScript = (scriptPath) => {
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

export const loadScriptsFromFolder = (folderPath, scriptNames) => {
  return new Promise((resolve, reject) => {
    const promises = scriptNames.map((scriptName) => {
      return loadScript(`${folderPath}/${scriptName}`);
    });

    Promise.all(promises)
      .then(resolve)
      .catch((err) => {
        console.error(`Error loading scripts from folder: ${err}`);
        reject(err);
      });
  }).catch((error) => {
    console.error(`Error in loadScriptsFromFolder: ${error}`);
  });
};

export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const sanitize = (data) => {
  if (typeof data === 'string') {
    return escapeHtml(data);
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitize(item));
  }
  if (typeof data === 'object' && data !== null) {
    const safeObj = {};
    Object.keys(data).forEach(key => {
      safeObj[key] = sanitize(data[key]);
    });
    return safeObj;
  }
  return data;
};
