const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')

/*
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
*/

module.exports = (env, argv) => {
    const mode = argv.mode || 'development';

    const config = {
        entry: path.resolve(__dirname, './src/index.js'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            //sourceMapFilename: 'bundle.map',
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                    //use: ['vue-loader']
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                    /*
                    use: [{
                            loader: 'ts-loader',
                            options: {
                                appendTsSuffixTo: [/\.vue$/],
                            }
                    }],                    
                    exclude: /node_modules/
                    */
                },
                {
                    test: /\.scss|\.css$/,
                    use: ['vue-style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]'
                    }
                }
            ],
        },
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src'),
                'vue': '@vue/runtime-dom',
                'vuex': 'vuex/dist/vuex.esm-bundler'
            },
            extensions: ['.ts', '.js', '.vue', '.json']
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(), 
            new webpack.DefinePlugin({
                //"process.env.NODE_ENV": JSON.stringify("development"),
                __VUE_OPTIONS_API__: JSON.stringify(true),
                __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/index.html'
            }),
            new VueLoaderPlugin(),
            new CleanWebpackPlugin({
                protectWebpackAssets: false,
                cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: './src/pic', to: './pic' },
                ]
            }),            
            /*
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            */
        ],
        performance: {
            hints: false, 
        },        
        //devtool: 'source-map',
        watch: mode === 'development' ? true : false,
        devtool: mode === 'development' ? 'source-map' : false,
        devServer: {
            //compress: true,
            port: 8080,
            // SPA fallback：深層路徑（如 /PM01）重新整理時回傳 index.html，交給前端 Vue Router 處理
            historyApiFallback: true,
            client: {
                overlay: {
                    runtimeErrors: (error) => {
                        // ResizeObserver 的迴圈警告是瀏覽器良性訊息，不顯示紅色錯誤覆蓋層
                        if (error.message.includes('ResizeObserver loop')) {
                            return false;
                        }
                        return true;
                    },
                },
            },
            static: {
                directory: path.join(__dirname, 'dist')
            },
            open: true,
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://localhost:' + (process.env.APP_PORT || 80),
                    changeOrigin: true
                }
            ]
        }        
    };
    return config;
}