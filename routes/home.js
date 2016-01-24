/*var partners = [
	{
		name: "Sia - Decentralized Storage",
		site: "http://www.siacoin.com/",
		image: "i/sia.png"
	}
]*/

module.exports = function (app) {
	app.get("/", function (req, res) {
		res.render('index', {pageId: "home", title: "Decentralized Application Platform", description: "Develop and publish decentralized applications with your own side chains on the open-source Lisk Platform.", words: "lisk, crypti, dapp, dapps, decentralized application, dapp store, crypto, currency, cryptocurrency, smart contracts, smart contract, decentralized applications, wallet, blockchain, sia", hasScript: true});
	});
}
