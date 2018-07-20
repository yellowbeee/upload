# @dlophin/upload

> 支持上传文件，分片上传功能

## 安装

``` bash
npm install -D @dlophin/upload
```
## 初始化
``` bash
 
var upload = require('@dlophin/upload');

var __upload = upload({
  // file对象
  file: '',
  // 把文件拆分成多大，以M为单位（不传或者设定值大于文件 当作不拆分处理）
  packages: 1,
  // 上传的接口（使用post，要使用get可以把数据拼接在url上，post数据请使用data属性）
  url: '',
  // post数据
  data: {}
})

```

## 使用
``` bash

# 监听每次分包
__upload.on('data',(data,next)=>{

  // data 返回格式
  // { chunk,chunks,server }
  // chunk 当前执行第几个包  chunks 总包数 server服务器端回调值
  
  // next @function
  // 把控制权返回 如果不使用next() 无法继续传一个包
  // next({type:'retry'}) 当服务端报错时  可以再次上传当前包

  // do something
})

# 监听结束
__upload.on('end',()=>{

  // do something
})

# 开始上传
__upload.begin();

```

## 注意

监听函数需要在上传函数之前执行，不然无法监听


