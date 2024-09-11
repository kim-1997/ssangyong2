import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass'; // 수정된 부분
import ejs from 'gulp-ejs';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import del from 'del';
import browserSyncPackage from 'browser-sync';
import babel from 'gulp-babel';

const { series, parallel, watch, src, dest } = gulp;
const browserSync = browserSyncPackage.create();
const sassInstance = gulpSass(sass);

/**
 * ? Config
 */
const openFile = 'index.html';
const ASSETS = 'assets/';
const RESOURCES = 'resources/';
const HTML = './dist/';

const CONFIG = {
    workspace: {
        HTML: './src/',
        ASSETS: {
            FONTS: `./src/${ASSETS}fonts`,
            IMAGES: `./src/${ASSETS}images`,
            STYLE: `./src/${ASSETS}scss`,
            SCRIPT: `./src/${ASSETS}script`,
            LIBRARY: `./src/${ASSETS}library`,
        },
    },
    deploy: {
        HTML: HTML,
        ASSETS: {
            FONTS: `./dist/${RESOURCES}${ASSETS}fonts`,
            IMAGES: `./dist/${RESOURCES}${ASSETS}images`,
            STYLE: `./dist/${RESOURCES}${ASSETS}css`,
            SCRIPT: `./dist/${RESOURCES}${ASSETS}script`,
            LIBRARY: `./dist/${RESOURCES}${ASSETS}library`,
        },
    },
};

/**
 * ? @task : EJS
 */
async function EJS() {
    return src([`${CONFIG.workspace.HTML}/**/*.html`, `!${CONFIG.workspace.HTML}/**/include/*.html`, `!${CONFIG.workspace.HTML}/php/**/*.html`])
        .pipe(ejs())
        .pipe(dest(CONFIG.deploy.HTML));
}

/**
 * ? @task : Sass
 */
async function CompileCSS() {
    return src(`${CONFIG.workspace.ASSETS.STYLE}/*.scss`)
        .pipe(sassInstance({ outputStyle: 'expanded' }).on('error', sassInstance.logError))
        .pipe(dest(CONFIG.deploy.ASSETS.STYLE));
}

/**
 * ? @task : Imagemin
 */
async function Imagemin() {
    return src(`${CONFIG.workspace.ASSETS.IMAGES}/**/*.*`, { encoding: false })
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 85, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
                }),
            ])
        )
        .pipe(dest(CONFIG.deploy.ASSETS.IMAGES));
}

/**
 * ? @task : Copy - Library
 */
async function Library() {
    return src(`${CONFIG.workspace.ASSETS.LIBRARY}/**/*`).pipe(dest(CONFIG.deploy.ASSETS.LIBRARY));
}

/**
 * ? @task : Copy - Javascript
 */
async function Script() {
    return src(`${CONFIG.workspace.ASSETS.SCRIPT}/**/*.js`)
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest(CONFIG.deploy.ASSETS.SCRIPT));
}

/**
 * ? @task : Copy - Fonts
 */
async function Font() {
    return src(`${CONFIG.workspace.ASSETS.FONTS}/**/*`, { encoding: 'binary' }).pipe(newer(CONFIG.deploy.ASSETS.FONTS)).pipe(dest(CONFIG.deploy.ASSETS.FONTS));
}

/**
 * ? @task : Clean
 */
async function Clean() {
    return del('./dist');
}

/**
 * ? @task : Browser Sync
 */
async function BrowserSync() {
    browserSync.init({
        server: {
            baseDir: './dist',
            index: openFile,
        },
        port: 8080,
        cors: true,
        online: true,
    });
}

/**
 * ? @task : Lottie
 */
async function Lottie() {
    return src(`${CONFIG.workspace.ASSETS.IMAGES}/*.json`).pipe(dest(CONFIG.deploy.ASSETS.IMAGES));
}

/**
 * ? @task : Watch
 */
function Watch() {
    watch(`${CONFIG.workspace.HTML}/**/*.html`, EJS).on('change', browserSync.reload);
    watch(`${CONFIG.workspace.ASSETS.STYLE}/**/*.scss`, CompileCSS).on('change', browserSync.reload);
    watch(`${CONFIG.workspace.ASSETS.IMAGES}/**/*.*`, Imagemin).on('change', browserSync.reload);
    watch(`${CONFIG.workspace.ASSETS.SCRIPT}/**/*.js`, Script).on('change', browserSync.reload);
    watch(`${CONFIG.workspace.ASSETS.IMAGES}/*.json`, Lottie).on('change', browserSync.reload);
}

/**
 * ? 기본 작업
 */
const defaultTasks = series(Clean, parallel(CompileCSS, EJS, Script, Library, Font, Imagemin, Lottie), BrowserSync, Watch);

export default defaultTasks;
export { Clean };
