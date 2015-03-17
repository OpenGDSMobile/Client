module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //uglify setting
        uglify: {
            options: {
                banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */ ' //banner setting
            },
            build: {
                src: 'OpenGDSMobileLib/openGDSMobileClient1.1.js', //uglify src
                dest: 'OpenGDSMobileLib/openGDSMobileClient1.1.min.js' //uglify dest
            }
        },
        //concat setting
        concat : {
            basic: {
                src: ['js/openGDSMobile/OGDSM.js', 'js/openGDSMobile/OGDSM_visualization.js', 'js/openGDSMobile/OGDSM_externalConnection.js', 'js/openGDSMobile/OGDSM_eGovFrameUI.js'], //concat src
                dest: 'OpenGDSMobileLib/openGDSMobileClient1.1.js' //concat dest
            }
        }
    });

    // Load the plugin that provides the "uglify", "concat" tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']); //grunt execute
};
