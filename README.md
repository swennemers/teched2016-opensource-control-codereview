# UX724 How to Integrate Open Source JavaScript Libraries

This repository contains the material of the code review for SAP TechEd 2016. Hope to see you @TechEd :-) and have fun with the code afterwards.

## Abstract
In this code review, you’ll learn how to integrate the open source JavaScript library OpenLayers in a custom SAPUI5 control. And you’ll also write QUnit tests for this control.

## Idea
Show the trick to integrate with 3rd party JS libs via HTML control. Reuse the ASE UI5 Controls Map control. Show how to write QUnit tests for the control as well.

## Setup
The code review uses the with OpenUI5 grunt build.

### General setup
* Node.js with npm installed
* Ensure your proxy environment variables set, if you need them, e.g.:
	```
	setx HTTP_PROXY http://proxy:8080
setx HTTPS_PROXY http://proxy:8080
setx FTP_PROXY http://proxy:8080
setx NO_PROXY localhost,127.0.0.1
```
For Mac-users you have to use ```set HTTPS_PROXY```

* msysgit installed and git command is available on the command line
* Chrome browser installed

### Specific setup
* Clone this Repo
* Run:

	```
	npm install grunt-cli bower -g

	npm install
	bower install
	```

* Run `` grunt serve `` => Chrome should open with and index page that links all steps

* You can adjust center positions in all steps for your venue coordinates in Step 1 and Step 4

* Open the links and show the code via Chrome Debugger

## Script

### Intro

UI5 is great and provides also many special controls for maps and charts and ..., but sometimes other 3rd party libs bring interessting functionality you want to integrate into your UI5 app.

In this code review we want to integrate OpenLayers. A library that can render maps.

What I am going to show for the integration of OpenLayers is similar on what can be done to integrate many other libs you can integrate like ACE & Orion editor (code editors), some google widgets, charting libs.

### OpenLayers Intro
Just copied the Quick Start from http://openlayers.org/en/latest/doc/quickstart.html and adjusted the center to show SAP Headquarters or Tech Ed Venues
Show quickstart demo: http://localhost:8080/test-resources/sap/ase/ui5/controls/01-OpenLayersQuickstart.html

Show quickstart code: Explain based on OpenLayers Quick Start docu (mostly includes as comments in the html)

### Issues
- DOM nodes owned by libraries (OpenLayers and SAPUI5)
	- Just adding a DOM node for the map outside SAPUI5s root is usually not an option as the library should be integrated into apps.
	- Just adding a DOM node inside your app will likely cause some conflict with UI5 rerendering/recreating part of the DOM and then removing the DOM node
	=> UI5 HTML control helps
- You want to integrate with SAPUI5s capabilities like databinding, XMLView integration.
	=> Wrapper Control

If you want to have deep integration with databinding like in the example:
http://localhost:8080/test-resources/sap/ase/ui5/controls/FullMap.html showing the SAP TechEd and SAP Headquarters location.

The best solution is to have a wrapper control that uses an HTML control inside.

### What is a UI5 control?
http://localhost:8080/test-resources/sap/ase/ui5/controls/03-SimpleControl.html following the HTML comments:
inherit from sap.ui.core.Control, Properties, Renderer
Playing a little bit with UI5 Inspector

### OpenLayers quickstart as Wrapper Control
Let's combine the simple control with the OpenLayers quickstart example:
http://localhost:8080/test-resources/sap/ase/ui5/controls/04-QuickstartWrapper.html

- Require Openlayers library
- Properties for width and height
- **hidden aggregation** map with an ``sap.ui.core.HTML`` control
	- this controls will provide the DOM node we need for OpenLayers it will be preserved in UI5 rendering
- initialize the ``HTML control`` directly with an ID based on the controls ID + suffix (UI5 Guideline)
- render a ``<div />`` for the control and inside the ``HTML control``
- ``onAfterRendering``: we have to  **wait for the first rendering** to create the OpenLayers map. Same ol.Map as in Quick Start.

### Databinding and separate files
http://localhost:8080/test-resources/sap/ase/ui5/controls/05-SimpleWrapperWithDatabinding.html

- Have a the control in a dedicated file: ``uilib/src/sap/ase/ui5/controls/SimpleMap.js``:
- new property for zoom level, no need to hard code it
- forward property changes via setter to OpenLayers view

- Show JSONModel two-way binding with slider in html

### FullMap Sample
- allows to set markers (Point of Interest) at coordinates
- dedicated objects (UI5 elements) for coordinates.
- everthing could use databinding

### Closing the session
You saw how you can easily build wrapper controls for external libraries:
- ``HTML`` control to have a dedicated DOM for the libraries
- A wrapper to allow UI5 integration (databinding, XMLView, ...)


## Additional content

### Additional example for embedding with D3.js:
http://jsbin.com/jukefo/edit?html,output

### Basic Map functionality
The step between just the zoom level and the full map is huge. A step in between is the ``BasicMap.js`` with the usage in http://localhost:8080/test-resources/sap/ase/ui5/controls/BasicWrapperMapControl.html.

The ``MapPOI`` is a UI5 element. Elements cannot render themself, but a parent control can use them. They allow to group properties, like the coordinates in this example and can have some supporting functionality, like the conversion between the coordinate formats.

The marker with icons have to be rendered and then given under OpenLayers control
```
new ol.Overlay({
	element: aMarkers[i].getDomRef(),
	...
});
```

### Unit tests
Control is written in TDD. That is possible even when integration 3rd party libs:
Show ``Map.qunit.js``, ``QUnit.test("When setting the center to SAP WDF, Then OpenLayers should be triggered to center it there; When changing the POI, Then the map should update, but not rerender ", ...``

- sinon spy to check that wrapper control API calls reach the OpenLayers APIs
