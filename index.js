const PubSub = require(`@google-cloud/pubsub`);

exports.acceptHttp = function(req, res) {
  publishMessage('receive-http', req.body, {
    protocol: req.protocol,
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    headers: req.headers
  })
  return res.status(200).end();
}

exports.acceptPubsub = function(event, callback) {
  console.log(Buffer.from(event.data.data, 'base64').toString())
  console.log(event.data.attributes)
  callback()
}

function publishMessage(topic, data, attributes) {
  if (!Buffer.isBuffer(data)) {
    if (typeof(data) === 'string') {
      data = Buffer.from(data)
    } else {
      data = Buffer.from(JSON.stringify(data))
    }
  }
  return PubSub().topic(topic)
    .publisher()
    .publish(data, attributes)
    .catch(err => console.error(err))
}