//sync
// let fs = require('fs');
// console.log('A');
// var result = fs.readFileSync('syntax/sample.txt', 'utf8');
// console.log(result);
// console.log('C');

//async
let fs = require('fs');
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', (err, result)=>{
    console.log(result);
});
console.log('C');