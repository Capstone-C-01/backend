import * as mqtt from "mqtt";
import { addSensorsData } from "./onReceiveMessage";

export default function setupMQTT(topics) {
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}_dev_be`;
  const mqttConnectUrl = `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;

  const mqttClient = mqtt.connect(mqttConnectUrl, {
    clientId,
    clean: false,
    connectTimeout: 4000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,
    protocolId: "MQIsdp",
    protocolVersion: 3,
    debug: true,
  });

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT Server");
    mqttClient.subscribe([...topics], { qos: 0 }, (err, granted) => {
      if (err) console.log(err);
      console.log(granted, "granted");
    });
  });

  mqttClient.on("disconnect", () => {
    mqttClient.reconnect();
  });

  mqttClient.on("error", (err) => {
    console.log("ERROR in MQTT: ", err);
  });

  mqttClient.on("message", (topic, payload) => {
    if (topic.includes("sensors")) {
      const device_id = topic.match(/esp32_[\d]+/g)[0];

      switch (topic) {
        case `dev/${device_id}/sensors`: {
          try {
            const parsedPayload = payload.toString().split(",");
            const sensorsJson = {
              user_id: "aldoarya", // Temp
              device_id: device_id, // Temp
              lamp_status: "on", // Temp
              water_level: 75, // Temp
              ph_data: parsedPayload[0],
              tds_data: parsedPayload[1],
            };
            addSensorsData(mqttClient, sensorsJson);
          } catch (error) {
            console.log(error);
          }
          break;
        }
        default:
          console.log(topic, payload.toString());
      }
    }
  });

  return mqttClient;
}
