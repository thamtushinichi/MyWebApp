var express = require('express');
var router = express.Router();
var request = require('request');
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
                } else {
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

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'generic':
                sendGenericMessage(senderID);
                break;

            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    } else if (event.postback) {
        receivedPostback(event);
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
        qs: { access_token: 'EAAbtwggVDPABAIwHgZBNjCZC7ku76xHkp0Wmzaf0cZB2muz8ZCtDprqXBhWuOWvV2utXKxfe559qFTwHq9BaCPxCTvjMbeJEuZAMOZATmaAPsJIrVxPDkZCFPVvZB7VE0CS4sZC4lF2rTDyk2g5saegW1vmZBheERH2Gbko54m9VEkoSf462YpbhcF' },
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

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    sendTextMessage(senderID, "Postback called");
}

function setupGetStartedButton(res) {
    var messageData = {
        "get_started": {
            "payload": "getstarted"
        }
    };
    // Start the request
    sendSetupRequest(messageData, res);
}

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

function sendSetupRequest(messageData, res) {
    request({
            url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + "EAAbtwggVDPABAIwHgZBNjCZC7ku76xHkp0Wmzaf0cZB2muz8ZCtDprqXBhWuOWvV2utXKxfe559qFTwHq9BaCPxCTvjMbeJEuZAMOZATmaAPsJIrVxPDkZCFPVvZB7VE0CS4sZC4lF2rTDyk2g5saegW1vmZBheERH2Gbko54m9VEkoSf462YpbhcF",
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

function sendDeleteSetupRequest(res) {
    var messageData = {
        "fields": [
            "greeting",
            "get_started",
            "persistent_menu"
        ]
    };
    request({
            url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + "EAAbtwggVDPABAIwHgZBNjCZC7ku76xHkp0Wmzaf0cZB2muz8ZCtDprqXBhWuOWvV2utXKxfe559qFTwHq9BaCPxCTvjMbeJEuZAMOZATmaAPsJIrVxPDkZCFPVvZB7VE0CS4sZC4lF2rTDyk2g5saegW1vmZBheERH2Gbko54m9VEkoSf462YpbhcF",
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

function createWhitelist(res) {
    var messageData = {
        setting_type: "domain_whitelisting",
        whitelisted_domains: ["https://cowbuffalo.herokuapp.com/"],
        domain_action_type: "add"
    };
    request({
            url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + "EAAbtwggVDPABAIwHgZBNjCZC7ku76xHkp0Wmzaf0cZB2muz8ZCtDprqXBhWuOWvV2utXKxfe559qFTwHq9BaCPxCTvjMbeJEuZAMOZATmaAPsJIrVxPDkZCFPVvZB7VE0CS4sZC4lF2rTDyk2g5saegW1vmZBheERH2Gbko54m9VEkoSf462YpbhcF",
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
module.exports = router;