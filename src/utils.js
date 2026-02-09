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
