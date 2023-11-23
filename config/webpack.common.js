const webpack = require('webpack');
const path = require('path');
const nodePackage = require('../package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const FS = require('fs');
const Luxon = require('luxon');

const Dotenv = require('dotenv-webpack');

const buildEnv = (() => {
  const configPath = './config/';
  const buildEnvPath = 'buildEnv.json';
  if (FS.existsSync(configPath + buildEnvPath)) {
    return require('./' + buildEnvPath);
  } else {
    const defaultBuildEnv = {
      branch: 'DEV'
    };
    FS.writeFileSync(
      configPath + buildEnvPath,
      JSON.stringify(defaultBuildEnv, null, 2)
    );
    return defaultBuildEnv;
  }
})();

const build = (() => {
  const release = FS.readFileSync('version.txt', 'utf8');
  const gitInfo = FS.existsSync('.git')
    ? new GitRevisionPlugin({
        branch: true
      })
    : null;
  const utcNow = Luxon.DateTime.utc();
  const localNow = utcNow.setZone('Canada/Pacific');
  const fullISO = localNow.toString();
  const timestamp =
    fullISO.slice(0, 10) +
    ' ' +
    fullISO.slice(11, 16) +
    ' [' +
    fullISO.slice(23) +
    ']';
  return {
    name: nodePackage.name,
    release: release,
    branch: gitInfo ? gitInfo.branch() : '',
    hash: '#' + (gitInfo ? gitInfo.version() : ''),
    timestamp: timestamp,
    author: nodePackage.author
  };
})();

const entry = {
  index: ['./index.tsx']
};

const rules = [
  {
    test: /\.(js|ts)?$/,
    loader: 'esbuild-loader',
    options: {
      target: 'es2015'
    }
  },
  {
    test: /\.(jsx|tsx)?$/,
    loader: 'esbuild-loader',
    options: {
      loader: 'tsx',
      target: 'es2015'
    }
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
    loader: 'file-loader',
    options: {
      name: 'assets/[name].[ext]'
    }
  }
];

const WEBPACK_PLUGINS = [
  new webpack.BannerPlugin({
    banner: `${build.name} ver[${build.release}${build.hash}] (${build.timestamp}) © ${build.author}`
  }),
  new webpack.DefinePlugin({
    BUILD_VER: JSON.stringify(build),
    BUILD_BRANCH: JSON.stringify(buildEnv.branch)
  })
];

module.exports = {
  bail: true,
  target: ['web', 'es5'],
  context: path.resolve('./src'),
  entry,
  output: {
    filename: '[name].js',
    path: path.resolve('dist')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css', '.html'],
    fallback: {
      fs: false,
      os: false,
      path: false
    }
  },
  module: {
    rules
  },
  plugins: [
    ...WEBPACK_PLUGINS,
    new HtmlWebpackPlugin({
      title: 'index',
      filename: 'index.html',
      template: './index.html',
      chunks: ['index']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../assets',
          to: 'assets',
          globOptions: {
            ignore: ['*.scss', '*.js', '*.json']
          }
        }
      ]
    }),
    new Dotenv({
      systemvars: true,
      path: path.resolve(__dirname, '..', '.env')
    })
  ]
};
