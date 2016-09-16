// Provides common qunit utility functionality.
/*globals sap, QUnit, strictEqual*/
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	function _normalizeFloat(fNumber, iPrecision){
		return Math.round(fNumber * iPrecision) / iPrecision;
	}
	
	return {
		
		activateLessRuntimeCompiler : function() {
			jQuery.sap.require("sap.ui.core.plugin.LessSupport");
			// HEAD SUPPORT MISSING RIGHT NOW: https://jtrack/browse/NGPBUG-15001
			// disable head requests and only return the reuselib less to be newer than css
			sap.ui.core.plugin.LessSupport.prototype.getLastModified = function(sUrl) {
				if (jQuery.sap.endsWith(sUrl, "sap/ase/ui5/controls/themes/sap_bluecrystal/library.source.less")) {
					return 1;
				}
				return 0;
			};
		},
		
		isNearlyEqual : function(fAct, fExp, iPrecision){
			fAct = _normalizeFloat(fAct, iPrecision);
			return fAct === fExp;
		},
		
		nearlyEqual : function(fAct, fExp, iPrecision,sMsg){
			fAct = _normalizeFloat(fAct, iPrecision);
			strictEqual(fAct, fExp, sMsg);
		},

		/**
		 * @param {object} oElement DOM Element
		 * @returns {number} css rotation of DOM element in degree between 0 and 360
		 */
		getRotationOf : function(oElement){
			var oStyle = window.getComputedStyle(oElement, null);
			var sTransformStyle = oStyle.getPropertyValue("-ms-transform") ||
			         oStyle.getPropertyValue("transform");
			// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix
			var values = sTransformStyle.split('(')[1].split(')')[0].split(',');
			var a = values[0];
			var b = values[1];
			var iDegree = Math.round(Math.atan2(b, a) * (180 / Math.PI));
			if ( iDegree < 0 ){
				//normalize
				iDegree += 360;
			}
			return iDegree;
		},
		
		/**
		 * @param {jQuery} $elem jQuery Object of a UI5 Control
		 * @returns {number} css rotation of element in degree
		 */
		getRotationOf$ : function($elem){
			var oElement = jQuery.sap.domById($elem[0].id);
			return this.getRotationOf(oElement);
		},

		testProperty : function(sControlVariable, sProperty, vDefaultValue, vCustomValue, aInvalid){
			var sControlName = "this." + sControlVariable;
			
			QUnit.test(sControlName + ": '" + sProperty + "' property", function(assert) {
				var oControl = this[sControlVariable];
				assert.strictEqual(oControl["get" + sProperty](), vDefaultValue , "Default Value");
				
				oControl["set" + sProperty](vCustomValue);
				assert.strictEqual(oControl["get" + sProperty](), vCustomValue ,"Custom Value");
			});
			
			jQuery.each(aInvalid || [],function(i){
				var that = this;
				var oInvalid = that;
				QUnit.test(sControlName + ": '" + sProperty + "' property invalid properties: " + oInvalid.msg, function(assert) {
					assert.throws(function(){
						var oControl = this[sControlVariable];

						oControl["set" + sProperty](oInvalid.input);
					},"invalid property: " + sProperty);
					
				});	
			});
			
		}
	};

}, /* bExport= */ true);