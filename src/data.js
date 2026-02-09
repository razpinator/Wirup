// The central data store
export const dataStore = {};

// We need a way to notify components when data changes. 
// The original implementation used `_updateComponentsByDataSourceName` which was likely defined in the main scope 
// and called by `_registerData`'s setter.
// To avoid circular dependency, we can use a callback registry or event emitter.
// For now, let's allow registering an "updater" function.

let updateComponentsCallback = (dataSourceName) => {
    console.warn("updateComponentsCallback not registered", dataSourceName);
};

export const setUpdateComponentsCallback = (cb) => {
    updateComponentsCallback = cb;
};

export const registerData = (dataItemName, value) => {
  Object.defineProperty(dataStore, dataItemName, {
    get: function () {
      return this["_" + dataItemName];
    },
    set: function (newValue) {
      this["_" + dataItemName] = newValue;
      updateComponentsCallback(dataItemName);
    },
    configurable: true // Good for testing
  });
  dataStore[dataItemName] = value;
};

export const addData = (dataItemName, newData) => {
  if (!Array.isArray(dataStore[dataItemName])) {
      // If it wasn't an array, we might have issues assuming it is.
      // But preserving original behavior:
      let temp = dataStore[dataItemName];
      if (temp === undefined) temp = [];
      if (!Array.isArray(temp)) temp = [temp]; 
      // Actually original code:
      // let _tempArray = []; _tempArray = _dataStore[dataItemName]; _tempArray.push(newData);
      // If _dataStore[dataItemName] is not array, push will fail. 
      // Assuming it is array.
  }
  
  // To trigger the setter, we must re-assign the property on dataStore
  // But wait, the original code did:
  // _tempArray = _dataStore[dataItemName];
  // _tempArray.push(newData);
  // _dataStore[dataItemName] = _tempArray;
  
  // If `_dataStore[dataItemName]` returns the backing `_` prop, modifying it in place 
  // and then reassigning it to the setter works. 
  
  const currentData = dataStore[dataItemName];
  currentData.push(newData);
  dataStore[dataItemName] = currentData; // Triggers setter
};

export const findIndexByKey = (dataSourceName, keyName, keyValue) => {
  if (!dataStore[dataSourceName]) {
    throw new Error(`Data source '${dataSourceName}' not found in dataStore`);
  }
  const index = dataStore[dataSourceName].findIndex((dataItem) => {
    return dataItem[keyName] === keyValue;
  });
  return index;
};

export const updateData = (dataItemName, position, newData) => {
  const currentData = dataStore[dataItemName];
  // Original logic: position = position - 1 < 0 ? 0 : position - 1;
  // This implies 1-based indexing passed in? 
  // "position" usually implies index, but maybe user uses 1-based.
  let targetIndex = position - 1 < 0 ? 0 : position - 1;
  
  currentData[targetIndex] = newData;
  dataStore[dataItemName] = currentData; // Triggers setter
};

export const removeData = (dataSourceName, position) => {
  const currentData = dataStore[dataSourceName];
  let targetIndex = position - 1 < 0 ? 0 : position - 1;
  currentData.splice(targetIndex, 1);
  dataStore[dataSourceName] = currentData; // Triggers setter
};
