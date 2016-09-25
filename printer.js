//137.112.31.45 moench
//http://137.112.31.4 o257

var printerList = {
	"moench-commons": {
		hostName: "moench-commons",
		type: "M806"
	},
	"D116": {
		hostName: "D116",
		type: "9040"
	},
	"bl113-ps": {
		hostName: "bl113-ps",
		type: "9040"
	},
	"o157-ps": {
		hostName: "o157-ps",
		type: "9040"
	},
	"o257-ps": {
		hostName: "o257-ps",
		type: "M806"
	},
	"o200c-ps": {
		hostName: "o200c-ps",
		type: "9040"
	},
	"m246-ps": {
		hostName: "m246-ps",
		type: "9040"
	},
	"crapo2": {
		hostName: "crapo2",
		type: "9040"
	},
	"crapo3": {
		hostName: "crapo3",
		type: "9040"
	},

};
	

$.each(printerList, function(index, printer) {
	$.ajax({
		url: '/getPrinterInfo',
		data: {"printer": printer},
		success: function(result, status, xhr){
			//console.log(result);
			if (printer.type === "M806"){
				setStatus(printer.hostName, $(result).find('#MachineStatus').text());
				setTrayLevel(printer.hostName, $(result).find('#TrayBinStatus_2').text(), 2);
				setTrayLevel(printer.hostName, $(result).find('#TrayBinStatus_3').text(), 3)
			}
			else if (printer.type === "9040"){
				setStatus(printer.hostName, "working on it");
			}
			else {
				setStatus(printer.hostName, "Printer unsupported");
			}

		},
		error: function(xhr, status, error){
			console.log(error);
		}
	});
});

var setStatus = function(hostName, status){
		if (status.startsWith("Load Tray 1") || status.startsWith("Processing") 
			|| status.startsWith("Ready")){
			status = "Working";
		}
		$('#' + hostName + '-status').text("Status - " + status);
};

var setTrayLevel = function(hostName, trayLevel, trayNumber) {
	$('#' + hostName + '-tray' + trayNumber).text(trayLevel);
	var imgLevel = 4;
	if (trayLevel.includes('40 - 100%')){
		imgLevel = 4;
	}
	else if (trayLevel.includes('20 - 40%')){
		imgLevel = 3
	}
	else if (trayLevel.includes('< 10%')){
		imgLevel = 1
	}
	$('#' + hostName + '-tray' + trayNumber + '-img').attr("src","images/level" + imgLevel + ".gif");
}