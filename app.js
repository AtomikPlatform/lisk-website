var express = require('express'),
    exphbs  = require('express-handlebars'),
    config  = require('./config.json'),
    routes  = require('./routes'),
    bter    = require('./bter.js'),
    request = require('request'),
    bodyParser = require('body-parser');

var price_usd = null,
    price_btc = null,
    marketcap = null;
    volume = null;
    price = null;
    rewardTime = null;


setInterval(function() {
    request({
    	type: "GET",
    	url: "http://coinmarketcap-nexuist.rhcloud.com/api/lsk",
    	json: true
    }, function (err, resp, body) {
      if (err || !body.market_cap) {
        return console.error("Can't get market cap from coinmarketcap.com: " + err.toString());
  	}
      	price = body.price.usd.toString().substring(0,5); // Cut to 3 numbers after comma
      	volume = body.volume.usd.toString().substring(0,6).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commata for better readability
    	marketcap = body.market_cap.usd.toString().substring(0,8).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commata for better readability
    }
  )
}, 5000);

setInterval(function() {
    request({
    	type: "GET",
    	url: "http://explorer.lisk.io/api/getBlockStatus",
    	json: true
    }, function (err, resp, body) {
      if (err || !body.height) {
        return console.error("Can't get block height from the Lisk Explorer: " + err.toString());
  	}
      var currentHeight = body.height;
      var rewardActivation = 1451520;
      var blocksLeft = rewardActivation - currentHeight;
      if (blocksLeft <= 0) { blocksLeft = 0; }
      //var averageTimeSec = blocksLeft * 10;

      //var numDays = Math.floor(averageTimeSec / 86400);
      //var numHours = Math.floor((averageTimeSec % 86400) / 3600);
      //var numMinutes = Math.floor(((averageTimeSec % 86400) % 3600) / 60);
      //var numSeconds = ((averageTimeSec % 86400) % 3600) % 60;

      switch(blocksLeft) {
        case 0:
          rewardTime = "It's here! Setup your Node now!";
          break;
        case 1:
          rewardTime = "Only " + blocksLeft  + " Block left. Prepare your Node!";
          break;
        default:
          blocksLeft = blocksLeft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          rewardTime = "Only " + blocksLeft  + " Blocks left. Prepare your Node!";
      }

    }
  )
}, 5000);



function getBtcUsd() {
	bter.getPrice(function (err, result) {
		if (!err) {
			price_usd = result.toFixed(4);;
		} else {
			console.error(err);

			if (!price_usd) {
				price_usd = "?";
			}
		}

		setTimeout(getBtcUsd, 1000 * 60 * 5);
	});
}

function getBtc() {
	bter.getLISKBTC(function (err, result) {
		if (!err) {
			price_btc = result;
		} else {
			console.log(err);

			if (!price_btc) {
				price_btc = "?";
			}
		}

		setTimeout(getBtc, 1000 * 60 * 5);
	})
}

getBtcUsd();
getBtc();

var app = express();
var hbs = exphbs.create({
	defaultLayout : 'main',
	helpers : {
    rewardTime : function () {
			return rewardTime;
		},
    marketcap : function () {
			return marketcap;
		},
    volume : function () {
			return volume;
		},
    price : function () {
			return price;
		},
		price_usd : function () { return price_usd; },
		price_btc : function () { return price_btc; },
		year : function () { return new Date().getFullYear(); },
		macos_lite: function () {
			return "";
		},
		windows_lite: function () {
			return "";
		},
		chinese_windows: function () {
			return "";
		},
		chinese_macos: function () {
			return "";
		},
    binaries : function () {
			return "https://lisk.io/documentation?i=lisk-docs/BinaryInstall";
		},
		nano_macos : function () {
			return "https://downloads.lisk.io/lisk-nano/0.1.2/lisk-nano-0.1.2.dmg";
		},
		nano_windows : function () {
			return "https://downloads.lisk.io/lisk-nano/0.1.2/lisk-nano-0.1.2.exe";
		},
		nano_linux : function () {
			return "https://downloads.lisk.io/lisk-nano/0.1.2/lisk-nano-0.1.2.deb";
		},
		docker : function () {
			return "https://lisk.io/documentation?i=lisk-docs/DockerInstall";
		},
		armv6 : function () {
			return "https://lisk.io/documentation?i=lisk-docs/BinaryInstall";
		},
		armv7 : function () {
			return "https://lisk.io/documentation?i=lisk-docs/BinaryInstall";
		},
		version : function () {
			return "v0.5.1";
		},
		blog : function () {
			return "http://blog.lisk.io";
		},
		liskcli : function () {
			return "https://www.npmjs.com/package/lisk-cli";
		},
		lisksdk : function () {
			return "https://github.com/LiskHQ/lisk-sdk";
		},
		sourcecode : function () {
			return "https://github.com/LiskHQ/lisk";
		},
		liskchat_windows: function () {
			return "http://downloads.lisk.chat/rocketchat.exe";
		},
		liskchat_macos: function () {
			return "http://downloads.lisk.chat/rocketchat.dmg";
		},
		liskchat_linux: function () {
			return "http://downloads.lisk.chat/rocketchat_amd64.deb";
		},
		documentation: function () {
			return "/documentation?i=lisk-docs/README";
		},
		dappstore: function () {
			return "https://store.lisk.io/";
		},
		login: function () {
			return "https://login.lisk.io/";
		},
		mediakit: function() {
			return "https://drive.google.com/file/d/0B6RSR8wsq2e1aFM3N1dqLWRYdXM/view?usp=sharing";
		},
		whitepaper: function() {
			return "/whitepaper";
		}
	}
});

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

for (var page in routes) {
	routes[page](app);
}

app.use(function(req, res, next) {
	res.status(404).redirect("/missing");
});


	app.listen(config.port, function (err) {
		if (err) {
			console.error(err);
		} else {
			console.log("Server started at: " + config.port);
		}
	});
