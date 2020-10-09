let template = require(`./template`);
let conn = require(`./db`);
let url = require('url');
let qs = require('querystring');

exports.home = function (request, response) {
    conn.query('SELECT *FROM topic', (error, topics) => {
        let title = 'Welcome';
        let description = 'Hello, Node.js';
        let list = template.list(topics);
        let html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
    });
}
exports.page = function (request, response) {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    conn.query('SELECT *FROM topic', (error, topics) => {
        if (error) { throw error; }
        conn.query(`SELECT *FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id = ?`, [queryData.id], (error2, topic) => {
            if (error2) { throw error; }
            let title = topic[0].title;
            let description = topic[0].description;
            let list = template.list(topics);
            let html = template.HTML(title, list,
                `<h2>${title}</h2>
            ${description}
            <p>by ${topic[0].name}</p>`,
                `<a href="/create">create</a> 
                  <a href="/update?id=${queryData.id}">update</a>
                  <form action="delete_process" method="post">
                      <input type="hidden" name="id" value="${queryData.id}">
                      <input type="submit" value="delete">
                    </form>`);
            response.writeHead(200);
            response.end(html);
        });
    });
}
exports.create = function (request, response) {
    conn.query('SELECT *FROM topic', (error, topics) => {
        if (error) { throw error; }
        conn.query('SELECT *FROM author', (error2, authors) => {
            if (error2) { throw error2; }
            let title = 'WEB - create';
            let list = template.list(topics);
            let authorList = template.authorSelect(authors);
            let html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            ${authorList}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
                `<a href="/create">create</a>`, ``);
            response.writeHead(200);
            response.end(html);
        })
    });
}
exports.create_process = function (request, response) {
    let body = '';
    request.on('data', (data) => {
        body += data;
    }).on('end', () => {
        let post = qs.parse(body);
        conn.query(
            `INSERT INTO topic (title, description, created, author_id) 
        VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author],
            (error, result) => {
                if (error) { throw error; }
                response.writeHead(302, { Location: `/?id=${result.insertId}` });
                response.end();
            });
    });
}
exports.update = function (request, response) {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    conn.query(`SELECT *FROM topic`, (error, topics) => {
        if (error) { throw error; }
        conn.query(`SELECT *FROM topic WHERE id = ?`, [queryData.id], (error2, topic) => {
            if (error2) { throw error2; }
            conn.query(`SELECT *FROM author`, (error3, authors) => {
                if (error3) { throw error3; }
                let list = template.list(topics);
                let authorList = template.authorSelect(authors, topic[0].author_id);
                let html = template.HTML(topic[0].title, list,
                    `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                ${authorList}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}
exports.update_process = function(request, response){
    let body = '';
    request.on('data', (data) => {
      body += data;
    }).on('end', () => {
      let post = qs.parse(body);
      let id = post.id;
      let title = post.title;
      let description = post.description;
      let author = post.author;
      conn.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
        [title, description, author, id],
        (error, result) => {
          if (error) { throw error; }
          response.writeHead(302, { Location: `/?id=${id}` });
          response.end();
        });
    });
}
exports.delete_process = function(request, response){
    let body = '';
    request.on('data', (data) => {
      body += data;
    }).on('end', () => {
      let post = qs.parse(body);
      conn.query('DELETE FROM topic WHERE id=?',
        [post.id],
        (error, result) => {
          if (error) { throw error; }
          response.writeHead(302, { Location: `/` });
          response.end();
        })
    });
}