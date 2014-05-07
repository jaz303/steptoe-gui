var Sound = module.exports = function() {
	this._buffer = null;
}

Sound.prototype.getBuffer = function() {
	return this._buffer;
}

Sound.prototype._setBuffer = function(buffer) {
	this._buffer = buffer;
}