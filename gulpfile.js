const { src, dest } = require('gulp');
const concat = require('gulp-concat')
const rename = require('gulp-rename')

const jsFiles = [
    'src/header.js',
    'src/style.js',
    'src/config.js',
    'src/info.js',
    'src/tts.js',
    'src/create.js',
    'src/dict.js',
    'src/search.js',
    'src/lib.js',
    'src/popup.js',
    'src/pinyinzhuyin.js',
    'src/unzipit.min.js',
    'src/index.js'
]

const bundleJs = () => {
    return src(jsFiles)
        // bundle all js files in dist folder in hanzipopup.js file
        .pipe(concat('hanzipopup.user.js'))
        // write hanzipopup.js to dist
        .pipe(dest('./dist'))
        .pipe(dest('./docs'))
}

const copyTtsFile = () => {
    return src('./src/tts.js')
        .pipe(dest('./docs/js'))
}

const copyReadme = () => {
    // rename Readme as index and copy Readme.md to docs folder
    return src('./Readme.md')
        .pipe(rename('index.md'))
        .pipe(dest('./docs'))
}

exports.bundleJs = bundleJs
exports.copyTtsFile = copyTtsFile
exports.copyReadme = copyReadme
