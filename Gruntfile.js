
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
   // for changes to the front-end code
    watch: {
         views: {
            files: ['views/layouts/*.handlebars'],
            tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
        },
        scripts: {
            files: ['client/controllers/**/.js', 'client/src/**/*.js','client/controllers/skapps/**/.js'],
            tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
        },
        less: {
            files: ['client/styles/**/*.less'],
            tasks: ['less:transpile', 'copy:dev']
        }
    },

    // for changes to the node code
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    concurrent: {
        dev: {
            tasks: ['nodemon:dev', 'watch:scripts', 'watch:less', 'watch:files'],
            options: {
                logConcurrentOutput: true
            }
        },
        test: {
            tasks: ['watch:karma'],
            options: {
                logConcurrentOutput: true
            }
        }
    }
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);
    grunt.registerTask('server', ['nodemon:dev','watch:scripts', 'watch:less', 'watch:test']);

};
