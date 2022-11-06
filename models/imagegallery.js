import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const imagegallerySchema = new Schema({
  user_id: String,
  device_id: String,
  plant_image: {
    data: Buffer,
    contentType: String,
    timestamps: true,
  },
});

const ImageGallery = mongoose.model("ImageGallery", imagegallerySchema);

module.exports = ImageGallery;
