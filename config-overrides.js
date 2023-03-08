const path = require('path');

module.exports = {
    paths: function (paths, env) {
        paths.appHtml = path.resolve(__dirname, 'client/public/index.html')
        paths.appIndexJs = path.resolve(__dirname, 'client/src/index.js')
        paths.appPublic = path.resolve(__dirname, 'client/public')
        paths.appBuild = path.resolve(__dirname, 'client/build')
        paths.appSrc = path.resolve(__dirname, 'client/src')
        return paths;
    }
};