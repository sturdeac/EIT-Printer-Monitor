/**
		EIT Printer Monitor
		Designed by Winfield Greene 2/17/2015
		Javascript and redesign by Aaron Mercier 9/25/2016

**/

var reams = 0;

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
				// I like these printers, everything has an id...
				setStatus(printer.hostName, $(result).find('#MachineStatus').text());
				setTrayLevel(printer.hostName, $(result).find('#TrayBinStatus_2').text(), 2);
				setTrayLevel(printer.hostName, $(result).find('#TrayBinStatus_3').text(), 3)
				setInkLevel(printer.hostName, $(result).find('#SupplyPLR0').text().replace("*", ""));
				setKitLevel(printer.hostName, $(result).find('#SupplyPLR1').text().replace("*", ""));
			}
			else if (printer.type === "9040"){
				// -__- why no id attributes HP!
				setStatus(printer.hostName, $(result).find('#deviceStatusPage').children()[0].childNodes[2].textContent);
				setTrayLevel(printer.hostName, $(result).find('#deviceStatusPage').children()[2].childNodes[2].childNodes[1].childNodes[4].childNodes[3].childNodes[2].textContent, 2);
				setTrayLevel(printer.hostName, $(result).find('#deviceStatusPage').children()[2].childNodes[2].childNodes[1].childNodes[6].childNodes[3].childNodes[2].textContent, 3);
				setInkLevel(printer.hostName, $(result).find('.hpGasGaugeBorder')[0].childNodes[1].style.width);
				setKitLevel(printer.hostName, $(result).find('.hpGasGaugeBorder')[1].childNodes[1].style.width);
			}
			else {
				// If this shows up, you will have to figure out how to scrape the data from that printer's info page like above
				setStatus(printer.hostName, "Printer not yet supported");
			}

		},
		error: function(xhr, status, error){
			console.log(error);
		}
	});
});

var setStatus = function(hostName, status){
		if (status.startsWith("Load Tray 1") || status.startsWith("Processing") 
			|| status.startsWith("Ready") || status.startsWith("ORDER CARTRIDGE")){
			status = "Working";
		}
		$('#' + hostName + '-status').text("Status - " + status);
};

var setTrayLevel = function(hostName, trayLevel, trayNumber) {
	var imgLevel = -1;
	if (trayLevel.includes('40 - 100%')){
		$('#' + hostName + '-tray' + trayNumber).text('40 - 100%');
		imgLevel = 4;
		reams += 0;
	}
	else if (trayLevel.includes('20 - 40%')){
		$('#' + hostName + '-tray' + trayNumber).text('20 - 40%');
		imgLevel = 3
		reams += 0.4
	}
	else if (trayLevel.includes('< 10%') || trayLevel.includes('1 - 10%')){
		$('#' + hostName + '-tray' + trayNumber).text('1 - 10%');
		imgLevel = 1
		reams += 0.1
	}

	if (imgLevel != -1){
		$('#' + hostName + '-tray' + trayNumber + '-img').attr("src","images/level" + imgLevel + ".gif");
	}

}

var setInkLevel = function(hostName, level){
	$('#' + hostName + '-inkbar').width(level);
	$('#' + hostName + '-ink').text(level);
}

var setKitLevel = function(hostName, level){
	$('#' + hostName + '-kitbar').width(level);
	$('#' + hostName + '-kit').text(level);
}