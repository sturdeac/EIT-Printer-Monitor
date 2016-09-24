//137.112.31.45 moench
//http://137.112.31.4 o257

console.log('Hello World!');
$.ajax({
	url: '/getPrinterInfo',
	success: function(result, status, xhr){
		console.log("hooray!");
		console.log(result);
		let statusText = $(result).find('#MachineStatus').text();
		if (statusText.startsWith("Load Tray 1") || statusText.startsWith("Processing") 
			|| statusText.startsWith("Ready")){
			statusText = "Working";
		}
		$('#commons-status').text("Status - " + statusText);
	},
	error: function(xhr, status, error){
		console.log(error);
	}
})