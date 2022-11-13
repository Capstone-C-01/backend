import DeviceSensor from "../models/deviceSensor";

export const addSensorsData = (mqttClient, data) => {
  const newDeviceSensor = new DeviceSensor({
    user_id: data.user_id,
    device_id: data.device_id,
    lamp_status: data.lamp_status,
    water_level: data.water_level,
    ph_data: data.ph_data,
    tds_data: data.tds_data,
  });

  newDeviceSensor.save(function (err) {
    if (err) {
      mqttClient.publish(
        `dev/${data.device_id}/sensors/response`,
        `Fail to add sensors data. Reason: ${err.message}`
      );
    } else mqttClient.publish(`dev/${data.device_id}/sensors/response`, "Succesfully added Sensors data");
  });
};
