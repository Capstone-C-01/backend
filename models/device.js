var mongoose = require('mongoose');
var Schema = mongoose.Schema;

deviceSchema = new Schema({
    user_id: String,
    device_id: String,
    placement: String,
    lamp_status: String,
    water_level: Number,
    ph_data: Number,
    tds_data: Number
},{
    timestamps: true
});

Device = mongoose.model('Device', deviceSchema);

module.exports = Device;