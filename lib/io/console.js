module.exports = {
    name        : 'Console',
    icon        : 'terminal',
    className   : 'io-console',
    create      : function(env) { return new Console(env); }
};

var T = require('traitor');

var Console = T.make(['events', 'gui:io'], {

    __construct: function(env) {

        this.env = env;
        
        this.el = document.createElement('div');
        this.el.className = 'io-instance io-console';
        this.el.ioInstance = this;

        this.el.innerHTML = "<a href='#' class='destroy'><i class='fa fa-minus-circle'></i></a>";

        this._addFunction('print', function() {

        });
    
    }

});
