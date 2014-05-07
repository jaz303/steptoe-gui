var T = require('traitor');

var EnvFunctionController = module.exports = T.make(['gui:controller'], {

	__construct: function(name, fn) {
		this._name = name;
		this._fn = fn;
		this._createRootWithTemplate('function');
		this.sync();
	},

	sync: function() {
		this._root.find('.name').text(this._name + "()");
	}
	
});
