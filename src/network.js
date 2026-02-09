export const wijax = (callType, url, contentType, callback) => {
  return new Promise((resolve, reject) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open(callType, url, true);
    httpRequest.setRequestHeader("Content-Type", contentType);
    httpRequest.setRequestHeader("cache-control", "no-cache");
    httpRequest.setRequestHeader("expires", "0");
    httpRequest.setRequestHeader("expires", "Tue, 01 Jan 1980 1:00:00 GMT");
    httpRequest.setRequestHeader("pragma", "no-cache");
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState !== 4) {
        return;
      }
      if (httpRequest.status === 200) {
        if (callback) {
          resolve(callback(httpRequest.responseText));
        } else {
          resolve(httpRequest.responseText);
        }
      } else {
        const error =
          httpRequest.statusText || "Your ajax request threw an error.";
        reject(error);
      }
    };
    httpRequest.send();
  });
};
