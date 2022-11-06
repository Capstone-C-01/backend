var mongoose = require('mongoose');
var Schema = mongoose.Schema;

imagegallerySchema = new Schema({
    user_id: String,
    device_id: String,
    plant_image:
    {
        data: Buffer,
        contentType: String,
        timestamps: true
    }
    
});

ImageGallery = mongoose.model('ImageGallery', imagegallerySchema);

module.exports = ImageGallery;