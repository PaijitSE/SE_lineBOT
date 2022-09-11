var ss = SpreadsheetApp.openByUrl("ระบุ Link ของ Google Sheets")
var sheet1 = ss.getSheetByName("AddFriend");
var sheet2 = ss.getSheetByName("ReportIssue");
var sheet3 = ss.getSheetByName("Problem");
var sheet4 = ss.getSheetByName("AssignCheck");
var sheet5 = ss.getSheetByName("Teacher");

function doPost(e) {   
  var data      = JSON.parse(e.postData.contents);
  var userMsg   = data.originalDetectIntentRequest.payload.data.message.text;
  var timeStamp = data.originalDetectIntentRequest.payload.data.timestamp;
  var d         = new Date(parseInt(timeStamp)); //creates a JS date object form milliseconds
  var formattedDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  var formattedTime = ' เวลา '+d.toLocaleTimeString('th-TH');
  var userId    = data.originalDetectIntentRequest.payload.data.source.userId;
  
  //parameter
  var work    = data.queryResult.parameters["work"];
  var prob    = data.queryResult.parameters["prob"];
  var subprob = data.queryResult.parameters["subprob"];
  var place   = data.queryResult.parameters["place"];
  var pw   = data.queryResult.parameters["pw"];
  var userSay = userMsg;
   
  if (userSay==="สวัสดี") {
    var result = {
        "fulfillmentMessages": [
          {
            "platform": "line",
            "type": 4,
            "payload" : {"line": { "quickReply": {
                                             "items": [
                                                      { "type": "action",
                                                        "action": {
                                                              "text": "แจ้งปัญหา",
                                                              "label": "แจ้งปัญหา",
                                                              "type": "message"
                                                         },
                                                         "imageUrl": "https://sv1.picz.in.th/images/2021/07/27/2Tsp3P.jpg"
                                                      },
                                                      { "action": {
                                                               "type": "message",
                                                               "label": "ระบุรหัสผ่าน",
                                                               "text": "รหัสผ่าน คือ qwerty"
                                                      },
                                                       "imageUrl": "https://sv1.picz.in.th/images/2021/07/27/2Tsp3P.jpg",
                                                       "type": "action"
                                                      }
                                                      ]
                                                   },
                                  "text": "ยินดีต้อนรับเข้าสู่ Paijit-Bot กรุณาเลือกการดำเนินการ",
                                  "type": "text"
                                 }
                        }
          }
        ]
      }
      var replyJSON = ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
      return replyJSON;
  }
  
    // 1. แจ้งปัญหา
  if(work==="1"){ 
    if (prob==="1") {
      if (typeof(subprob)!="undefined") {        
        if (typeof(place)==="undefined"){             
             var result = displayPlace();
          
        } else 
        { //end-if place
             //1.Addfriend 
             var addF = addFriend(userId,formattedDate+formattedTime);  
          
             //2.AddTransection and reply
             var result = addTransection(userId,formattedDate,formattedTime,prob,subprob,place);         

        }//end-else place

        var replyJSON = ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
        return replyJSON;         
        
      }//end-if subprob
    }//end-if prob
  } //end-if work='1'
  
  // 2. เข้าสู่ระบบ
  if (work==="2") {      
    if (pw==="qwerty") {

        var result = {
                "fulfillmentMessages": [
                {
                    "platform": "line",
                    "type": 4,
                    "payload" : {
                              "line": {
                                    "type": "flex",
                                    "altText": "Place 's Problem",
                                    "contents": {
                                    "type": "bubble",
                                    "body": {
                                        "layout": "vertical",
                                        "type": "box",
                                        "contents": [
                                                     {
                                                       "type": "image",
                                                       "url": "https://sv1.picz.in.th/images/2022/08/02/XiOa0k.th.png",
                                                       "size": "full",
                                                       "aspectRatio": "16:9",
                                                       "aspectMode": "fit"
                                                     },
                                                     {
                                                       "type": "button",
                                                       "style": "primary",
                                                       "color": "#0859DE",                                          
                                                       "height": "sm",
                                                       "margin": "sm",
                                                       "action": {
                                                                   "type": "uri",
                                                                   "label": "รายงานแต่งตั้งครูเวร",
                                                                   "uri": "http://softendev.lpru.ac.th/~paijit/Paijit-Bot/report1.html"
                                                       }
                                                     },
                                                     {
                                                       "type": "button",
                                                       "style": "primary",
                                                       "color": "#0859DE",                                          
                                                       "height": "sm",
                                                       "margin": "sm",
                                                       "action": {
                                                                   "type": "uri",
                                                                   "label": "รายงานการแจ้งปัญหา",
                                                                   "uri": "https://script.google.com/macros/s/AKfycbyb-pfVxQEoMpF-u74DRd0x8D7dOpGFdkNhXz6n0CKno_Spi38fNzKcHAHjmCChMfHPVg/exec"
                                                       }
                                                     }
                                        ]
                                       }
                                    }
                              }
                        }
                    }
                ]
                }                    
      var replyJSON = ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
      return replyJSON;
    }
    
  }//if work=2 
  
}//doPost

function addFriend(userId,tdate)
{
    let userProfiles = getUserProfiles(userId);   
    let values = sheet1.getRange(2, 1, sheet1.getLastRow(),sheet1.getLastColumn()).getValues(); //ตย. values = ค่าข้อมูล ณ ตำแหน่งเริ่มนับที่ 1 (row,col) [แถวที่ 2, คอลัมน์ที่ 1 จนถึง แถวสุดท้าย, คอลัมน์สุดท้าย
    let flag="0";
  
    //ตรวจสอบความซ้ำซ้อน
    for(let i=0; i<values.length; i++) 
       if(values[i][0] == userId) flag="1"; 
      
    //หากเป็นเพื่อนใหม่
    if (flag=="0"){
       let lastRow = sheet1.getLastRow();
       sheet1.getRange(lastRow + 1, 1).setValue(userId);
       sheet1.getRange(lastRow + 1, 2).setValue(userProfiles[0]);
       sheet1.getRange(lastRow + 1, 3).setValue(tdate);
       sheet1.getRange(lastRow + 1, 4).setValue(userProfiles[1]);
       sheet1.getRange(lastRow + 1, 5).setFormula("=image(D" + (lastRow + 1) + ")");  
    }
    return;
}

function addTransection(userId,tdate,ttime,vprob,vsubprob,vplace)
{
   var userProfiles = getUserProfiles(userId);     
    
   // 1.ตรวจสอบชื่อของปัญหา และปัญหาย่อย Sheet3
   var values3  = sheet3.getRange(2, 1, sheet3.getLastRow(),sheet3.getLastColumn()).getValues(); 
   var tprob  = "ระบุไม่ได้";
   var tsubprob  = "ระบุไม่ได้";
   for(var i=0; i<values3.length; i++) {
     if(values3[i][0] == vprob && values3[i][2] == vsubprob){
          i=i+2;
          tprob    = sheet3.getRange(i,2).getValue();
          tsubprob = sheet3.getRange(i,4).getValue();
     }
   }
  
   // 2.ตรวจสอบครูเวร Sheet4, Sheet5
   const d = new Date();
   var values4  = sheet4.getRange(2, 1, sheet4.getLastRow(),sheet4.getLastColumn()).getValues(); 
   var values5  = sheet5.getRange(2, 1, sheet5.getLastRow(),sheet5.getLastColumn()).getValues(); 
   
   var day      = d.getDay();
   var tid      = "ระบุไม่ได้";
   var tname    = "ระบุไม่ได้";
   var tphone   = "ระบุไม่ได้";
   var tline    = "ระบุไม่ได้";
   var ttoken   = "ระบุไม่ได้";
  
   for(var i=0; i<values4.length; i++) {
     if(values4[i][1] == day){
          i=i+2;
          tid = sheet4.getRange(i,4).getValue();
          for(let ii=0; ii<values5.length; ii++) {
               if(values5[ii][0] == tid){
                  ii=ii+2;
                  tname   = sheet5.getRange(ii,2).getValue();
                  tphone  = sheet5.getRange(ii,3).getValue();
                  tline   = sheet5.getRange(ii,4).getValue();
                  ttoken  = sheet5.getRange(ii,5).getValue();     
               } //if tid       
          } //for ii 
     } //if day 
   }//for i
  
   // 3.บันทึกลงในตารางแจ้งปัญหา
   let lastRow = sheet2.getLastRow();
   sheet2.getRange(lastRow + 1, 1).setValue(userId);
   sheet2.getRange(lastRow + 1, 2).setValue(userProfiles[0]);
   sheet2.getRange(lastRow + 1, 3).setValue(tdate);
   sheet2.getRange(lastRow + 1, 4).setValue(ttime);
   sheet2.getRange(lastRow + 1, 5).setValue(tname);
   sheet2.getRange(lastRow + 1, 6).setValue(tprob);               
   sheet2.getRange(lastRow + 1, 7).setValue(tsubprob);            
   sheet2.getRange(lastRow + 1, 8).setValue(vplace);   
  
   //4.Reply Notification-problem      
   var result = {
                "fulfillmentMessages": [
                   {
                     "platform": "line",
                     "type"    : 4,
                     "payload" : {
                                   "line":  {                                     
                                     "type": "flex",
                                     "altText": "ระบบกำลังส่งแจ้งข้อความแก่ครูเวร......",
                                     "contents":
                                               {
                                                 "type": "bubble",
                                                 "body": {
                                                          "type": "box",
                                                          "layout": "vertical",
                                                          "contents": [
                                                            {
                                                              "type": "text",
                                                              "text": "ระบบกำลังแจ้งไปยัง..",
                                                              "weight": "bold",
                                                              "align": "center",
                                                              "color": "#0000ff"
                                                            },
                                                            {
                                                              "type": "text",
                                                              "text": tname,
                                                              "weight": "bold",
                                                              "size": "xl",
                                                              "align": "center",
                                                              "color": "#ff0000"
                                                            },
                                                            {
                                                              "type": "text",
                                                              "size": "sm",
                                                              "text": "เบอร์โทรศัพท์ :" + tphone
                                                            }, 
                                                            {
                                                              "type": "text",
                                                              "size": "sm",
                                                              "text": "ปัญหา :" +tsubprob+" พบที่ "+vplace
                                                            }, 
                                                            {
                                                              "type": "text",
                                                              "size": "sm",
                                                              "text": "วัน-เวลา :" +tdate+ttime
                                                            }
                                                          ]
                                                 }
                                               }                                
                                     //end                                     
                                   }
                          }
                    }
                 ]
             }         
   
    //5.แจ้งเตือนไปยังเครื่องครูเวร
    if (ttoken!="") {
         sendLineNotify(userProfiles[0],tsubprob,vplace, tdate+ttime, ttoken);
    }  
  
    return result;
}

function displayPlace()
{  var result = {
                "fulfillmentMessages": [
                {
                    "platform": "line",
                    "type": 4,
                    "payload" : {
                              "line": {
                                    "type": "flex",
                                    "altText": "Place 's Problem",
                                    "contents": {
                                    "type": "bubble",
                                    "body": {
                                        "layout": "vertical",
                                        "type": "box",
                                        "contents": [
                                        {
                                            "size": "16px",
                                            "style": "normal",
                                            "weight": "bold",
                                            "align": "center",
                                            "text": "กรุณาระบุสถานที่พบปัญหาครับ",
                                            "type": "text"
                                        },
                                        {
                                            "height": "sm",
                                            "color": "#0859DE",
                                            "margin": "sm",
                                            "type": "button",
                                            "action": {
                                                      "text": "อาคารเรียน 1",
                                                      "type": "message",
                                                      "label": "อาคารเรียน 1"
                                            },
                                            "style": "primary"
                                        },
                                        {
                                            "color": "#0859DE",
                                            "style": "primary",
                                            "margin": "sm",
                                            "type": "button",
                                            "action": {
                                                      "text": "อาคารเรียน 2",
                                                      "type": "message",
                                                      "label": "อาคารเรียน 2"
                                            },
                                            "height": "sm"
                                        },
                                        {
                                            "height": "sm",
                                            "style": "primary",
                                            "type": "button",
                                            "color": "#0859DE",
                                            "action": {
                                            "type": "message",
                                            "text": "อาคารเฉลิมพระเกียรติ 60 พรรษา",
                                            "label": "อาคารเฉลิมพระเกียรติ 60 พรรษา"
                                            },
                                            "margin": "sm"
                                        },
                                        {
                                            "height": "sm",
                                            "type": "button",
                                            "action": {
                                            "type": "message",
                                            "text": "โรงอาหาร",
                                            "label": "โรงอาหาร"
                                            },
                                            "margin": "sm",
                                            "style": "primary",
                                            "color": "#0859DE"
                                        },
                                        {
                                            "height": "sm",
                                            "action": {
                                            "type": "message",
                                            "text": "หน้าโรงเรียน",
                                            "label": "หน้าโรงเรียน"
                                            },
                                            "type": "button",
                                            "margin": "sm",
                                            "style": "primary",
                                            "color": "#0859DE"
                                        },
                                        {
                                            "action": {
                                            "text": "สนามหน้าเสาธง",
                                            "type": "message",
                                            "label": "สนามหน้าเสาธง"
                                            },
                                            "margin": "sm",
                                            "height": "sm",
                                            "type": "button",
                                            "color": "#0859DE",
                                            "style": "primary"
                                        }
                                        ]
                                        }
                                    }
                                    }
                                }
                    }
                ]
                }  
    return result;
}

function getUserProfiles(userId) {
  var url = "https://api.line.me/v2/bot/profile/" + userId;
  var lineHeader = {
    "Content-Type": "application/json",
   "Authorization": "Bearer ระบุค่า Autherization-code of line developers" 
  };
  
  var options = {
    "method" : "GET",
    "headers" : lineHeader
  };
  
  var responseJson = UrlFetchApp.fetch(url, options);
  var displayName = JSON.parse(responseJson).displayName;
  var pictureUrl = JSON.parse(responseJson).pictureUrl;
  
  return [displayName, pictureUrl];
}

function sendLineNotify(msg1,msg2,msg3, msg4, token){
  var options =
   {
     "method"  : "post",
     "payload" :
     {
       "message" : "พบการแจ้งปัญหาจากคุณ :"+msg1+" พบปัญหาเกี่ยวกับ : "+msg2+" พื้นที่ : "+msg3+" รับแจ้งในวัน-เวลา :"+msg4 +" กรุณาเร่งตรวจสอบ/ขอบคุณครับ",
       "stickerPackageId": "6136",
       "stickerId": "10551398"
     },
     "headers" : {"Authorization" : "Bearer " + token}
   };
   UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
