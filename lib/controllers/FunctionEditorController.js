var T = require('traitor');

var FunctionEditorController = module.exports = T.make(['gui:controller'], {

	__construct: function(functionInstance) {
		
		var fn = functionInstance.fn;
		var env = fn.env;

		this._createRootWithTemplate('function-editor');
		
	},

	sync: function() {
		
	}

});
