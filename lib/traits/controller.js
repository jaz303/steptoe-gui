var T = require('traitor');

T.register('gui:controller', {

	requires: ['events'],

	prepare: function(def) {

		

	},

	apply: function(def) {

		def.method('getRoot', function() {
			return this._root;
		});

		def.method('_setRoot', function(root) {
			this._root = root;
		});

		def.method('_createRootWithTemplate', function(tpl) {
			this._root = this._getTemplate(tpl);
			this._root[0].controller = this;
		});

		def.method('_getTemplate', function(tpl) {
			return $('#templates [data-template-id=' + tpl + '] > :eq(0)').clone();
		});

	}

});