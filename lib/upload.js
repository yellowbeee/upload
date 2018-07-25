

/** 
 *  上传
 */

const axios = require('axios')


var upload = function(options) {
  
  // 上传地址
  let upload_url = options.url;
  // 上传文件
  let upload_file = options.file;
  // 分包数
  let package_number = options.packages ;
  // 要传的数据
  let data = options.data || {};

  let { size, name, lastModified, type } = upload_file;
  

  // 分包大小
  let package_size = package_number? package_number* 1024 * 1024 : size;


  // 总份
  let chunks = Math.ceil(size/package_size);

  // // 当前次数
  let chunk = 0;

  

  // // 开始
  var begin = async function() {
    var start = chunk * package_size,
        end = start + package_size;
        
    var currentPacket = upload_file.slice(start, end);

    let formData = new FormData();

    // 名称
    formData.append('name',name);
    // 类型
    formData.append('type',type);
    // 大小
    formData.append('size',size);
    // 最后修改时间
    formData.append('lastModifiedDate',lastModified);
    // 总份
    formData.append('chunks',chunks);
    // 当前第几份
    formData.append('chunk',chunk);
    // 文件
    formData.append('file',currentPacket);

    // 要传输的post数据
    for(let i in data) {
      formData.append(i,data[i]);
    }

    // 开始传输
    let config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }

    let res = (await axios.post(upload_url,formData,config)).data

    emit('data',{
      chunk,
      chunks,
      server: res
    },payload => {
      if(payload) {
        if(payload.type == 'retry') {
          setTimeout(()=>{ begin() }, 2000);
          return;
        }
      }

      chunk++;

      if(chunk>=chunks) {
        emit('end');
        return;
      }
      begin();
    });

   
  }

  // list
  var event = {}

  var on = function(key,fn) {
    if(!event[key]) event[key] = []

    event[key].push(fn);
  }

  var emit = function() {
    // 拿第一个参
    var key = Array.prototype.shift.call(arguments);

    var msg = event[key];
    
    if(!msg || msg.length == 0) return false;

    for(var i = 0 ; i<msg.length;i++) {
      msg[i].apply(this,arguments);
    }
  }

  return {
    on,
    emit,
    begin
  }
};


module.exports = upload;