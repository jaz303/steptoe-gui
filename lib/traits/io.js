var T = require('traitor');

T.register('gui:io', {

	requires: ['events'],

	prepare: function(def) {

	},

	apply: function(def) {

		def.method('destroy', function() {

			if (this._addedFunctions) {
				this._addedFunctions.forEach(function(name) {
				    this.env.undef(name);
				}, this);
			}

			this._teardown();

			this.emit('destroyed');
		
		});

		def.method('_teardown', function() {

		});

		def.method('_addFunction', function(name, fn) {

			if (!this._addedFunctions) {
				this._addedFunctions = [];
			}

			fn.locked = true;
			this.env.def(name, fn);
			
			this._addedFunctions.push(name);

		});

	}

});