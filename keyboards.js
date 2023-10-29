function get_top_level_inline_keyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: "Google",
          callback_data: "clicked google",
        }
      ],
      [
        {
          text: "Yahoo",
          callback_data: "clicked yahoo",
        },
        {
          text: "Bing",
          callback_data: "clicked bing",
        }
      ]
    ]
  };
}

function get_second_level_inline_keyboard() {
  return {
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
}