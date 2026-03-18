const path = require('path')
const webpack = require('webpack')


//const HtmlWebpackPlugin = require('html-webpack-plugin')
//const { CleanWebpackPlugin } = require('clean-webpack-plugin')
//const { VueLoaderPlugin } = require('vue-loader')

module.exports = (env, argv) => {
    const mode = argv.mode || 'development';

    const config = {
        entry: path.resolve(__dirname, './app.js'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'server.js',
            clean: true
            //sourceMapFilename: 'bundle.map',
        },
        //plugins: [
        //    new webpack.HotModuleReplacementPlugin(), 
        //    new CleanWebpackPlugin({
        //        protectWebpackAssets: false,
        //        cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
        //    }),
        //],
        performance: {
            hints: false, 
        },
        //devtool: 'source-map',
        watch: mode === 'development' ? true : false,
        devtool: mode === 'development' ? 'source-map' : false,
        devServer: {
            //compress: true,
            port: 8080,
            static: {
                directory: path.join(__dirname, 'dist')
            },
            open: true
        }        
    };
    return config;
}