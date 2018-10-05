const { join } = require('path')
const { ts } = require('webpack-config-typescript')

let config = {
  mode: 'development',
  entry: join(__dirname, 'src/index.ts'),
  target: 'node',
  output: {
    filename: 'dist/index.js',
    libraryTarget: 'commonjs',
    path: join(__dirname)
  }
}
 
config = ts(config)
 
module.exports = config 
