//137.112.31.45 moench
//http://137.112.31.4 o257

console.log('Hello World!');
$.ajax({
	url: '/getPrinterInfo',
	success: function(result, status, xhr){
		console.log("hooray!");
		console.log(result);
	},
	error: function(xhr, status, error){
		console.log(error);
	}
})