/**
 * Created by akuloghl on 1/15/2015.
 */
module.exports = function (grunt) {
    require('jit-grunt')(grunt);
    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: false,
                    cleancss: false,
                    optimization: 2,
                    sourceMap: true
                    //sourceMapFilename: "apps/BrandEdge/common/css/test.map"
                },
                files: [{
                    expand: true,
                    cwd: 'apps/BrandEdge/common/less/',
                    src: ['**/*.less'],
                    dest: 'apps/BrandEdge/common/css/',
                    ext: '.css'
                }]
                /*
                files: {
                    "apps/BrandEdge/common/css/test.css": "apps/BrandEdge/common/less/test.less" // destination file and source file
                }
                */
            }
        },
        watch: {
            apps: {
                files: ['apps/BrandEdge/*', 'apps/BrandEdge/**'],
                tasks: ['mobilefirst:build:apps', 'mobilefirst:deploy:apps']
            },
            adapters: {
                files: ['adapters/*', 'adapters/**'],
                tasks: ['mobilefirst:build:adapters', 'mobilefirst:deploy:adapters']
            }
        },
        mobilefirst: {
            build: {},
            deploy: {}
        }
    });

    var execCommand = function (name, cmd, opts) {
        var exec = require('child_process').exec;
        var done = this.async();
        exec(cmd, opts || {}, function (err, stdout, stderr) {
            if (err) {
                grunt.log.error(stderr);
                done();
                grunt.fail.fatal(name + ' failed.');
            }
            console.log(stdout);
            grunt.log.ok(name + ' succeeded.');
            done();
        });
    };

    grunt.registerMultiTask('mobilefirst', function(artifactFolder) {
        execCommand.apply(this, ['MobileFirst Task', 'mfp ' + this.target, {
            cwd: artifactFolder
        }]);
    });

    // Load additional grunt tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    //grunt.registerTask('default', ['mobilefirst:build:apps', 'mobilefirst:build:adapters']);

    //grunt.registerTask('build', ['mobilefirst:build:apps']);
    //grunt.registerTask('deploy', ['mobilefirst:deploy:apps']);

    grunt.registerTask('compile-less', ['less']);

};