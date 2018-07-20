




import upload from '../lib/upload'



var __upload = upload({
  url: 'sss',
  file: 'sdsf',
  packages: 2
})

__upload.on('data',(data,next)=>{
  console.log(data);
  next();
})

__upload.on('end',()=>{
  console.log('结束');
})

__upload.begin();
