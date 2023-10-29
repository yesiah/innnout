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

// Top layer, selecting account
var account_keyboard = {
  inline_keyboard: [
    [
      {
        text: "DBS Eco",
        callback_data: "account_dbs_eco",
      },
    ],
    [
      {
        text: "台新GoGo",
        callback_data: "account_gogo",
      },
    ],
    [
      {
        text: "Costco富邦",
        callback_data: "account_costco",
      },
    ],
    [
      {
        text: "中信英雄聯盟卡",
        callback_data: "account_ctbc",
      },
    ],
    [
      {
        text: "花旗titanium",
        callback_data: "account_citi_ti",
      },
    ],
    [
      {
        text: "花旗PChome",
        callback_data: "account_citi_pchome",
      },
    ],
  ]
};