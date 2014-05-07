var T = require('traitor');

function Button(el, callback) {

	el.on('click', function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		callback();
	});

}

var Toolbar = module.exports = T.make(['events'], {

	__construct: function(el) {
		this._root = el;
	},

	addButton: function(opts) {
		
		var el = $('<a href="#" />');

		if ('className' in opts) {
			el.addClass(opts.className);
		}

		if ('icon' in opts) {
			el.append("<i class='fa fa-" + opts.icon + "'></i>");
		}

		if ('title' in opts) {
			el.append(" <span class='title'>" + opts.title + "</span>");
		}

		this._root.appendChild(el[0]);

		return new Button(el, opts.callback);

	}

});
