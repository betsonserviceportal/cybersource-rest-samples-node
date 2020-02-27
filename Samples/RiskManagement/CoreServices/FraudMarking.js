'use strict';

var cybersourceRestApi = require('cybersource-rest-client');
var path = require('path');
var filePath = path.resolve('Data/Configuration.js');
var configuration = require(filePath);

function markAsSuspect(callback, id) {
	try {
		var configObject = new configuration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.FraudMarkingActionRequest();

		var riskInformation = new cybersourceRestApi.Riskv1decisionsidmarkingRiskInformation();
		var riskInformationMarkingDetails = new cybersourceRestApi.Riskv1decisionsidmarkingRiskInformationMarkingDetails();
		riskInformationMarkingDetails.notes = 'Adding this transaction as suspect';
		riskInformationMarkingDetails.reason = 'suspected';

		var fieldsIncluded = new Array();
		fieldsIncluded.push("customer_email");
		fieldsIncluded.push("customer_phone");
		riskInformationMarkingDetails.fieldsIncluded = fieldsIncluded;

		riskInformationMarkingDetails.action = 'add';
		riskInformation.markingDetails = riskInformationMarkingDetails;

		requestObj.riskInformation = riskInformation;


		var instance = new cybersourceRestApi.DecisionManagerApi(configObject, apiClient);

		instance.fraudUpdate( id, requestObj, function (error, data, response) {
			if(error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Fraud Marking : ' + JSON.stringify(response['status']));
			callback(error, data, response);
		});
	}
	catch (error) {
		console.log('\nException on calling the API : ' + error);
	}
}
if (require.main === module) {	
		var id = "5825489395116729903003";
		markAsSuspect(function () {
		console.log('\nFraudUpdate end.');
	},id);
}
module.exports.markAsSuspect = markAsSuspect;
