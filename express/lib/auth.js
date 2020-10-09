module.exports = {
    stateUI:function(request){
        if(request.session.isLogin){
            return `${request.session.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return '<a href="/auth/login">login</a>';
      }
}