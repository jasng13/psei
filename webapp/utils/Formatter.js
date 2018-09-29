sap.ui.define([
	"sap/m/MessageToast"

], function(MessageToast) {
	"use strict";
	return {

		fnPriceState: function(iPrice) {
			var fValue = parseFloat(iPrice);
			if (fValue > 0) {
				return "Success";
			} else if (fValue === 0) {
				return "None";
			} else {
				return "Error";
			}
		},
		fnToFixed: function(fValue){
			if (fValue >= 1) {
				return fValue.toFixed(2);
			}else {
				return fValue;
			}
		}
	};
});