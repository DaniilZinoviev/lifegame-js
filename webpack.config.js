const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}) => {
  const { MODE: mode = 'development' } = env;
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const getStyleLoaders = () => {
    const styles = ['css-loader'];
    let firstLoader = 'style-loader'
    if (isProd) {
      firstLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: './'
        }
      }
    }
    styles.unshift(firstLoader);
    return styles;
  }

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        template: 'public/index.html'
      })
    ];
    if (isProd) {
      plugins.push(new MiniCssExtractPlugin())
    }
    return plugins;
  }

  return {
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: getStyleLoaders()
        },
        {
          test: /\.s[ac]ss$/,
          use: [...getStyleLoaders(), 'sass-loader']
        }
      ]
    },
    plugins: getPlugins(),
    devServer: {
      open: true
    }
  }
}