import * as mqtt from "mqtt";

export default function setupMQTT(topics) {
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  const mqttConnectUrl = `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;

  const mqttClient = mqtt.connect(mqttConnectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,
  });

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT Server");
    mqttClient.subscribe([...topics], () => {
      console.log(`Subscribe to topic '${topics}'`);
    });
  });

  return mqttClient;
}
