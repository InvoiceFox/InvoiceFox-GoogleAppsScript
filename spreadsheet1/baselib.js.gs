
function loadTemplateToSpreadsheet(spec) {
  var data = [];
  var headers = [];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for(var i=0; i < spec.length; ++i) {
    headers.push(spec[i]['c']);
    if (spec[i]['w']) {
      ss.getActiveSheet().setColumnWidth(i+1, spec[i]['w']);
    }
  }
  data.push(headers);
  showInSheet(data, headers);
}

function loadDataToSpreadsheet(res, method, args, spec) { 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var clients = Utilities.jsonParse(callAPI(res, method, args))[0];
  if (clients.length > 0) {
    var data = [];
    var headers = [];
    for(var i=0; i < spec.length; ++i) {
      headers.push(spec[i]['c']);
      if (spec[i]['w']) {
        ss.getActiveSheet().setColumnWidth(i+1, spec[i]['w']);
      }
    }
    data.push(headers);
    for(var i=0; i < clients.length; ++i) {
      data.push(collectKeys(clients[i], spec));
    }
    showInSheet(data, headers);
  } else {
    Browser.msgBox("No data")
  }
}

function showInSheet(data, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getActiveSheet().getRange(1, 1, 1, data[0].length).setBackgroundColor("silver");
  var destinationRange = ss.getActiveSheet().getRange(1, 1, data.length, data[0].length);
  destinationRange.setValues(data);
}

function collectKeys(row, spec) {
  var arr = [];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var i=0; i<spec.length; i++) {
    arr.push(row[spec[i]['c']]);
  }
  return arr;
}

// BASIC LIB

function keys(o) {
  var arr = [];
  for (propertyName in o) {
    arr.push(propertyName);
  }
  return arr;
}

//get values instead of keys
function values (o) {
  var arr = [];
  for (var propertyName in o) {
    arr.push(o[propertyName]);
  }
  return arr;
}

function dateToYMD(date)
{
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();
    return '' + y +'-'+ (m<=9?'0'+m:m) +'-'+ (d<=9?'0'+d:d);
}

function dateToDMY(date)
{
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();
    return '' + (d<=9?'0'+d:d) + '.' + (m<=9?'0'+m:m) +'.'+ y;
}


