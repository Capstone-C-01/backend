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
    switch (topic) {
      case "/dev/sensors/add":
        try {
          const payloadParsed = JSON.parse(payload.toString());
          addSensorsData(mqttClient, payloadParsed);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        console.log(topic, payload.toString());
    }
  });

  return mqttClient;
}
