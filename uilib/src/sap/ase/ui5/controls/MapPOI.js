// Provides control sap.ase.ui5.controls.MapPOI.
/*globals sap, ol*/
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element', './lib/ol'],
	function(jQuery, library, Element) {
	"use strict";

	/**
	 * Constructor for a new MapPOI.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A simple MapPOI.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version @version@
	 *
	 * @constructor
	 * @public
	 * @alias sap.ase.ui5.controls.MapPOI
	 */
	var MapPOI = Element.extend('sap.ase.ui5.controls.MapPOI', {

		metadata: {
			properties: {
				lat : {name: "lat", type: "float", defaultValue: 0},
				long : {name: "long", type: "float", defaultValue: 0},
				icon : {name: "icon", type: "sap.ui.core.URI"}
			},

			events : {
				press : {}
			}
		},
		// converts from Longitude/Latitude (EPSG:4326) to Spherical Mercator projection that OSM operates with (EPSG:3857)
		_getCoordinateForMap : function(){
			return ol.proj.fromLonLat([this.getLong(), this.getLat()]);
		},

		_setCoordinateFromMap : function(oCoordinate){
			var aCoord = ol.proj.toLonLat(oCoordinate);
			this.setProperty("long", aCoord[0], true);
			this.setProperty("lat", aCoord[1], true);
		},

		_onAfterRendering : function() {
			/*Unfortunately the map cancels the bubbling of the click events :(*/
			var that = this;
			this.$().click(function(){
				that.firePress();
			});
		},

		onsapenter : function() {
			this.firePress();
		}
	});

	return MapPOI;

}, /* bExport= */ true);
