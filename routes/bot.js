var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();

const PAGE_ACCESS_TOKEN = "EAAbtwggVDPABAIwHgZBNjCZC7ku76xHkp0Wmzaf0cZB2muz8ZCtDprqXBhWuOWvV2utXKxfe559qFTwHq9BaCPxCTvjMbeJEuZAMOZATmaAPsJIrVxPDkZCFPVvZB7VE0CS4sZC4lF2rTDyk2g5saegW1vmZBheERH2Gbko54m9VEkoSf462YpbhcF";

//var jsonParser = bodyParser.json();
// router.set("view engine", "ejs");
// router.set("views", "./views");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));


// router.get("/", function(req, res) {
//     res.send('home');
// });

// router.get("/policy", function(req, res) {
//     res.render('policy');
// });

router.get('/', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === "day_la_ma_xac_minh_cua_toi") {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

router.post('/', function(req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    receivedMessage(event);
                } else if (event.postback) {
                    //Kiểm tra khi user click vào 1 trong các sự kiện postback
                    if (event.postback.payload === 'getstarted') {
                        //present user with some greeting or call to action
                        var msg = "Hi ,I'm a Bot ,and I was created to help you easily .... "
                        sendTextMessage(event.sender.id, msg);
                    } else if (event.postback.payload === 'HELP_PAYLOAD') {
                        var msg = "Key word:\n1. hello\n2. generic"
                        sendTextMessage(event.sender.id, msg);
                    } else if (event.postback.payload === 'CONTACT_INFO_PAYLOAD') {
                        var msg = "Phone number: 19001789\nEmail: test1234@gmail.com"
                        sendTextMessage(event.sender.id, msg);
                    } else if (event.postback.payload === 'TAGS_PAYLOAD') {
                        var msg = "Tags: smartphone, laptop, pc, tablet, cellphone, other"
                        sendTextMessage(event.sender.id, msg);
                    } else if (event.postback.payload === 'VIEW_MORE_PAYLOAD') {
                        sendListMessage(event.sender.id);
                    }
                }

            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
    }
});

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'generic':
                //Hiển thị theo template là generic
                sendGenericMessage(senderID);
                break;
            case 'hello':
                var resText = "Đây là Bot";
                sendTextMessage(senderID, resText);
                break;
            case 'smartphone':
                //Hiển thị theo template là List
                sendListMessage(senderID);
                break;
            case 'laptop':
                var resText = "Chưa code :)";
                sendTextMessage(senderID, resText);
                break;
            case 'pc':
                var resText = "Chưa code :)";
                sendTextMessage(senderID, resText);
                break;
            case 'tablet':
                var resText = "Chưa code :)";
                sendTextMessage(senderID, resText);
                break;
            case 'cellphone':
                var resText = "Chưa code :)";
                sendTextMessage(senderID, resText);
                break;
            case 'other':
                var resText = "Chưa code :)";
                sendTextMessage(senderID, resText);
                break;
            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "rift",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble",
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for second bubble",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

//template List
function sendListMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "list",
                    top_element_style: "compact",
                    elements: [{
                            title: "Iphone 7",
                            subtitle: "See all our colors",
                            image_url: "https://webstoreapp.herokuapp.com/images/product/1497872939167_iphone7-plus-jetblack-select-2016.jpg",
                            buttons: [{
                                title: "View",
                                type: "web_url",
                                url: "https://webstoreapp.herokuapp.com/",
                                messenger_extensions: true,
                                webview_height_ratio: "tall",
                                fallback_url: "https://webstoreapp.herokuapp.com/"
                            }]
                        },
                        {
                            title: "Samsung Galaxy S8 Plus",
                            subtitle: "See all our colors",
                            image_url: "https://webstoreapp.herokuapp.com/images/product/1498792631393_samsung-galaxy-s8-plus.png",
                            buttons: [{
                                title: "View",
                                type: "web_url",
                                url: "https://webstoreapp.herokuapp.com/",
                                messenger_extensions: true,
                                webview_height_ratio: "tall",
                                fallback_url: "https://webstoreapp.herokuapp.com/"
                            }]
                        },
                        {
                            title: "Samsung Galaxy A9 Pro",
                            subtitle: "See all our colors",
                            image_url: "https://webstoreapp.herokuapp.com/images/product/1498794350673_samsung-galaxy-a9.png",
                            buttons: [{
                                title: "View",
                                type: "web_url",
                                url: "https://webstoreapp.herokuapp.com/",
                                messenger_extensions: true,
                                webview_height_ratio: "tall",
                                fallback_url: "https://webstoreapp.herokuapp.com/"
                            }]
                        },
                    ],
                    buttons: [{
                        title: "View More",
                        type: "postback",
                        payload: "VIEW_MORE_PAYLOAD"
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

//Hàm gửi
function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s with message: %s",
                messageId, recipientId, messageData.message.text);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}

//***Note: Các hàm dưới chỉ cần gọi MỘT LẦN trên trình duyệt, nếu thêm/sửa chức năng thì gọi delete rồi gọi setup lại

//Tạo nút Bắt đầu: khi lần đầu vào page và inbox page thì sẽ xuất hiện nút này
function setupGetStartedButton(res) {
    var messageData = {
        "get_started": {
            "payload": "getstarted"
        }
    };
    // Start the request
    sendSetupRequest(messageData, res);
}

//Dòng chữ chào mừng: Xuất hiện khi lần đầu inbox page
function setupGreetingText(res) {
    var messageData = {
        "greeting": [{
            "locale": "default",
            "text": "Chào mừng đến với trang Facebook của chúng tui !"
        }, {
            "locale": "en_US",
            "text": "Greeting text for en_US local !"
        }]
    };

    sendSetupRequest(messageData, res);

}

//Menu: Gồm các nút, để bắt sự kiện thì gọi .postback.payload
function setupPersistentMenu(res) {
    var messageData = {
        "persistent_menu": [{
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [{
                        "title": "Info",
                        "type": "nested",
                        "call_to_actions": [{
                                "title": "Help",
                                "type": "postback",
                                "payload": "HELP_PAYLOAD"
                            },
                            {
                                "title": "Contact Me",
                                "type": "postback",
                                "payload": "CONTACT_INFO_PAYLOAD"
                            },
                            {
                                "title": "Searching tags",
                                "type": "postback",
                                "payload": "TAGS_PAYLOAD"
                            }
                        ]
                    },
                    {
                        "type": "web_url",
                        "title": "Visit website ",
                        "url": "https://webstoreapp.herokuapp.com",
                        "webview_height_ratio": "full"
                    }
                ]
            },
            {
                "locale": "zh_CN",
                "composer_input_disabled": false
            }
        ]
    };
    // Start the request
    sendSetupRequest(messageData, res);

}

// Hàm để gửi các setup trên
function sendSetupRequest(messageData, res) {
    request({
            url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + PAGE_ACCESS_TOKEN,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            form: messageData
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else {
                // TODO: Handle errors
                res.send(body);
            }
        });
}

//Hàm để xóa các setup
function sendDeleteSetupRequest(res) {
    var messageData = {
        "fields": [
            "greeting",
            "get_started",
            "persistent_menu"
        ]
    };
    request({
            url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + PAGE_ACCESS_TOKEN,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            form: messageData
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else {
                // TODO: Handle errors
                res.send(body);
            }
        });
}

//Hàm đăng ký domain cho Messenger extension. Khi sử dụng template List bên trên thì FB sẽ yêu cầu
//danh sách các domain sẽ dùng. Vd: khi user click View 1 item trong list thì thay vì mở URL của item
//đó trong website của ta = tab mới thì fb sẽ hiện 1 mini tab ngay trong tab fb hiện tại
function createWhitelist(res) {
    var messageData = {
        setting_type: "domain_whitelisting",
        whitelisted_domains: ["https://webstoreapp.herokuapp.com/"],
        domain_action_type: "add"
    };
    request({
            url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + PAGE_ACCESS_TOKEN,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            form: messageData
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else {
                // TODO: Handle errors
                res.send(body);
            }
        });
}

router.get('/setup', function(req, res) {
    setupGetStartedButton(res);
    setupPersistentMenu(res);
    setupGreetingText(res);
});

router.get('/deletesetup', function(req, res) {
    sendDeleteSetupRequest(res);
});

router.get('/whitelist', function(req, res) {
    createWhitelist(res);
});

//Khi truy cập url trên nếu kết quả trả về là result: successfully là setup thành công

module.exports = router;