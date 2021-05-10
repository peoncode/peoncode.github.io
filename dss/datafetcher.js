/**
 * @description Wrapper function to send requests
 * @param {string} type Either "homeData" for fetching home.json, or "refData".
 * @param {string} typeId Required when type is "refData"
 * @param {function} callback Function to call after request
 * @param {object} callbackArgs Any additional args to be passed to the callback
 */
function fetchJsonData(type, typeId, callback, callbackArgs) {
  let url = "";
  switch(type) {
    case "homeData":
      url = `https://cd-static.bamgrid.com/dp-117731241344/home.json`;
      break;
    case "refData":
      url = `https://cd-static.bamgrid.com/dp-117731241344/sets/${typeId}.json`;
      break;
    default:
      url = "";
  }
  
  if (url) {
    __xhrRequest(url, callback, callbackArgs);
  }
}
/**
 * @description Simple xhrRequest handler
 * @param {string} url
 * @param {function} callback
 * @param {object} callbackArgs
 * @return {*} 
 */
function __xhrRequest(url, callback, callbackArgs) {
  const httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    console.error("Giving up :( Cannot create an XMLHTTP instance");
    return false;
  }

  httpRequest.responseType = "json";
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        callback && callback.call(this, httpRequest.response, callbackArgs);
      } else {
        console.error("There was a problem with the request.");
      }
    }
  };
  httpRequest.open("GET", url, true);
  httpRequest.send();
}
