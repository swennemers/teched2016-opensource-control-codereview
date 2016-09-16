/*global document, window*/
(function(window) {
	"use strict"; 
	
	document.body.innerHTML += '<h1 id="qunit-header"></h1>' + 
								'<h2 id="qunit-banner"></h2>' +
								'<h2 id="qunit-userAgent"></h2>' +
								'<div id="qunit-testrunner-toolbar"></div>' +
								'<ol id="qunit-tests"></ol>' +
								'<div id="qunit-testresult"></div>' +
								'<div id="qunit-fixture"></div>';

	window["sap-ui-config"] = {
		src : "http://localhost:8080/resources/sap-ui-core.js",
		theme: "sap_bluecrystal",
		libs: "sap.m"
	};

})(window);