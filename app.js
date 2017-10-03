var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var hbs = require('express-handlebars');
var flash=require('connect-flash');
var Handlebars=require('handlebars');
var nodemailer=require('nodemailer');
var request = require('request');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var webhook= require('./routes/webhook');

var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;


//Set up default mongoose connection
//var mongoDB = 'mongodb://thanh:thanh@ds047305.mlab.com:47305/projectse';
var mongoDB = 'mongodb://thamtushinichi:Nhox_mikon789@ds141434.mlab.com:41434/cowbuffalodb';
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layoutadmin' });*/
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: false });
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});
Handlebars.registerHelper('selected', function(foo, bar) {
    return foo == bar ? ' selected' : '';
});
Handlebars.registerHelper('iff', function(a, operator, b, opts) {
    var bool = false;
    switch(operator) {
        case '==':
            bool = a == b;
            break;
        case '>':
            bool = a > b;
            break;
        case '<':
            bool = a < b;
            break;
        default:
            throw "Unknown operator " + operator;
    }

    if (bool) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
app.use(require('express-session')({
    secret: 'shop',
    resave: false,
    saveUninitialized: false
}));


//passport
var bcrypt=require('bcrypt-nodejs');
app.use(passport.initialize());
app.use(passport.session());
var Account=require('./model/users');
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
passport.serializeUser( function( account, cb ) {
    cb( null, account.id );
});
passport.deserializeUser(function( id, cb ){
    Account.findById(id,function (err, account) {
        cb(err,account);
    });
});

//process for signup
passport.use('signup',new LocalStrategy({
    usernameField:'name',
    passwordField:'create_password',
    passReqToCallback:true
},function (req, email,password,cb) {

    Account.findOne({'username':email}, function (err,account){
        if(err){
            return  cb(err);
        }
        if(account){
            return cb(null,false,req.flash('message','Tên người dùng đã được sử dụng'));
        }


        var newAccount=new Account();
        newAccount.username=email;
        newAccount.password=bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
        newAccount.email=req.body.youremail;
        newAccount.name=req.body.yourname;
        newAccount.role_id=0;
        newAccount.save(function (err,result) {
            if(err){
                return cb(err);
            }

            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'phattrienungdungweb17@gmail.com', // Your email id
                    pass: 'ptudw2017' // Your password
                }
            });

            var text ='Xin chào '+ newAccount.name+',\n\n'+'Bạn vưa đăng kí tài khoản cho ứng dụng web store, vui lòng click vào liên kết bên đưới để xác nhận\n\n' +
                'http://'+req.headers.host+"/confirm/"+newAccount._id;

            var mailOptions = {
                from: 'phattrienungdungweb14@gmail.com', // sender address
                to: newAccount.email, // list of receivers
                subject: 'Xác nhận đăng kí tài khoản', // Subject line
                text: text //, // plaintext body
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    res.json({yo: 'error'});
                }else{
                    console.log('Message sent: ' + info.response);
                    res.json({yo: info.response});
                };
            });

            return cb(null,newAccount,req.flash('message','Đăng kí thành công, vui lòng mở hộp thư xác nhận'));
        });
    });
}));


//process for login
passport.use('login',new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
},function (req, email,password,cb) {
    Account.findOne({'username':email}, function (err,account){
        if(err||account==null){
            return  cb(null,false,req.flash('message','Tên người dùng không tồn tại'));
        }
        if(account){
            if(bcrypt.compareSync(password,account.password)) {
                if(account.role_id==0){
                    cb(null,false,req.flash('message','Tài khoản này chưa được kích hoạt, vui lòng kiểm tra mail'))
                    return;
                }
                return cb(null, account);
            }else {
                return  cb(null,false,req.flash('message','Tên người dùng hoặc mật khẩu sai'));
            }
        }
    });
}));




app.use('/', index);
app.use('/webhook',webhook);
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

app.get('/setup', function(req, res) {
    setupGetStartedButton(res);
    setupPersistentMenu(res);
    setupGreetingText(res);
});

app.get('/deletesetup', function(req, res) {
    sendDeleteSetupRequest(res);
});

app.get('/whitelist', function(req, res) {
    createWhitelist(res);
});
app.use(function (req, res, next) {
    if (req.isAuthenticated() && req.user.role_id!=0) {
        next();
        return;
    }
    res.render('home',{show: 'show',notice:req.flash('message')[0]});
});

app.use('/users', users);



app.use(function (req, res, next) {
    console.log(req.user);
    if (req.isAuthenticated()) {
        if(req.user.role_id==1) {
            next();
            return;
        }
    }

    res.render('home',{show: 'show'});
});


app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
