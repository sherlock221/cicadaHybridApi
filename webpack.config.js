/**
 * Created by abjia on 16-2-8.
 * webpack 配置文件
 * kidsare
 */

var path = require('path');
var webpack = require('webpack');

//公共模块提取插件
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");


var publicName =__dirname.substring(0,__dirname.lastIndexOf("/"));

//项目路径
var projectPath = publicName + "/kidscare";
var libPath = publicName + "/lib";



module.exports = {

    //页面入口文件
    //根据filename的[name]值 会打包多个文件
    entry: {
        "cicadaHybrid"  : "./src/app"
    },

    //开发模式
    //devtool: '#cheap-source-map',
    //devtool: '#eval-source-map',
    devtool: '#cheap-module-source-map',
    //devtool: '#hidden-source-map',
    //devtool: '#cheap-module-eval-source-map',
    debug : true,


    //插件项
    plugins: [
        //提取公共模块到common.js
        //new CommonsChunkPlugin("lib.js")
    ],

    //输出文件配置
    output: {
        //打包文件存放的绝对路径
        path: __dirname + '/dist/',
        //网站运行时的访问路径
        publicPath: "/src/",
        //打包后的文件名
        filename: '[name].js'
    },

    module: {

        //加载器配置
        loaders: [
            //.css 文件使用 style-loader 和 css-loader 来处理
            {test: /\.css$/, loader: 'style-loader!css-loader'},

            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},

            //.js 文件使用 es6处理
            { test: /\.js$/, loader: 'babel-loader',exclude: /(node_modules|bower_components)/,query: {
                presets: ['es2015']
            }}

        ]
    },
    resolve: {
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.scss'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {}
    }
};