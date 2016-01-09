module.exports = function(grunt) {


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: [
                'package.json',
                'gruntfile.js',
                'index.js',
                'test/**/*.js',
                'src/**/*.js'
            ],
        },
        concat: {
            options: {
                separator: ' ',
            },
            dist: {
                src: ['src/js/*.js'],
                dest: 'dist/<%= pkg.name %>.js',
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [
                        '<%= concat.dist.dest %>'
                    ]
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'build/<%= pkg.name %>.js': ['src/js/*.js']
                },
            }
        },
        clean: ["build"],
        copy: {
            main: {
                files: [
                    // includes files within path and flattens directory
                    {
                        expand: true,
                        src: ['src/html/*.html'],
                        dest: 'build/',
                        flatten: true
                    },
                    {
                        expand: true,
                        src: ['src/css/*.css'],
                        dest: 'build/',
                        flatten: true
                    },

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['path/**'], dest: 'dest/'},

                    // makes all src relative to cwd
                    //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
                ],
            },
        },
    });



    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['clean', 'jshint', 'browserify', 'copy']);
    // grunt.registerTask('push', ['jshint', 'uglify', 'concat', 'sftp']);
    //grunt.registerTask('browser', ['browserify']);



};
