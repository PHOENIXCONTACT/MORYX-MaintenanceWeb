var webpack = require('webpack');

module.exports = (env, options) => {
    console.log(`Webpack 4 'mode': ${options.mode}`);
    return {
        entry: {
            app: "./src/index.tsx",
        },
        output: {
            filename: "bundle.js",
            path: __dirname + "/dist",
        },

        devServer: {
            contentBase: __dirname + "/dist"
        },
        
        // Enable sourcemaps for debugging webpack's output.
        //devtool: "inline-source-map",
        devtool: options.mode == "production" ? "" : "inline-source-map",

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".json"]
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    enforce: 'pre',
                    loader: 'tslint-loader',
                    options: { fix: true }
                },

                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                { 
                    test: /\.tsx?$/, 
                    loader: "awesome-typescript-loader" 
                },

                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                { 
                    enforce: "pre", 
                    test: /\.js$/, 
                    loader: "source-map-loader" 
                },

                { 
                    //test: /.woff$|.woff2$|.ttf$|.eot$|.svg$|.png$/, 
                    test: /\.png$/,
                    loader: 'url-loader',
                    options: { 
                        limit: 10240,
                        name: 'images/[name].[ext]'
                    }
                },

                { 
                    test: /\.css$/,
                    use: [{
                            loader: "style-loader"
                        }, {
                            loader: "css-loader",
                        }]
                },

                { test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                },
            ],
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
         ]
    };
};