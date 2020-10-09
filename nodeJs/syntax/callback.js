let a = ()=>{
    console.log('A');
};
//a();

let slowfunc = (callback)=>{
    callback();
};
slowfunc(a);