var version_text = "Checkpoint 1.9: move spreadsheet id, deployment id to another file"

var top_level_inline_keyboard = {
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

var second_level_inline_keyboard = {
  inline_keyboard: [
    [
      {
        text: "google1",
        callback_data: "clicked google1",
      },
      {
        text: "google2",
        callback_data: "clicked google2",
      }
    ]
  ]
};

// Steps to update webhook:
//   1. Deploy project
//   2. Copy web app url and paste here
//   3. Save & run `setWebhook`
function setWebhook() {
  Logger.log(server_url);
  var result = tgmsgv3({ "url": server_url });
  Logger.log(result);
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
  var ss = SpreadsheetApp.openById(spreadsheet_id);  // In nn Out Data
  var sheet = ss.getSheetByName(datasheet_name);
  return sheet;
}

function write_to_last_row(data) {
  let sheet = get_sheet();
  sheet.appendRow(data);
}

function test(e) {
  let sheet = get_sheet();
  sheet.clear();
  var range = sheet.getRange("A1");
  range.setValue(e);
  for (var i in e.message.entities) {
    sheet.appendRow([e.message.entities[i]]);
  }
}

// e is the telegram Update object.
function identifier(update) {
  if (update?.message?.text) {
    if (update.message.text == '/test') {
      var mensaje = {
        "method": "sendMessage",
        "chat_id": String(update.message.chat.id),
        "text": version_text,
        "reply_markup": JSON.stringify(top_level_inline_keyboard),
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
  } else if (update?.callback_query) {
    // write_to_last_row(["callback"]);
    if (update.callback_query.data == "clicked google") {
      // write_to_last_row(["clicked google"]);

      var mensaje = {
        "method": "editMessageReplyMarkup",
        "chat_id": String(update.callback_query.from.id),
        "message_id": String(update.callback_query.message.message_id),
        "text": version_text,
        "reply_markup": JSON.stringify(second_level_inline_keyboard),
      }
    }
  }

  // write_to_last_row(["sent", mensaje]);
  return mensaje
}

// This script is published as a web app. 
// doPost(e) will be triggered upon receiving a POST request.
function doPost(e) {
  write_to_last_row(["doPost"]);

  var tg_update = JSON.parse(e.postData.contents);
  var payload = identifier(tg_update);
  var data = {
    "method": "post",
    "payload": payload
  }

  UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
}
