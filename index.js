/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.acceptHttp = function(req, res) {
  publishMessage('receive-http', req.body, {
    protocol: req.protocol,
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    headers: req.headers
  })
  return res.status(200).end();
};

const PubSub = require(`@google-cloud/pubsub`);

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