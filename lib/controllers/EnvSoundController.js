var T = require('traitor');
var audioContext = require('audio-context');

var EnvSoundController = module.exports = T.make(['gui:controller'], {

	__construct: function(name, sound) {

		this._name = name;
		this._sound = sound;
		this._createRootWithTemplate('sound');

		//
		// Playback

		var source = null;

		function stop() {
			if (source) {
				source.stop(0);
				source = null;
			}
		}

		this._root.find('button.play').click(function() {

			stop();

			var buffer = this._sound.getBuffer();
			if (buffer) {
				source = audioContext.createBufferSource();
				source.buffer = buffer;
				source.connect(audioContext.destination);
				source.start(0);
			}

		}.bind(this));

		this._root.find('button.stop').click(stop);

		//
		// DnD

		var preview = this._preview = this._root.find('.preview');

		preview[0].addEventListener('dragenter', function(evt) {
			evt.preventDefault();
			preview.addClass('drop-active');
		});

		preview[0].addEventListener('dragover', function(evt) {
			evt.preventDefault();
		});

		preview[0].addEventListener('dragleave', function() {
			preview.removeClass('drop-active');
		});

		preview[0].addEventListener('drop', function(evt) {
			preview.removeClass('drop-active');

			evt.preventDefault();

			var dt = evt.dataTransfer;

			var files = dt.files;
			if (files.length != 1) {
				console.error("only single files are supported!");
				return;
			}

			var reader = new FileReader();
			reader.onloadend = function(evt) {
				if (reader.result) {
					audioContext.decodeAudioData(reader.result, function(buffer) {
						this._sound._setBuffer(buffer); // FIXME: should just re-set in env. sounds want to be immutable.
						this._sync();
					}.bind(this), function(e) {
						console.error("Error decoding buffer", e);
					});
				}
			}.bind(this);

			reader.readAsArrayBuffer(files[0]);

			return false;

		}.bind(this));

		this._sync();

	},

	_sync: function() {
		
		this._root.find('.name').text(this._name);

		var buffer 	= this._sound.getBuffer(),
			width 	= this._preview.width(),
			height 	= this._preview.height(),
			canvas 	= this._preview[0];

		canvas.width = width;
		canvas.height = height;

		var ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, width, height);

		if (!buffer) {
			return;
		}

		var data 		= buffer.getChannelData(0),
			step 		= data.length / width,
			halfHeight	= height / 2;
		
		ctx.strokeStyle = 'white';
		ctx.lineWidth 	= 1;

		ctx.save();
		ctx.translate(0, height / 2);
		ctx.beginPath();
		ctx.moveTo(0, 0);

		for (var i = 0; i < width; ++i) {
			var v = data[Math.floor(step * i)] * halfHeight;
			ctx.lineTo(i, v);
		}

		ctx.stroke();
		ctx.restore();

	}

});
