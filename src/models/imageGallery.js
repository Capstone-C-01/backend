import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageGallerySchema = new Schema(
  {
    user_id: {
      type: String,
    },
    device_id: {
      type: String,
    },
    plant_image: {
      // type: String,
      // required: true,
      data: Buffer,
      contentType: "imgage/png",
    },
    uploadedTime : Number,
  },
  { timestamps: true }
);

const ImageGallery = mongoose.model("ImageGallery", imageGallerySchema);

export default ImageGallery;