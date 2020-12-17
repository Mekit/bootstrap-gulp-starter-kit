// gulpfile.js
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps");

var browserSync = require("browser-sync").create();

var paths = {
  styles: {
    // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
    src: "scss/**/*.scss",
    entry: "scss/main.scss",
    // Compiled files will end up in whichever folder it's found in (partials are not compiled)
    dest: "css"
  },

  // Easily add additional paths
  html: {
    src: '*.html', // "path/to/html/*.html"
  }
};

function style() {
  return (
    gulp
      .src(paths.styles.entry)
      // Initialize sourcemaps before compilation starts
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
      }))
      .on("error", sass.logError)
      // Use postcss with autoprefixer and compress the compiled file using cssnano
      .pipe(postcss([
        autoprefixer(),
        // cssnano()
      ]))
      // Now add/write the sourcemaps
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.styles.dest))
  );
}
 
// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;

// A simple task to reload the page
function reload(done) {
  browserSync.reload();
  done();
}

function watch(){
  browserSync.init({
    // You can tell browserSync to use this directory and serve it as a mini-server
    server: {
       baseDir: "./"
    }
    // If you are already serving your website locally using something like apache
    // You can use the proxy setting to proxy that instead
    // proxy: "yourlocal.dev"
  });

  // gulp.watch takes in the location of the files to watch for changes
  // and the name of the function we want to run on change
  gulp.watch(paths.styles.src, gulp.series(style, reload));

  // If you don't want the reload use this instead
  // and comment the next gulp watch
  // gulp.watch(paths.styles.src, style);

  // We should tell gulp which files to watch to trigger the reload
  // This can be html or whatever you're using to develop your website
  // Note -- you can obviously add the path to the Paths object
  gulp.watch(paths.html.src, reload);
}
    
// Don't forget to expose the task!
exports.watch = watch;