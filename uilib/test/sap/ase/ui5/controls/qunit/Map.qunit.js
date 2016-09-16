/*global document, jQuery, sap, QUnit*/
(function ($) {
	"use strict";

	(function setTitle(sTitle){
		document.title = sTitle;
		$(function(){
			$("#qunit-header").text(sTitle);
		});
	})("qUnit Page for Map - sap.ase.ui5.controls");


	jQuery.sap.require("sap.ui.qunit.qunit-css");
	if ( sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8) {
		QUnit.test("", function(assert) {
			assert.ok(false,"IE 8 is not supported");
		});
		return;
	}
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
	jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");

	jQuery.sap.require("sap.ui.qunit.QUnitUtils");

	jQuery.sap.require("sap.ase.ui5.controls.qunitUtils");
	var _ = sap.ase.ui5.controls.qunitUtils;


	jQuery.sap.require("sap.ase.ui5.controls.Map");

	var DOM_RENDER_LOCATION = "qunit-fixture";

	QUnit.module("Map API", {
		setup : function () {
			this.oMap = new sap.ase.ui5.controls.Map();
		},
		teardown : function () {
			this.oMap.destroy();
			this.oMap = null;
		}
	});

	_.testProperty("oMap","Zoom", 15, 20, [ { input : -1 , msg : "too small" },
	                                    { input : 21 , msg : "too big"}] );

	QUnit.test("Initially the Zoom Slider should have the default zoom value", function(assert) {
		var oZoomSlider = this.oMap.getAggregation("_zoomSlider", []);
		assert.strictEqual(oZoomSlider.getValue(), this.oMap.getZoom());
	});

	QUnit.module("Given a rendered Map,", {
		setup : function () {
			this.oMap = new sap.ase.ui5.controls.Map();

			this.oMap.placeAt(DOM_RENDER_LOCATION);
			sap.ui.getCore().applyChanges();
		},
		teardown : function () {
			this.oMap.destroy();
			this.oMap = null;
		}
	});

	QUnit.test("Then we can find it in DOM with OpenLayers and our Zoom Slider inside", function(assert) {
		assert.strictEqual(this.oMap.$().length, 1 ,"Control is rendered...");
		assert.ok(this.oMap.$("map").children().length > 0 , "... and OpenLayers has used its div");
		assert.strictEqual(this.oMap.$("zoom").length, 1 , "... and the zoom slider is rendered");
	});

	QUnit.test("Then it has its default size", function(assert) {
		assert.strictEqual(this.oMap.$().css("width"), "500px" ,"Default width");
		assert.strictEqual(this.oMap.$().css("height"), "500px","Default height");
	});

	QUnit.test("When changing the size, Then it has should get the size", function(assert) {
		this.oMap.setWidth("800px");
		this.oMap.setHeight("400px");

		sap.ui.getCore().applyChanges();

		assert.strictEqual(this.oMap.$().outerWidth(true), 800 ,"Width adjusted");
		assert.strictEqual(this.oMap.$().outerHeight(true), 400,"Height adjusted");
	});

	QUnit.test("When changing the slider, Then the zoom property should have the new value and forwarded it to OpenLayers", function(assert) {
		var oZoomSpy = this.spy(this.oMap._map.getView(),"setZoom");

		var oZoomSlider = this.oMap.getAggregation("_zoomSlider", []);
		sap.ui.test.qunit.triggerKeydown(oZoomSlider.getDomRef(), "ARROW_RIGHT");

		assert.strictEqual(this.oMap.getZoom(), 16);
		assert.strictEqual(oZoomSpy.callCount, 1, "OpenLayers zoom functionality called");
		assert.ok(oZoomSpy.calledWith(16), "... with the right parameter");
	});

	function mapPOIEqual(oAct, oExp, assert, sMsg){
		assert.strictEqual(oAct.getLat(), oExp.getLat(), "Latitude: " + sMsg);
		assert.strictEqual(oAct.getLong(), oExp.getLong(), "Longitude: " + sMsg);
	}

	QUnit.test("When resetting the center, Then OpenLayers should be triggered to center it on [0,0] ", function(assert) {
		var oCenterSpy = this.spy(this.oMap._map.getView(), "setCenter");

		this.oMap.setCenter();

		var oDefaultMapPOI = new sap.ase.ui5.controls.MapPOI();
		mapPOIEqual(this.oMap._getCenter(), oDefaultMapPOI, assert, "Internal default center");

		assert.strictEqual(oCenterSpy.callCount, 1, "OpenLayers center functionality called");
		assert.ok(oCenterSpy.calledWith(oDefaultMapPOI._getCoordinateForMap()), "... with the right parameter");
	});

	QUnit.test("When setting the center to SAP WDF, Then OpenLayers should be triggered to center it there; When changing the POI, Then the map should update, but not rerender ", function(assert) {
		var oCenterSpy = this.spy(this.oMap._map.getView(), "setCenter");

		var oSapWdfMapPOI = new sap.ase.ui5.controls.MapPOI({
			"lat": 49.294858,
			"long": 8.6336165
		});

		this.oMap.setCenter(oSapWdfMapPOI);

		mapPOIEqual(this.oMap.getCenter(), oSapWdfMapPOI, assert, "External known center");
		assert.strictEqual(oCenterSpy.callCount, 1, "OpenLayers center functionality called");
		assert.ok(oCenterSpy.calledWith(oSapWdfMapPOI._getCoordinateForMap()), "... with the right parameter");

		var oOnAfterRenderingSpy = this.spy();
		this.oMap.addEventDelegate({ onAfterRendering : oOnAfterRenderingSpy});

		oSapWdfMapPOI.setLat(50);

		mapPOIEqual(this.oMap.getCenter(), oSapWdfMapPOI, assert, "External known center updated");
		assert.strictEqual(oCenterSpy.callCount, 2, "OpenLayers center functionality called again");
		assert.ok(oCenterSpy.calledWith(oSapWdfMapPOI._getCoordinateForMap()), "... with the right parameter");
		assert.strictEqual(oOnAfterRenderingSpy.callCount, 0, "Map shouldn't rerender");
	});

	QUnit.test("When rerending, Then the Open Layers map object shouldn't change", function(assert) {
		var oOnAfterRenderingSpy = this.spy();
		this.oMap.addEventDelegate({ onAfterRendering : oOnAfterRenderingSpy});

		var oOLMap = this.oMap._map;

		this.oMap.invalidate();
		sap.ui.getCore().applyChanges();

		assert.strictEqual(this.oMap._map, oOLMap, "Open Layers map object shouldn't change");
		assert.strictEqual(oOnAfterRenderingSpy.callCount, 1, "Map should rerender");
	});

	QUnit.test("When adding a marker, Then the Open Layers map should get an overlay that takes a div created by our renderer", function(assert) {
		var oSapWdfMapPOI = new sap.ase.ui5.controls.MapPOI({
			"lat": 49.294858,
			"long": 8.6336165,
			"icon" : "sap-icon://flag"
		});

		this.oMap.addMarker(oSapWdfMapPOI);
		sap.ui.getCore().applyChanges();

		assert.strictEqual(oSapWdfMapPOI.$().length, 1, "POI Marker should be rendered");
		assert.ok(jQuery.sap.containsOrEquals(this.oMap.getDomRef(), oSapWdfMapPOI.getDomRef()), "... inside the map");
		assert.strictEqual(oSapWdfMapPOI.$().children(".sapUiIcon").length, 1, "... with the specified icon");
		assert.ok(jQuery.sap.containsOrEquals(this.oMap.getDomRef("map"), oSapWdfMapPOI.getDomRef()), "... taking the POI inside the Open Layers map");
		assert.strictEqual(this.oMap._map.getOverlays().getLength(), 1, "Map should get an overlay");

		this.oMap.invalidate();
		sap.ui.getCore().applyChanges();

		assert.strictEqual(this.oMap._map.getOverlays().getLength(), 1, "Map have only one overlay even after rerendering");
	});

	QUnit.test("When adding a marker with an image, Then marker should be rendered as well", function(assert) {
		var oSapWdfMapPOI = new sap.ase.ui5.controls.MapPOI({
			"lat": 49.294858,
			"long": 8.6336165,
			"icon" : "sapLogo.png"
		});

		this.oMap.addMarker(oSapWdfMapPOI);
		sap.ui.getCore().applyChanges();

		assert.strictEqual(oSapWdfMapPOI.$().length, 1, "POI Marker should be rendered");
		assert.strictEqual(oSapWdfMapPOI.$().children("img").length, 1, "... with the specified icon as image");
	});


	QUnit.test("With a marker, When clicking the marker, Then an event handler should be called", function(assert) {
		var oPressSpy = this.spy();

		var oSapWdfMapPOI = new sap.ase.ui5.controls.MapPOI({
			"lat": 49.294858,
			"long": 8.6336165,
			"icon" : "sap-icon://flag",
			"press" : oPressSpy
		});
		this.oMap.addMarker(oSapWdfMapPOI);
		sap.ui.getCore().applyChanges();

		sap.ui.test.qunit.triggerEvent("click", oSapWdfMapPOI.getDomRef());
		assert.strictEqual(oPressSpy.callCount, 1, "Press triggered on click");

		sap.ui.test.qunit.triggerKeydown(oSapWdfMapPOI.getDomRef(), "ENTER");
		assert.strictEqual(oPressSpy.callCount, 2, "Press triggered on enter");
	});

	QUnit.module("MapPOI element API:", {
		setup : function () {
			this.oMapPOI = new sap.ase.ui5.controls.MapPOI();
		},
		teardown : function () {
			this.oMapPOI.destroy();
			this.oMapPOI = null;
		}
	});

	_.testProperty("oMapPOI","Lat", 0, 3.2);
	_.testProperty("oMapPOI","Long", 0, 6.1);
	_.testProperty("oMapPOI","Icon", undefined, "sap-icon://flag");

	QUnit.test("Converts different coordinate formates", function(assert) {
		var oMapCoordinate = this.oMapPOI._getCoordinateForMap();

		_.nearlyEqual(oMapCoordinate[0],0, 1000, "Converted longitude to map format");
		_.nearlyEqual(oMapCoordinate[1],0, 1000, "Converted latitude to map format");

		this.oMapPOI._setCoordinateFromMap(oMapCoordinate);
		assert.strictEqual(this.oMapPOI.getLat(),0, "Converted latitude in map format back to control format");
		assert.strictEqual(this.oMapPOI.getLong(),0, "Converted longitude in map format back to control format");
	});

})(jQuery);
