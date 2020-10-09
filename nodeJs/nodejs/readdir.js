let testFolder = './data';
let fs = require('fs');

fs.readdir(testFolder, (error, filelist)=>{
    console.log(filelist);
});