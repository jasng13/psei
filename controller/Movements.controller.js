sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"PSEI/utils/Formatter",
	"sap/ui/model/Filter"

], function(Controller, Formatter, Filter) {
	"use strict";

	return Controller.extend("PSEI.controller.Movements", {
		formatter: Formatter,

		onInit: function() {
			this.standardList = this.byId('stdList');
			// this.pullToRefreshStd = this.byId('pullToRefreshStd');
			// this.addItems(this.standardList, 5);
			this.fnUpdateList();
		},

		getLastUpdated: function() {
			return "updated " + new Date().toLocaleTimeString();
		},

		addItems: function(list, nItems) {
			var n = list.getItems().length + 1;
			for (var i = 0; i < nItems; i++) {
				list.insertItem(
					new sap.m.StandardListItem({
						title: "List item " + (n + i)

					}), 0 // insert new items at the top of the list
				);
			}
		},
		fnUpdateList: function() {
			var that = this;
			var sUrl = "http://www.pse.com.ph/stockMarket/dailySummary.html";

			// var sUrl = "http://phisix-api.appspot.com/stocks.json";
			var oModel = new sap.ui.model.json.JSONModel();
			// $.ajax({

			// 	url: "/html5apps/mywfapp/SCI/",

			// 		method: "GET",

			// 	contentType: "application/scim+json",

			// 	async: false

			// });
			
			  $.ajax({
                        url: sUrl,
                        type: "GET",
                        // async: false,
                        data:'method=getDeclinesSecurity',

                        success: function(data, textStatus, XMLHttpRequest) {
                            console.log(XMLHttpRequest);
                            console.log(data);
                           

                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest);
                            console.log(errorThrown);
                            //                             that.fnDisplayAjaxMessage(XMLHttpRequest); 
                         
                        },
                        timeout: 12000 //timeout to 12sec
                    });
			// $.get(sUrl)
			// 	.done(function(results) {
			// 		console.log(results);

			// 		var aData = [];

			// 		for (var i = 0; i < results.stock.length; i++) {
			// 			aData.push(results.stock[i]);
			// 		}
			// 		oModel.setSizeLimit(results.stock.length);
			// 		oModel.setData(aData);

			// 		that.getView().setModel(oModel, "stocks");
			// 		that.fnFilterStockOnly();
			// 		that.fnFilterCSIOnly();
			// 		that.getView().byId("tickerTitle").setText("Last Update : " + moment(results.as_of).format('MMMM Do YYYY, h:mm:ss a'));
			// 	})
			// 	.fail(function(err) {
			// 		console.log(err);
			// 	});
		},

		refresh: function() {
			var that = this;
			setTimeout(function() {
				// that.pullToRefreshStd.hide();
				that.fnUpdateList();
			}, 1000);
			//toast message
			sap.m.MessageToast.show("Updated " + new Date().toLocaleTimeString());
		},

		fnFilterStockOnly: function() {
			var that = this;
			var oTable = that.getView().byId("tblStocks");
			var oBinding = oTable.getBinding("items");

			//filter csi stock by symbol
			var oFilter;

			oFilter = new Filter({
				filters: [
					new Filter("symbol", "NE", "PSE"),
					new Filter("symbol", "NE", "PRO"),
					new Filter("symbol", "NE", "HDG"),
					new Filter("symbol", "NE", "ALL"),
					new Filter("symbol", "NE", "FIN"),
					new Filter("symbol", "NE", "IND"),
					new Filter("symbol", "NE", "SVC"),
					new Filter("symbol", "NE", "M-O")

				],
				and: true
			});

			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);

		},

		fnFilterCSIOnly: function() {
			var that = this;
			var oTable = that.getView().byId("tblCSI");
			var oBinding = oTable.getBinding("items");

			//filter csi stock by symbol
			var oFilter;

			oFilter = new Filter({
				filters: [
					new Filter("name", "EQ", "PSEi"),
					new Filter("symbol", "EQ", "PRO"),
					new Filter("symbol", "EQ", "HDG"),
					new Filter("symbol", "EQ", "ALL"),
					new Filter("symbol", "EQ", "FIN"),
					new Filter("symbol", "EQ", "IND"),
					new Filter("symbol", "EQ", "SVC"),
					new Filter("symbol", "EQ", "M-O")

				],
				and: false
			});

			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		}

	});
});