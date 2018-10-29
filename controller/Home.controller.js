sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"PSEI/utils/Formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/model/Filter"
], function(Controller, Formatter, JSONModel, UIComponent, History, MessageToast, Filter) {
	"use strict";

	var _aValidTabKeys = ["Ticker", "Portfolio","Movements"];

	return Controller.extend("PSEI.controller.Home", {

		formatter: Formatter,

		onInit: function() {
			// Used for switch tab selection
			this.getView().setModel(new JSONModel(), "page");

			// // open user profile
			// this.getView().byId("userProfile").attachBrowserEvent("click", jQuery.proxy(this, "onPopOver"));

			this.getRouter().getRoute("home").attachMatched(this.onRouteMatched, this);

			// this.fnSubsribeEvent();
			this.standardList = this.byId('stdList');
			// this.pullToRefreshStd = this.byId('pullToRefreshStd');
			// this.addItems(this.standardList, 5);
			this.fnUpdateList();
		},

		getRouter: function() {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * When the URL matches this page. Called before the child controller route matched is
		 * executed.
		 * @param  {Object} oEvent Event source
		 */
		onRouteMatched: function(oEvent) {
			var that = this;
			var sName = oEvent.getParameter("name");
			// this.getRouter().navTo("ticker");
			if (sName !== "home") {
				return;
			}

		},

		/**
		 * Triggered by changing header tabs on
		 * @param  {Object} oEvent Event source
		 */
		onHandleSwitchTab: function(oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();
			MessageToast.show(sKey);

			var navCon = this.getView().byId("navCon");
			var target = oEvent.getParameter("key");
			if (target) {

				navCon.to(this.getView().byId(target));
			} else {
				navCon.back();
			}
		},

		fnUpdateList: function() {
			var that = this;
			// var sUrl = "/psei/stocks.json";

			// var sUrl = "http://phisix-api.appspot.com/stocks.json"; //3rd party api
			var sUrl = "https://www.pse.com.ph/stockMarket/dailySummary.html?method=getDeclinesSecurity" //pse main page
			var oModel = new sap.ui.model.json.JSONModel();
			$.get(sUrl)
				.done(function(results) {
					console.log(results);

					var aData = [];

					for (var i = 0; i < results.stock.length; i++) {
						aData.push(results.stock[i]);
					}
					oModel.setSizeLimit(results.stock.length);
					oModel.setData(aData);

					that.getView().setModel(oModel, "stocks");
					that.fnFilterStockOnly();
					that.fnFilterCSIOnly();
					that.getView().byId("tickerTitle").setText("Last Update : " + moment(results.as_of).format('MMMM Do YYYY, h:mm:ss a'));
				})
				.fail(function(err) {
					console.log(err);
				});
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