var T = require('traitor');

var EnvForeignFunctionController = module.exports = T.make(['gui:controller'], {

	__construct: function(name, fn) {
		this._name = name;
		this._fn = fn;
		this._createRootWithTemplate('foreign-function');
		this.sync();
	},

	sync: function() {
		this._root.find('.name').text(this._name + "()");
	}

});
