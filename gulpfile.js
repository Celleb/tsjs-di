const gulp = require('gulp');
const ts = require('gulp-typescript');
const mocha = require('gulp-mocha');
const logger = require('fancy-log');
const flatten = require('gulp-flatten');
const merge = require('merge2');

const tsProject = ts.createProject('tsconfig.json');


gulp.task('scripts', () => {
    const tsResults = tsProject.src().pipe(tsProject());
    return merge([
        tsResults.js.pipe(gulp.dest('dist')),
        tsResults.dts.pipe(gulp.dest('dist')),
        gulp.src('src/**/*.d.ts').pipe(gulp.dest('dist'))
    ]);
});

gulp.task('tests', () => {
    return gulp.src('src/**/*.spec.ts').pipe(ts({
        target: "es5",
        module: "CommonJS",
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        declaration: false,
        moduleResolution: "node",
        lib: [
            "es5",
            "es2015"
        ]
    })).pipe(flatten()).pipe(gulp.dest('test'))
})

gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
    gulp.watch('src/**/*.spec.ts', ['tests']);
    gulp.watch(['dist/**/*.js', 'test/**/*.js'], ['mocha']);
});

gulp.task('mocha', function () {
    return gulp.src(['test/**/*.js'], { read: false }).pipe(mocha({
        reporter: 'spec'
    })).on('error', logger.error);
});

gulp.task('watch-mocha', function () {

});

gulp.task('default', ['watch']) 