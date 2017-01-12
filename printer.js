/**
		EIT Printer Monitor
		Designed by Winfield Greene 2/17/2015
		Javascript and redesign by Aaron Mercier 9/25/2016

**/

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
	}

};

var reams = 0.0;

var loadPrinterData = function() {
	reams = 0.0;
	clearAll();
	$.each(printerList, function(index, printer) {
		$.ajax({
			url: '/getPrinterInfo',
			data: {"printer": printer},
			success: function(result, status, xhr){
				//console.log(result);
				if (printer.type === "M806"){
					// I like these printers, everything has an id...
					setStatus(printer.hostName, $(result).find('#MachineStatus').text());
					setTrayLevel(printer.hostName, $(result).find('#TrayBinStatus_2').text(), $(result).find('#TrayBinSize_2').text(), 2);
					setTrayLevel(printer.hostName, $(result).find('#TrayBinStatus_3').text(), $(result).find('#TrayBinSize_3').text(), 3)
					setInkLevel(printer.hostName, $(result).find('#SupplyPLR0').text().replace("*", ""));
					setKitLevel(printer.hostName, $(result).find('#SupplyPLR1').text().replace("*", ""));
				}
				else if (printer.type === "9040"){
					// -__- why no id attributes HP!
					setStatus(printer.hostName, $(result).find('#deviceStatusPage').children()[0].childNodes[2].textContent);
					setTrayLevel(printer.hostName, $(result).find('#deviceStatusPage').children()[2].childNodes[2].childNodes[1].childNodes[4].childNodes[3].childNodes[2].textContent,
						$(result).find('#deviceStatusPage').children()[2].childNodes[2].childNodes[1].childNodes[4].childNodes[5].childNodes[1].textContent, 2);
					setTrayLevel(printer.hostName, $(result).find('#deviceStatusPage').children()[2].childNodes[2].childNodes[1].childNodes[6].childNodes[3].childNodes[2].textContent,
						$(result).find('#deviceStatusPage').children()[2].childNodes[2].childNodes[1].childNodes[6].childNodes[5].childNodes[1].textContent, 3);
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
};

var setStatus = function(hostName, status){
	if (status.startsWith("Load Tray 1") || status.startsWith("Processing")
		|| status.startsWith("Ready") || status.startsWith("ORDER CARTRIDGE")){
		status = "Working";
	}
	$('#' + hostName + '-status').text("Status - " + toTitleCase(status));
};

var setTrayLevel = function(hostName, trayLevel, paperType, trayNumber) {
	$('#' +hostName + '-tray' + trayNumber + '-type').text(toTitleCase(paperType));
	var imgLevel = -1;
	if (trayLevel.includes('40 - 100%')){
		$('#' + hostName + '-tray' + trayNumber).text('40 - 100%');
		imgLevel = 4;
		reams += 0.0;
	}
	else if (trayLevel.includes('20 - 40%')){
		$('#' + hostName + '-tray' + trayNumber).text('20 - 40%');
		imgLevel = 3;
		reams += 0.6;
	}
	else if (trayLevel.includes('10 - 20%')){
		$('#' + hostName + '-tray' + trayNumber).text('10 - 20%');
		imgLevel = 2;
		reams += 0.8;
	}
	else if (trayLevel.includes('< 10%') || trayLevel.includes('1 - 10%')){
		$('#' + hostName + '-tray' + trayNumber).text('1 - 10%');
		imgLevel = 1;
		reams += 0.9;
	}
	else if (trayLevel.includes('Empty')){
		$('#' + hostName + '-tray' + trayNumber).text('0%');
		imgLevel = 0;
		reams += 1.0;
	}
	else {
		$('#' + hostName + '-tray' + trayNumber).text('Unknown');
		reams += 0.0;
		$('#' + hostName + '-tray' + trayNumber + '-img').attr("src","images/level0.gif");
	}

	$('#reams').text(" " + reams.toFixed(1));

	if (imgLevel != -1){
		$('#' + hostName + '-tray' + trayNumber + '-img').attr("src","images/level" + imgLevel + ".gif");
	}

};

var setInkLevel = function(hostName, level){
	if (level == -1){
		$('#' + hostName + '-inkbar').width(0);
		$('#' + hostName + '-ink').text("Unknown");
	}
	else {
		$('#' + hostName + '-inkbar').width(level);
		$('#' + hostName + '-ink').text(level);
	}

};

var setKitLevel = function(hostName, level){
	if (level == -1){
		$('#' + hostName + '-kitbar').width(0);
		$('#' + hostName + '-kit').text("Unknown");
	}
	else {
		$('#' + hostName + '-kitbar').width(level);
		$('#' + hostName + '-kit').text(level);
	}
};

var toTitleCase = function(str){
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var clearAll = function(){
	$.each(printerList, function(index, printer) {
		setInkLevel(printer.hostName, -1);
		setKitLevel(printer.hostName, -1);
		setTrayLevel(printer.hostName, "-1", "Unknown", 2);
		setTrayLevel(printer.hostName, "-1", "Unknown", 3);
	});
};


loadPrinterData();

//reload data every 5 minutes
setInterval(loadPrinterData, 300000);



