var mongoose = require('mongoose');
var Schema = mongoose.Schema;

plantSchema = new Schema({
    user_id: String,
    device_id: String,
    plant_id: String,
    plant_name: String,
    date_planted: Date,
    plant_count: Number
})

Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;