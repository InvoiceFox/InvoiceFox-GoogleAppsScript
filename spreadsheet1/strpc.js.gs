
function setToken() {
    ScriptProperties.setProperty('InvoiceFox-APITOKEN', 
                                 Browser.inputBox("What is your API token?"));  
}

function getToken() {
  var apitoken = ScriptProperties.getProperty('InvoiceFox-APITOKEN');
  if (!apitoken) {
    apitoken = Browser.inputBox("What is your API token?");
    ScriptProperties.setProperty('InvoiceFox-APITOKEN', apitoken);
  }
  return apitoken;
}

function callSTRPC(protocol, token, url, resource, method, data, format) {
  format = format | "json";
  Logger.log(data);
  var options =
  {
    "method" : "post",
    "payload" : data,
    "headers" : {
      "Authorization": "Basic "+ Utilities.base64Encode(token+":x")
    }
  };
  var requrl = protocol+"://"+url+"?_r="+resource+"&_m="+method;
  var response = UrlFetchApp.fetch(requrl, options);
  return response.getContentText();
}

function callAPI(resource, method, data) {
  var res = callSTRPC("https", getToken(), "www.cebelca.biz/API", resource, method, data);
  res = res.replace(/&#47;/g, "/");
  Logger.log(res);
  return res;
}

