var deployment_id = "AKfycbxYSYHkeHTixcbmYDF21g0HOwfiqgpTIw-UaMi9V5V5akxnEVD6jJ3a-yw9zkAZsokS"
var server_url = "https://script.google.com/macros/s/" + deployment_id + "/exec"
var version_text = "Test 1.5.20: test multilevel keyboard with optional chaining"

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

function get_sheet() {
  var ss = SpreadsheetApp.openById("1rjePekaWarx5lojXcl8pYwWxKblrEYvhXj7Y6If_zSs");  // In nn Out Data
  var sheet = ss.getSheetByName("Data");
  return sheet;
}

function write_to_last_row(data) {
  var ss = SpreadsheetApp.openById("1rjePekaWarx5lojXcl8pYwWxKblrEYvhXj7Y6If_zSs");  // In nn Out Data
  var sheet = ss.getSheetByName("Data");
  sheet.appendRow([data]);
}

function test(e) {
  var ss = SpreadsheetApp.openById("1rjePekaWarx5lojXcl8pYwWxKblrEYvhXj7Y6If_zSs");  // In nn Out Data
  var sheet = ss.getSheetByName("Data");
  sheet.clear();
  var range = sheet.getRange("A1");
  range.setValue(e);
  for (var i in e.message.entities) {
    sheet.appendRow([e.message.entities[i]]);
  }
}

// e is the telegram Update object.
function identifier(update) {
  write_to_last_row("iden");
  let sheet = get_sheet();
  sheet.appendRow(["identifier update props"]);
  Object.keys(update).forEach((prop) => sheet.appendRow([prop]));
  sheet.appendRow(["update.callback_query", update.callback_query]);

  // if (update.callback_query) {
  //   sheet.appendRow(["DETECTED!"]);
  // } else if (update.message.text) {
  //   sheet.appendRow(["test detected."]);
  // }

  // if (update.message) {
  //   sheet.appendRow(["message detected."]);
  // } else if (update.callback_query) {
  //   sheet.appendRow(["DETECTED!"]);
  // }

  sheet.appendRow(["check message"]);
  if (update?.message) {
    sheet.appendRow(["message detected."]);
  }
  Object.keys(update).forEach((prop) => sheet.appendRow([prop]));

  sheet.appendRow(["check callback_query"]);
  if (update?.callback_query) {
    sheet.appendRow(["callback detected."]);
  }
  Object.keys(update).forEach((prop) => sheet.appendRow([prop]));

  sheet.appendRow(["check message.text"]);
  if (update?.message?.text) {
    sheet.appendRow(["message.text detected."]);
  }
  Object.keys(update).forEach((prop) => sheet.appendRow([prop]));

  sheet.appendRow(["NO crash after tests"]);

  if (update.message) {
    write_to_last_row("is text");
    if (update.message.text == '/test') {
      write_to_last_row("called /test");
      // Try make a keyboard
      // var reply_keyboard = {
      //   keyboard: [["DBS", "PChome"], ["iPass"]],
      //   one_time_keyboard: true,  // hide the keyboard right after used
      // };

      var inline_keyboard = {
        inline_keyboard: [
          [
            {
              text: 'Google',
              callback_data: "clicked google",
            }
          ],
          [
            {
              text: 'Yahoo',
              callback_data: "clicked yahoo",
            },
            {
              text: 'Bing',
              callback_data: "clicked bing",
            }
          ]
        ]
      };

      var mensaje = {
        "method": "sendMessage",
        "chat_id": String(update.message.chat.id),
        "text": version_text,
        "reply_markup": JSON.stringify(inline_keyboard),
      }
    } else if (update.message.text == '/test1') {
      // placeholder
    } else if (update.message.sticker) {
      var mensaje = {
        "method": "sendSticker",
        "chat_id": String(update.message.chat.id),
        "sticker": update.message.sticker.file_id
      }
    } else if (update.message.photo) {
      var array = update.message.photo;
      var text = array[1];
      var mensaje = {
        "method": "sendPhoto",
        "chat_id": String(update.message.chat.id),
        "photo": text.file_id
      }
    } else {
      var mensaje = {
        "method": "sendMessage",
        "chat_id": String(update.message.chat.id),
        "text": update.message.text,
      }
    }
  }

  if (update.callback_query) {
    write_to_last_row("callback");
    if (update.callback_query.data == "clicked google") {
      write_to_last_row("clicked google");
      var inline_keyboard2 = {
        inline_keyboard: [
          [
            {
              text: "google1",
              callback_data: "clicked google1",
            }
          ],
          [
            {
              text: "google2",
              callback_data: "clicked google2",
            },
            {
              text: "google3",
              callback_data: "clicked google3",
            }
          ]
        ]
      };

      var mensaje = {
        "method": "editMessageText",
        "chat_id": String(update.callback_query.from.id),
        "message_id": String(update.callback_query.message.message_id),
        "text": version_text,
        "reply_markup": JSON.stringify(inline_keyboard2),
      }
    }
  }

  write_to_last_row(mensaje);
  console.log(String(update.message.chat.id));
  return mensaje
}

// This script is published as a web app. 
// doPost(e) will be triggered upon receiving a POST request.
function doPost(e) {
  var sheet = get_sheet();
  sheet.appendRow(["doPost", e.postData.contents]);

  var tg_update = JSON.parse(e.postData.contents);
  sheet.appendRow(["tg_update props"]);
  Object.keys(tg_update).forEach((prop) => sheet.appendRow([prop]));
  sheet.appendRow(["tg_update.callback_query", tg_update.callback_query]);
  var payload = identifier(tg_update);
  var data = {
    "method": "post",
    "payload": payload
  }
  UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
}


