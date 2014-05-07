module.exports = {
    name        : 'Canvas',
    icon        : 'picture-o',
    className   : 'io-canvas',
    create      : function(env) { return new Canvas(env); }
};

var T = require('traitor');

var Canvas = T.make(['events', 'gui:io'], {

    __construct: function(env) {

        this.env = env;
        
        this.el = document.createElement('div');
        this.el.className = 'io-instance io-canvas';
        this.el.ioInstance = this;

        this.el.innerHTML = "<a href='#' class='destroy'><i class='fa fa-minus-circle'></i></a>";

        this._addFunction('clear', function() {

        });

        this._addFunction('moveTo', function() {

        });

        this._addFunction('lineTo', function() {

        });

        this._addFunction('circle', function() {

        });

        this._addFunction('square', function() {

        });

        this._addFunction('rectangle', function() {

        });

    }

});
