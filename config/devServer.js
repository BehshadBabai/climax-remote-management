const FS = require('fs');
const PATH = require('path');

module.exports = {
  historyApiFallback: true,
  compress: false,
  // contentBase: './dist',
  // disableHostCheck: true,
  /** use following line instead
   * if you don't have pems generated from mkcert
   * https://github.com/FiloSottile/mkcert
   * localhost[-key].pem are not GIT tracked
   */
  // https: true,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  server: {
    type: 'https',
    options: {
      key: FS.readFileSync(PATH.resolve(__dirname, './cert/localhost-key.pem')),
      cert: FS.readFileSync(PATH.resolve(__dirname, './cert/localhost.pem'))
      // ca: FS.readFileSync('C:/Users/User/AppData/Local/mkcert/rootCA.pem')
    }
  },
  hot: true
};
