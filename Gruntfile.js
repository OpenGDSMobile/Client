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
                src: 'js/OpenGDSMobileLib/openGDSMobileClient1.3.js', //uglify src
                dest: 'js/OpenGDSMobileLib/openGDSMobileClient1.3.min.js' //uglify dest
            }
        },
        //concat setting
        concat : {
            basic: {
                src: ['js/openGDSMobile/OGDSM.js','js/openGDSMobile/Sortable.js', 'js/openGDSMobile/OGDSM_visualization.js', 'js/openGDSMobile/OGDSM_externalConnection.js', 'js/openGDSMobile/OGDSM_eGovFrameUI.js', 'js/openGDSMobile/OGDSM_mapLayerList.js','js/openGDSMobile/OGDSM_indexedDB.js', 'js/openGDSMobile/OGDSM_attributeTable.js', 'js/openGDSMobile/OGDSM_chartVisualization.js'], //concat src
                dest: 'js/OpenGDSMobileLib/openGDSMobileClient1.3.js' //concat dest
            }
        }
    });

    // Load the plugin that provides the "uglify", "concat" tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']); //grunt execute
};
