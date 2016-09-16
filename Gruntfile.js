/*globals module */
module.exports = function(grunt) {
	//non camelcase is used by grunt => compliance not possible
	/* eslint-disable camelcase */
	"use strict";

	// allow to specfiy a different port
	if (typeof grunt.option("port") !== 'number' ){
		grunt.option("port", 8080);
	}

	grunt.initConfig({

		dir : {
			uilib : {
				base : 'uilib',
				src : '<%= dir.uilib.base %>/src',
				test : '<%= dir.uilib.base %>/test',
				dist : {
					base : '<%= dir.dist %>/uilib',
					resources : '<%= dir.uilib.dist.base %>/resources',
					testresources : '<%= dir.uilib.dist.base %>/test-resources'
				}
			},
			dist : 'target'
		},

		src_resources: [
			'<%= dir.uilib.src %>',
			'bower_components/openui5-sap.m/resources',
			'bower_components/openui5-sap.ui.core/resources',
			'bower_components/openui5-themelib_sap_bluecrystal/resources'
		],
		dist_resources: [
			'<%= dir.uilib.dist.resources %>',
			'bower_components/openui5-sap.m/resources',
			'bower_components/openui5-sap.ui.core/resources',
			'bower_components/openui5-themelib_sap_bluecrystal/resources'
		],
		src_testresources: [
			'<%= dir.uilib.test %>',
			'bower_components/openui5-sap.ui.core/test-resources',
		],
		dist_testresources: [
			'<%= dir.uilib.dist.testresources %>',
			'bower_components/openui5-sap.m/test-resources',
			'bower_components/openui5-sap.ui.core/test-resources',
			'bower_components/openui5-themelib_sap_bluecrystal/test-resources'
		],

		connect: {
			options: {
				port: "<%= grunt.option('port') %>",
				hostname: '*',
				open: 'http://localhost:<%= connect.options.port %>/test-resources/sap/ase/ui5/controls/index.html'
			},
			src: {
			},
			dist: {
			}

		},

		openui5_connect: {

			options: {
				// allow access from e.g. Karma
				cors: {
					origin: "*"
				},
				contextpath: ''

			},

			src: {
				options: {
					resources: "<%= src_resources %>",
					testresources: "<%= src_testresources %>"
				}
			},

			dist: {
				options: {
					resources: "<%= dist_resources %>",
					testresources: "<%= dist_testresources %>"
				}
			}
		},

		clean: {
			'target': {
				dot: true,
				src: [ '<%= dir.dist %>/*' ]
			}
		},

		copy: {

			'src-target-uilib': {
				files: [
					{
						expand: true,
						cwd: '<%= dir.uilib.src %>',
						src: [
							'**/*.*',
							'!**/themes/**/*.{css,less}' // css files will be created by the 'openui5_less' task
						],
						dest: '<%= dir.uilib.dist.resources %>'
					}
				]
			},

			'test-target-uilib': {
				files: [
					{
						expand: true,
						cwd: '<%= dir.uilib.test %>',
						src: [
							'**/*.*'
						],
						dest: '<%= dir.uilib.dist.testresources %>'
					}
				]
			},

		},

		openui5_theme: {

			'sap.ase.ui5.controls': {
				options: {
					rootPaths: "<%= src_resources %>",
					compiler: {
						compress: true
					}
				},
				files: [
					{
						expand: true,
						cwd: '<%= dir.uilib.src %>',
						src: '**/themes/*/library.source.less',
						dest: '<%= dir.uilib.dist.resources %>'
					}
				]
			}

		},

		openui5_preload: {
			library: {
				options: {
					resources: '<%= dir.uilib.src %>',
					dest: '<%= dir.uilib.dist.resources %>'
				},
				libraries: true
			}
		}

		/* eslint-enable camelcase */
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');

	// Server task
	grunt.registerTask('serve', function(mode) {
		grunt.task.run([ 'openui5_connect:' + (mode || 'src') + ':keepalive' ]);
	});

	// Build task
	grunt.registerTask('build', [
		'copy',
		'openui5_preload',
		'openui5_theme'
	]);

	grunt.registerTask('default', [
		'clean',
		'build',
		'serve:dist'
	]);
};
