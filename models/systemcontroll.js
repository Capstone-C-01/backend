var mongoose = require('mongoose');
var Schema = mongoose.Schema;

systemcontrollSchema = new Schema({
    user_id: String,
    device_id: String,
    lamp_status: String,
    ph_min: Number,
    ph_max: Number,
    tds_min: Number,
    tds_max: Number,
    spray_interval: Date,
    spray_duration: Date
},{
    timestamps: true
});

SystemControll = mongoose.model('SystemControll', systemcontrollSchema);

module.exports = SystemControll;