const express = require('express');
const router = express.Router();
const fs = require('fs');
const template = require('../lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const auth = {
    email:"tjdals6695@gmail.com",
    password:"*aksen1090314",
    nickname:"Mandu",
}

router.get('/login', (request, response) => {
    var title = 'WEB - Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
                <form action="/auth/login_process" method="post">
                  <p><input type="text" name="email" placeholder="email"></p>
                  <p><input type="password" name="pwd" placeholder="password"></p>
                  <p>
                    <input type="submit" value="login">
                  </p>
                </form>
              `, '');
    response.send(html);
})

router.post('/login_process', (request, response) => {
    var post = request.body;
    console.log(post);
    var email = post.email;
    var password = post.pwd;
    if(email === auth.email && password === auth.password){
        request.session.isLogin = true;
        request.session.nickname = auth.nickname;
        request.session.save(()=>{
            response.redirect('/');
        });
    }
    else{
        response.send('fail');
    }
})

router.get('/logout', (request, response) => {
    request.session.destroy(()=>{
        response.redirect('/');
    })
})

module.exports = router;