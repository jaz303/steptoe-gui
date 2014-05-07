var T = require('traitor');

module.exports = T.make(['events'], {

	__construct: function() {
		this._items = [];
	},

	at: function(ix) {
		return this._items[ix];
	},

	add: function(item) {
		this._items.push(item);
		this.emit('change:add', {
			type 		: 'change:add',
			item 		: item,
			position	: this._items.length - 1
		});
	},

	remove: function(item) {
		var ix = this.indexOf(item);
		if (ix >= 0) {
			this._items.splice(ix, 1);
			this.emit('change:remove', {
				type 		: 'change:remove',
				item 		: item,
				position	: ix
			});
		}
	},

	indexOf: function(item) {
		return this._items.indexOf(item);
	}

});