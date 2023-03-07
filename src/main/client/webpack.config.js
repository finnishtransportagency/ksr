module.exports = {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: {
                    and: [/node_modules/], // exclude libraries in node_modules ...
                    not: [
                        // except for ones that needs to be transpiled because
                        // they use modern syntax
                        /@arcgis[\\/]core/,
                    ],
                },
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            // these are required by Webpack 4 since @arcgis/core@4.24
                            ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
                            ['@babel/plugin-proposal-optional-chaining', { loose: true }],
                        ],
                    },
                },
            },
        ],
    },
};
