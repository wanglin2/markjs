const isDev = process.env.NODE_ENV === 'development'
module.exports = {
    publicPath: isDev ? '' : './dist',
    outputDir: '../dist/',
    lintOnSave: false,
    transpileDependencies: [/@wanglin1994/]
}