var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Rr97vXLziUoHvJAKwdKP0jy_Wmv3zafsQOEXtzU0tvo/edit#gid=0")
var dataSheet1 = ss.getSheetByName('Teacher'); 
var dataSheet2 = ss.getSheetByName('AssignCheck'); 

function doGet(e) {
  //console.log(e.parameter);
  if (!e.parameter.page){
      var htmlOutput =  HtmlService.createTemplateFromFile('report1'); 
      return htmlOutput.evaluate();
  } else {
      var htmlOutput =  HtmlService.createTemplateFromFile('report2');   
      return htmlOutput.evaluate();
  }
}

function getSheetData1()  {   
  var dataRange1 = dataSheet1.getDataRange();
  var dataValues1 = dataRange1.getDisplayValues();  
  return dataValues1;
}

function getSheetData2()  {   
   var dataRange2 = dataSheet2.getDataRange();
   var dataValues2 = dataRange2.getDisplayValues();  
   return dataValues2;
}

function saveAssign(dataA) {       
  var values  = dataSheet2.getRange(2, 1, dataSheet2.getLastRow(),dataSheet2.getLastColumn()).getValues(); 
  for(var i=0; i<values.length; i++) {
    if(values[i][1] == dataA.aday){
      i=i+2;
      dataSheet2.getRange(i, 1).setValue(dataA.aterm);
      dataSheet2.getRange(i, 4).setValue(dataA.atid);
      }
  }
}

function getSheetData3()  { 
  var dataSheet3 = ss.getSheetByName('ReportIssue'); 
  var dataRange3 = dataSheet3.getDataRange();
  var dataValues3 = dataRange3.getDisplayValues();  
  return dataValues3;
}

function getUrl(){
  var url = ScriptApp.getService().getUrl();
  return url;
}
