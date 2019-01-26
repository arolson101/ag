module.exports = {
  // stats: 'minimal',
  devServer: {
    // stats: 'minimal',
    historyApiFallback: true,
  },
  externals: {
    'electron-devtools-installer': 'commonjs electron-devtools-installer',
    'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
    sqlite3: 'commonjs sqlite3',
  },
}