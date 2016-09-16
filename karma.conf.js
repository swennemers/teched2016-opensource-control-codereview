// Karma configuration
// Generated on Wed Nov 26 2014 12:51:32 GMT+0100 (W. Europe Standard Time)
/* global module */

module.exports = function(config) {
	"use strict";
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'qunit'
		],

		// list of files / patterns to load in the browser
		files: [
			{
				pattern: 'karma.ui5-qunit-bootstrap.js',
				included: true
			}, {
				pattern: 'http://localhost:8080/resources/sap-ui-core.js',
				included: true
			}, {
				pattern: 'uilib/src/**/*.js',
				included: false
			}, {
				pattern: 'uilib/test/**/*qunit.js',
				included: true
			}
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [
			'progress'
		],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		// browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'PhantomJS', 'IE'],
		browsers: [
			'Chrome'
		],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false
	});
};
