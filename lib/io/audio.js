module.exports = {
    name        : 'Audio',
    icon        : 'volume-up',
    className   : 'io-audio',
    create      : function(env) { return new Audio(env); }
};

var T = require('traitor');

var Audio = T.make(['events', 'gui:io'], {

    __construct: function(env) {

        this.env = env;
        
        this.el = document.createElement('div');
        this.el.className = 'io-instance io-audio';
        this.el.ioInstance = this;

        this.el.innerHTML = "<a href='#' class='destroy'><i class='fa fa-minus-circle'></i></a>";

        this._addFunction('play', function() {

        });

    }

});
