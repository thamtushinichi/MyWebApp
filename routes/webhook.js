var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var categoryModel = require('../model/category');

var PAGE_ACCESS_TOKEN='EAAbtwggVDPABAOItgtDQWl8ZBNZCFu3pSNDYQUwZBaL7yX2xrCiVe7jitRHrZBgRLIR4XBum0ZBdKeefVEdDBZC6ZAYfsRZA450w4bMV6ug43U8uQZCq5vJt1RQ5R7UEvii8swzt6RCgv4ewE8iNrCXZBJCpagLUajJmGwNmvZBxlXUn88lcgyG4j05';
router.get('/',function (req,res,next) {
    console.log("da vao duoc bot api");
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.     '] ==='day_la_ma_xac_minh_cua_toi') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});
router.post('/', function (req, res) {
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
                    receivedPostback(event);
                }
                else {
                    console.log("Webhook received unknown event: ", event);
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
    // Putting a stub for now, we'll expand it in the following steps
    console.log("Message data: ", event.message);
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message._id;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'generic':
                sendGenericMessage(senderID);
                break;
            case 'hello':
                var resText = "Đây là Bot";
                sendTextMessage(senderID, resText);
                break;
            case 'smartphone':
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
function sendGenericMessage(recipientId, messageText) {
    // To be expanded in later sections
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
function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}
function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;
    switch (payload)
    {
        case 'getstarted':
            var msg = "Hi ,I'm a Bot ,and I was created to help you easily .... ";
            sendTextMessage(senderID, msg);
            break;
        case 'HELP_PAYLOAD':
            var msg = "Key word:\n1. hello\n2. generic"
            sendTextMessage(senderID, msg);
            break;
        case 'CONTACT_INFO_PAYLOAD':
            var msg = "Phone number: 0969 538 816\nEmail: nthanhtuanzz@gmail.com"
            sendTextMessage(senderID, msg);
            break;
        case 'TAGS_PAYLOAD':
            var msg = "Tags: ";
            getCategoryList(function(categories){
                categories.forEach(function(category){
                    msg += category.category_name + '\n';
                });
            });
            sendTextMessage(senderID, msg);
            break;
        case 'VIEW_MORE_PAYLOAD':
            sendListMessage(senderID);
            break;
        default:
            sendTextMessage(senderID, "Postback called");
            break;
    }
    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful

}

function getCategoryList(callback){
    categoryModel.find({},function (err, categories){
        if (err){
            console.log("fail to get category list: ",err)
            return;
        }
        callback(categories);
        //res.render('category/listcategory',{items:categories,layout:'layoutadmin'});
    });
}

function getProductList(callback){
    productModel.find({},null,{sort:{'_id': -1}},function (err, products){
        if (err){
            console.log("fail to get product list: ",err)
            return;
        }
        callback(products);
        //res.render('product_Admin/listproduct',{items:products,layout:'layoutadmin'});
    });
}

function setupGetStartedButton_PersistentMenu_GreetingText(res) {
    console.log('start function setup Button');
    var messageData = {
        "get_started": {
            "payload": "getstarted"
        },
        "greeting": [{
            "locale": "default",
            "text": "Chào mừng đến với trang Facebook của chúng tui !"
        }, {
            "locale": "en_US",
            "text": "Greeting text for en_US local !"
        }],
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
                    "url": "https://cowbuffalo.herokuapp.com",
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
    console.log('end function setup Button');
}

function setupGreetingText(res) {
    console.log('start function setupGreetingText');
    var messageData = {
        "greeting": [{
            "locale": "default",
            "text": "Chào mừng đến với trang Facebook của chúng tui !"
        }, {
            "locale": "en_US",
            "text": "Greeting text for en_US local !"
        }]
    };
    console.log("GreetingText");
    sendSetupRequest(messageData, res);
    console.log('end function setupGreetingText');
}

function setupPersistentMenu(res) {
    console.log('start function setupPersistentMenu');
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
                    "url": "https://cowbuffalo.herokuapp.com",
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
    //console.log("Menu");
    // Start the request
    sendSetupRequest(messageData, res);
    console.log('end function setupPersistentMenu');
}

 function sendSetupRequest(messageData, res) {
    console.log('start function sendSetupRequest');
    request({
            //url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + PAGE_ACCESS_TOKEN,
            uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            form: messageData
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log("Successfull khi tao setup request");
                //console.log(response);
                  res.send(body);

            } else {
                // TODO: Handle errors
                console.log("Failed khi tao setup request");
               // console.log(res);
                 res.send(body);
            }
        });
    console.log('end function sendSetupRequest');
}

 function sendDeleteSetupRequest(res) {
    var messageData = {
        "fields": [
            "greeting",
            "get_started",
            "persistent_menu"
        ]
    };
    request({
            //url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + PAGE_ACCESS_TOKEN,
            uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            form: messageData
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log("Successfull khi tao delete setup");

                res.send(body);

            } else {
                console.log("Failed khi delete setup");

                res.send(body);
            }
        });

}

 function createWhitelist(res) {
    var messageData = {
        setting_type: "domain_whitelisting",
        whitelisted_domains: ["https://cowbuffalo.herokuapp.com/"],
        domain_action_type: "add"
    };
     request({
            //url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + PAGE_ACCESS_TOKEN,
            uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            form: messageData
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log("Successfull khi tao whitelist");
                //console.log(res);

                res.send(body);

            } else {
                // TODO: Handle errors
                console.log("Failed khi tao whitelist");
                //console.log(res);
                res.send(body);
            }
        });
}
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
                        image_url: "https://cowbuffalo.herokuapp.com/images/product/1497872939167_iphone7-plus-jetblack-select-2016.jpg",
                        buttons: [{
                            title: "View",
                            type: "web_url",
                            url: "https://cowbuffalo.herokuapp.com/",
                            messenger_extensions: true,
                            webview_height_ratio: "tall",
                            fallback_url: "https://cowbuffalo.herokuapp.com/"
                        }]
                    },
                        {
                            title: "Samsung Galaxy S8 Plus",
                            subtitle: "See all our colors",
                            image_url: "https://cowbuffalo.herokuapp.com/images/product/1498792631393_samsung-galaxy-s8-plus.png",
                            buttons: [{
                                title: "View",
                                type: "web_url",
                                url: "https://cowbuffalo.herokuapp.com/",
                                messenger_extensions: true,
                                webview_height_ratio: "tall",
                                fallback_url: "https://cowbuffalo.herokuapp.com/"
                            }]
                        },
                        {
                            title: "Samsung Galaxy A9 Pro",
                            subtitle: "See all our colors",
                            image_url: "https://cowbuffalo.herokuapp.com/images/product/1498794350673_samsung-galaxy-a9.png",
                            buttons: [{
                                title: "View",
                                type: "web_url",
                                url: "https://cowbuffalo.herokuapp.com/",
                                messenger_extensions: true,
                                webview_height_ratio: "tall",
                                fallback_url: "https://cowbuffalo.herokuapp.com/"
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
router.get('/setup', function(req, res) {
    setupGetStartedButton_PersistentMenu_GreetingText(res);

});


router.get('/deletesetup', function(req, res) {
    sendDeleteSetupRequest(res);
});

router.get('/whitelist', function(req, res) {
    createWhitelist(res);
});
module.exports = router;