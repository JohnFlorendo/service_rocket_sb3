define(['./lib/chargebeesubscription', './lib/chargebeeinvoice'],

function(chargebeesubscription, chargebeeinvoice) {
	
	//Chargebee Subscription
	pullLicenses = function(arrLicenses) {
		
        var arrLicenses = getLicenses();

        arrLicenses.forEach(function (license) {
            var id = createLicense(license);
        });
	};

	getLicenses = function() {
		
		return chargebeesubscription.getLicenses();
		
	};

	createLicense = function(license) {
		
		return chargebeesubscription.createLicense(license);
		
	};
	
	updateLicense = function(option) {
		
        //var arrInvoices = getInvoices();
        return chargebeesubscription.updateLicense(option);
	};
	
	//Chargebee Invoice
	pullInvoices = function(arrInvoices) {
		
        //var arrInvoices = getInvoices();

    	arrInvoices.list.forEach(function (invoice) {
            var id = createInvoice(invoice);
        });
	};

	getInvoices = function() {
		
		return chargebeeinvoice.getInvoices();
		
	};

	createInvoice = function(invoice) {
		
		return chargebeeinvoice.createInvoice(invoice);
		
	};
	
	updateInvoice = function(invoice) {
		
		return chargebeeinvoice.updateInvoice(invoice);
		
	};
	
    return {
    	
        getLicenses: getLicenses,
        createLicense: createLicense,
        pullLicenses: pullLicenses,
        updateLicense: updateLicense,
    	getInvoices: getInvoices,
    	createInvoice: createInvoice,
    	updateInvoice: updateInvoice,
        pullInvoices: pullInvoices
    };
    
});
