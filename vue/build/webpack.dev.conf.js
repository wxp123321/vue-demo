'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)


var  mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '4265051',
  port:'3306',
  database : 'xp'
});
connection.connect();


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
//var appData = require('../data.json');
//var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/api/login', urlencodedParser, function (req,res) {
  let username = req.body.username;
  let pwd = req.body.password;
  let sql = 'SELECT * FROM user';
  connection.query(sql, function (err,result) {
    for(var i = 0;i<result.length;i++){
      if(username == result[i].username){
        if(pwd == result[i].pwd){
          res.json({
            data:{
              code:1,
              uid:result[i].id
            }
          })
        }
      }
    }
  });
});

app.post('/api/getUserInfo',urlencodedParser, function (req,res) {
  let uid = req.body.uid;
  let sql  = 'SELECT name FROM user WHERE id="1"';

  connection.query(sql, function (err,result) {
    res.json({
      data:{
        code:1,
        userInfo:{
          name:result[0].name
        }
      }
    });
  });
});

app.post('/api/getFiles',function(req,res){
  var sql = 'SELECT name FROM file';

  connection.query(sql, function (err,result) {
    if(err){
      console.log(err);
    }
    let name = [];
    for(var i = 0;i < result.length;i++){
      name[i] = result[i].name;
    }
    res.json({
      data:{
        files:name
      }
    });
  })
});

app.post('/api/uploading', multipartMiddleware, function (req,res) {
  console.log(req.files);
  var sql = 'SELECT name FROM file WHERE name=?';
  var sqlParams = [req.files.uploadfile.originalFilename];
  connection.query(sql,sqlParams, function (err,result) {
    if(err){
      console.log(err);
    }
    console.log(result);
    if(result.length){
      res.json({
        data:{
          code:0
        }
      });
    }else{
      var newsql = 'INSERT INTO file(name,hashName) VALUES(?,?)';
      var addSqlParams = [req.files.uploadfile.originalFilename,req.files.uploadfile.path];
      connection.query(newsql,addSqlParams,function(err,result){
        if(err){
          console.log(err);
        }
        res.json({
          data:{
            code:1
          }
        });
      });
    }
  })
});

app.get('/api/download',urlencodedParser, function (req,res) {
  console.log(req.query);
  var filename = req.query.filename;
  var sqlParams = [filename];
  var sql = 'SELECT hashName FROM file WHERE name=?';
  connection.query(sql,sqlParams, function (err,result) {
    console.log(result);
    var path = result[0].hashName;
    res.download(path);
  });
});

let pNumber = 0;
io.on('connection', function (socket) {
  pNumber++;
  console.log('一名用户进入,当前人数'+pNumber);

  socket.on('disconnect', function () {
    pNumber--;
    console.log("一名用户离开,当前人数"+pNumber);
  })

  socket.on('message', function (obj) {
    console.log(obj);
    let id = obj.uid;
    let message = obj.message;
    let sql = 'SELECT name FROM user WHERE id='+id;
    connection.query(sql, function (err,result) {
      let newobj = {
        name:result[0].name,
        message:message,
        uid:id
      }
      io.emit('message',newobj);
    });
  })
});

var server = http.listen(3000,function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
