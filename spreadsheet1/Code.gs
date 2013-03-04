
//// BASIC EVENTS

function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [];
  // When the user selects "addMenuExample" menu, and clicks "Menu Entry 1", the function function1 is executed.
  menuEntries.push({name: "Load Clients", functionName: "loadClients"});
  menuEntries.push({name: "Clients template", functionName: "buildClientsTemplate"});
  menuEntries.push({name: "Create Clients", functionName: "createClientsFromSheet"});
  menuEntries.push(null);
  menuEntries.push({name: "Load Services", functionName: "loadServices"});
  menuEntries.push({name: "Services template", functionName: "buildServicesTemplate"});
  menuEntries.push({name: "Create Services", functionName: "createServicesFromSheet"});
  menuEntries.push(null);
  menuEntries.push({name: "Load Invoices", functionName: "loadInvoices"});
  menuEntries.push({name: "Invoices template", functionName: "buildInvoiceTemplate"});
  menuEntries.push({name: "Create Invoices", functionName: "createInvoicesFromSheet"});
  menuEntries.push(null);
  menuEntries.push({name: "Set API Token", functionName: "setToken"});
  ss.addMenu("InvoiceFox", menuEntries);
}


//// CLIENT FUNCTIONS

var SPECS = {
  'client': 
  [{c: "id", w: 30}, {c: "name"}, {c: "street", w: 140}, 
   {c: "street2", w: 90},
   {c: "phone", w: 90}, {c: "vatbound", w: 30}, //"custaddr",
   {c: "postal", w: 50}, {c: "website"}, {c: "vatid"}, 
   {c: "country", w: 70}, {c: "city"}, {c: "email"}, 
   {c: "notes"}, {c: "payment_period", w: 30} ],
  'item': 
  [{c: "id", w: 30}, {c: "object_title", w: 240}, {c: "price"}, {c: "measure_unit"}, {c: "vat"} ],
  'invoices': 
  [{c: "invid", w: 30}, {c: "docnum", w: 80}, {c: "date_sent", w: 80}, {c: "payment", w: 80}, 
   {c: "date_served", w: 80}, {c: "tag", w: 80}, {c: "amount", w: 80}, {c: "vat_amount", w: 80}, 
   {c: "payed_amount", w: 80}, {c: "contact_name", w: 180}, 
   {c: "contact_street", w: 180}, {c: "contact_city"}, {c: "contact_postal", w: 80}, 
   {c: "contact_taxnum", w: 80}],
  'invoices-min-tpl': 
  [{c: "company_name", w: 130}, {c: "vatnum", w: 80}, {c: "date_sent", w: 80},
   {c: "date_to_pay", w: 80}, {c: "item_description", w: 320}, {c: "qty", w: 50},
   {c: "price", w: 50} ]
};

// SERVICE CLIENTS

function loadClients() {
  loadDataToSpreadsheet("partner", "select-all", {}, SPECS['client']);
}

function buildClientsTemplate() {
  loadTemplateToSpreadsheet(SPECS['client']);
}

// SERVICE FUNCTIONS

function loadServices() {
  loadDataToSpreadsheet("invoice-sent-o", "select-all", {}, SPECS['item']);
}

function buildServicesTemplate() {
  loadTemplateToSpreadsheet(SPECS['item']);
}

//// INVOICE FUNCTIONS

function loadInvoices() {
  loadDataToSpreadsheet("invoice-sent", "export-verbose", {}, SPECS['invoices']);
}

function buildInvoiceTemplate() {
  loadTemplateToSpreadsheet(SPECS['invoices-min-tpl']);
}

function createInvoicesFromSheet() {
  var sheetIdx = 1;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[sheetIdx];
  var range = ss.getRangeByName("sampleRange");
  //Logger.log(range)
  var data = range.getValues(); //getRowsData(sheet, range);
  //Logger.log(data)
  for (var i=0; i<data.length; ++i) {
    Logger.log("IN LOOP 2")
    var d = data[i];
    var d2 = new Date(d[2]);
    Logger.log(dateToYMD(d2));
    
    createInvoice(dateToDMY(new Date(d[2])), dateToDMY(new Date(d[3])), ""+d[1], d[4], d[5], d[6], d[7], d[8]);
  }
}

function createInvoice(date, duedate, taxnum, descr, qty, price, tax, discount) { 
  var resp = callAPI("invoice-sent", "insert-smart", 
                 {title: "ZRZRZR123", date_sent: date, date_to_pay: duedate, date_served: date,
                  taxnum: taxnum});
  Logger.log(resp);
  var resp2 = Utilities.jsonParse(resp);
  callAPI("invoice-sent-b", "insert-into-more", 
          {title: descr, price: price, qty: qty, vat: tax, discount: discount, id_invoice_sent: resp2[0][0]['id']});
}

