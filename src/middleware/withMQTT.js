export default function withMQTT(mqttClient) {
  return (req, res, next) => {
    req.mqttClient = mqttClient;
    next();
  };
}
