var deployment_id = "AKfycby5xV-rhLVoww7csniY_OyojFH1-wEvC30jTkiAU6jX95DnS7L04gu81flwoCzW7l3L"
var server_url = "https://script.google.com/macros/s/" + deployment_id + "/exec"

// Steps to update webhook:
//   1. Deploy project
//   2. Copy web app url and paste here
//   3. Save & run `setWebhook`
function setWebhook() {
  var result = tgmsgv3({ "url": server_url })
  Logger.log(result)
}

// Helper method to set webhook.
function tgmsgv3(data) {
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data)
  };
  var responselk = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/' + 'setWebhook', options);
  return JSON.parse(responselk.getContentText());
}

function test(e) {
  var ss = SpreadsheetApp.openById("1rjePekaWarx5lojXcl8pYwWxKblrEYvhXj7Y6If_zSs");  // In n Out Data
  var sheet = ss.getSheetByName("Data");
  sheet.clear();
  var range = sheet.getRange("A1");
  range.setValue(e);
  for (var i in e.message.entities) {
    sheet.appendRow([e.message.entities[i]]);
  }
}

// e is the telegram Update object.
function identifier(e) {
  if (e.message.text) {
    if (e.message.text == '/test') {
      // Try make a keyboard
      var keyboard = {
        keyboard: [["DBS", "PChome"], ["iPass"]],
        one_time_keyboard: true,  // hide the keyboard right after used
      };

      var mensaje = {
        "method": "sendMessage",
        "chat_id": String(e.message.chat.id),
        "text": "Checkpoint 1.2: reply keyboard working",
        "reply_markup": JSON.stringify(keyboard),
      }
    } else {
      var mensaje = {
        "method": "sendMessage",
        "chat_id": String(e.message.chat.id),
        "text": e.message.text,
      }
    }
    test(e);
  } else if (e.message.sticker) {
    var mensaje = {
      "method": "sendSticker",
      "chat_id": String(e.message.chat.id),
      "sticker": e.message.sticker.file_id
    }
  } else if (e.message.photo) {
    var array = e.message.photo;
    var text = array[1];
    var mensaje = {
      "method": "sendPhoto",
      "chat_id": String(e.message.chat.id),
      "photo": text.file_id
    }
  } else {
    var mensaje = {
      "method": "sendMessage",
      "chat_id": String(e.message.chat.id),
      "text": "Try other stuff"
    }
  }
  console.log(String(e.message.chat.id))
  return mensaje
}

// This script is published as a web app. 
// doPost(e) will be triggered upon receiving a POST request.
function doPost(e) {
  var tg_update = JSON.parse(e.postData.contents);
  var payload = identifier(tg_update);
  var data = {
    "method": "post",
    "payload": payload
  }
  UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
}


