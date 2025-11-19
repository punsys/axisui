const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const glob = require('glob');

// Function to generate HTML webpack plugins for all HTML files in src/html
function generateHtmlPlugins() {
  const htmlFiles = [];
  
  // Check if src/html directory exists and find HTML files
  const srcHtmlDir = path.resolve(__dirname, 'src/html');
  if (fs.existsSync(srcHtmlDir)) {
    const files = glob.sync('**/*.html', { 
      cwd: srcHtmlDir,
      ignore: ['partials/**/*'] // Ignore partials directory
    });
    
    files.forEach(file => {
      htmlFiles.push(
        new HtmlWebpackPlugin({
          template: path.resolve(srcHtmlDir, file),
          filename: `html/${file}`,
          inject: false, // Don't auto-inject since we have manual links
          minify: false,
          templateParameters: {
            environment: process.env.NODE_ENV || 'development',
            title: 'AxisUI Framework',
            description: 'Modern CSS-only framework without JavaScript dependencies'
          }
        })
      );
    });
  }
  
  return htmlFiles;
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const shouldMinify = env && env.minify;
  const shouldAnalyze = env && env.analyze;

  // Define CSS filename based on build type
  const getCssFilename = () => {
    if (isProduction) {
      return shouldMinify 
        ? 'assets/css/axis-ui.min.css'
        : 'assets/css/axis-ui.css';
    }
    return 'assets/css/axis-ui.css';
  };
  

  const config = {

  entry: {
  'axis-ui': './src/scss/axis-ui.scss',
  'axis-sidebar': './src/js/sidebar.js',
  'axis-forms': ['./src/js/advanced-forms.js', './src/js/form-validation.js', './src/js/form-input-mask.js'],
  'axis-table-advanced': ['./src/js/table-advanced.js', './src/js/table-editable.js'],
  'custom-styles': './src/scss/custom-styles.scss',
  },    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: (pathData) => {
        if (isProduction && shouldMinify) {
          return 'assets/js/[name].min.js';
        }
        return 'assets/js/[name].js';
      },
      clean: true,
      publicPath: '../'
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: [
                    require('autoprefixer')
                  ]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                implementation: require('sass'),
                api: 'modern',
                sassOptions: {
                  outputStyle: isProduction ? 'compressed' : 'expanded',
                  precision: 6
                }
              }
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: false,
                sources: false
              }
            },
            {
              loader: 'posthtml-loader',
              options: {
                plugins: [
                  require('posthtml-include')({
                    root: path.resolve(__dirname, 'src/html')
                  })
                ]
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: (pathData) => {
          // Handle custom-styles separately
          if (pathData.chunk.name === 'custom-styles') {
            return 'assets/css/custom-styles.css';
          }
          // Use the main getCssFilename for axis-ui
          return getCssFilename();
        }
      }),

      // Copy static assets (images, JS files, etc.)
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/images',
            to: 'assets/images',
            noErrorOnMissing: true
          },
          // Removed copying of src/js to assets/js; JS is now bundled only
          {
            from: 'src/css',
            to: 'assets/css',
            noErrorOnMissing: true
          },
          {
            from: 'src/images/favicon.ico',
            to: 'assets/images/favicon.ico',
            noErrorOnMissing: true
          }
        ]
      }),

      // Generate HTML files from src/html directory only
      ...generateHtmlPlugins()
    ],

    optimization: {
      minimize: isProduction,
      minimizer: [
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true
              }
            ]
          }
        }),
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        })
      ]
    },

    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'dist')
        }
      ],
      compress: true,
      port: 3000,
      open: '/html/index.html',
      hot: true,
      liveReload: true,
      watchFiles: [
        'src/**/*'
      ],
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      },
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: '/html/index.html' },
          { from: /^\/index\.html$/, to: '/html/index.html' }
        ]
      }
    },

  devtool: 'source-map',

    performance: {
      hints: isProduction ? 'warning' : false,
      maxAssetSize: 500000, // 500KB for full build
      maxEntrypointSize: 500000,
      assetFilter: function(assetFilename) {
        // Only show performance warnings for CSS files
        return assetFilename.endsWith('.css');
      }
    },

    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      performance: true // Show performance info
    }
  };

  // Add bundle analyzer if requested
  if (shouldAnalyze) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};