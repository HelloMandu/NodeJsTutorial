let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
var template = require(`./lib/template.js`);
let path = require('path');
let sanitizeHtml = require('sanitize-html');
  
let app = http.createServer((request,response)=>{
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', (error, filelist)=>{
          let title = 'Welcome';
          let description = 'Hello, Node.js';
          let list = template.list(filelist);
          let html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        });
      } 
      else {
        fs.readdir('./data', (error, filelist)=>{
          let filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', (err, description)=>{
            let title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            let list = template.list(filelist);
            let html = template.HTML(title, list, 
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              `<a href="/create">create</a> 
              <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`);
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    }
    else if(pathname === '/create'){
      fs.readdir('./data', (error, filelist)=>{
        let title = 'WEB - create';
        let list = template.list(filelist);
        let html = template.HTML(title, list, `
        <form action="http://localhost:3000/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>`, ``);
        response.writeHead(200);
        response.end(html);
      });
    }
    else if(pathname === '/create_process'){
      let body = '';
      request.on('data', (data)=>{
          body += data;
      }).on('end', ()=>{
          let post = qs.parse(body);
          let title = post.title;
          let description = post.description
          fs.writeFile(`data/${title}`, description, 'utf8', (err)=>{
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
      });
    }
    else if (pathname === '/update'){
      fs.readdir('./data', (error, filelist)=>{
        let filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (err, description)=>{
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
    else if(pathname === '/update_process'){
      let body = '';
      request.on('data', (data)=>{
          body += data;
      }).on('end', ()=>{
          let post = qs.parse(body);
          let id = post.id;
          let title = post.title;
          let description = post.description
          fs.rename(`data/${id}`, `data/${title}`, (err)=>{
            fs.writeFile(`data/${title}`, description, 'utf8', (err)=>{
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            });
          });
      });
    }
    else if(pathname === '/delete_process'){
      let body = '';
      request.on('data', (data)=>{
          body += data;
      }).on('end', ()=>{
          let post = qs.parse(body);
          let filteredId = path.parse(post.id).base;
          fs.unlink(`data/${filteredId}`, (err)=>{
            response.writeHead(302, {Location: `/`});
            response.end();
          });
      });
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});

app.listen(3000);