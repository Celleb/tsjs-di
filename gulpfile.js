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
});

gulp.task('builde2e', () => {
    return gulp.src('e2e-src/**/*.ts').pipe(ts({
        target: "es6",
        module: "CommonJS",
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        declaration: false,
        moduleResolution: "node",
        lib: [
            "es5",
            "es2015"
        ]
    })).pipe(gulp.dest('e2e'));
})

gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
    gulp.watch('src/**/*.spec.ts', ['tests']);
    gulp.watch('e2e-src/**/*.ts', ['builde2e']);
    gulp.watch(['dist/**/*.js', 'test/**/*.js'], ['mocha']);
});

gulp.task('watch-e2e', () => {
    gulp.watch(['e2e/**/*.js'], ['e2e']);
});

gulp.task('mocha', function () {
    return gulp.src(['test/**/*.js'], { read: false }).pipe(mocha({
        reporter: 'spec'
    })).on('error', logger.error);
});

gulp.task('e2e', function () {
    return gulp.src(['e2e/index.js'], { read: false }).pipe(mocha({
        reporter: 'spec'
    })).on('error', logger.error);
});

gulp.task('watch-mocha', function () {

});

gulp.task('default', ['watch']) 