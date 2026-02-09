import { dataStore } from './data.js';
import { sanitize } from './utils.js';

export const components = {};

export const registerComponent = (componentName, template) => {
  components[componentName] = template;
};

export const buildComponent = (componentName, datasourceName) => {
  let output = [];
  const dataSource = dataStore[datasourceName];
  
  // If component doesn't exist, we might crash or return empty. Original code assumes it exists.
  if(!components[componentName]) {
      console.warn(`Component ${componentName} not found`);
      return "";
  }
  
  const dataSourceType = typeof dataSource;

  if (dataSource === undefined || dataSource === null) {
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
        // Original code threw error.
       throw new Error(`Unsupported data type: ${dataSourceType}`);
  }

  return Array.isArray(output) ? output.join("") : output;
};

export const buildComponents = (componentNames, datasourceNames) => {
  let output = [];

  componentNames.forEach((componentName, index) => {
    const dataSource = dataStore[datasourceNames[index]];
    
     if(!components[componentName]) return;

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
