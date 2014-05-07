var T = require('traitor');

var EnvImageController = module.exports = T.make(['gui:controller'], {

	__construct: function(name, image) {
		
		this._name = name;
		this._image = image;
		this._createRootWithTemplate('image');

		var $preview = this._root.find('.preview');

		$preview[0].addEventListener('dragenter', function(evt) {
			evt.preventDefault();
			$preview.addClass('drop-active');
		});

		$preview[0].addEventListener('dragover', function(evt) {
			evt.preventDefault();
		});

		$preview[0].addEventListener('dragleave', function() {
			$preview.removeClass('drop-active');
		});

		$preview[0].addEventListener('drop', function(evt) {
			$preview.removeClass('drop-active');

			evt.preventDefault();

			var dt = evt.dataTransfer;

			var files = dt.files;
			if (files.length != 1) {
				console.error("only single files are supported!");
				return;
			}

			var img = new Image();
			img.src = window.URL.createObjectURL(files[0]);

			this._image._setImage(img); // FIXME: should just re-assign the image to the environment
			$preview.css({backgroundImage: 'url(' + img.src + ')' });

			return false;

		}.bind(this));

		this.sync();

	},

	sync: function() {
		this._root.find('.name').text(this._name);
	}

});
