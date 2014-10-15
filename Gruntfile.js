
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	// configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

	grunt.initConfig({
		yeoman: yeomanConfig,
		watch: {
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/*.css',
                	'{.tmp,<%= yeoman.app %>}/scripts/*.js',
                    '<%= yeoman.app %>/img/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        clean: {
            server: '.tmp'
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        wkhtmltopdf: {
	      dev: {
	        src: '<%= yeoman.app %>/index.html',
	        dest: '<%= yeoman.dist %>/pdf'
	      }
	    },
	    autoshot: {
            dist: {
                options: {
                    path: '<%= yeoman.dist %>/screenshots/',
                    remote : {
                        files: [
                            { src: 'http://localhost:<%= connect.options.port %>', dest: 'devis.pdf', type: 'pdf'}
                        ]
                    }
                }
            }
        },
	});

	grunt.registerTask('serve', function (target) {
        grunt.task.run([
            'clean:server',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });
    grunt.registerTask('pdf', function (target) {
        grunt.task.run([
            'wkhtmltopdf:dev'
        ]);
    });
    grunt.registerTask('screenshots', [
        'clean:server',
        'connect:livereload',
        'autoshot'
    ]);

}