// TODO: these should not be mutable
var Image = module.exports = function() {
	this._image = null;
}

Image.prototype.getImage = function() {
	return this._image;
}

Image.prototype._setImage = function(image) {
	this._image = image;
}