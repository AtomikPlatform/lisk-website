$(function($){

	$("#investBitcoinBtn").on('click', function () {
		$('html, body').animate({
			scrollTop: $("#investBitcoin").offset().top - 70
		}, 2000);

		return false;
	});

	$("#investCryptiBtn").on('click', function () {
		$('html, body').animate({
			scrollTop: $("#investCrypti").offset().top - 70
		}, 2000);

		return false;
	});

	$("#investEthereumBtn").on('click', function () {
		$('html, body').animate({
			scrollTop: $("#InvestEthereum").offset().top - 70
		}, 2000);

		return false;
	});

	$("#investNowBtn").on('click', function () {
		$('html, body').animate({
			scrollTop: $("#investNow").offset().top - 70
		}, 2000);

		return false;
	});

});
