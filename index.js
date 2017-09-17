/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.accept = function(req, res) {
  const topic = req.body.topic;
  if (!topic) {
    return res.status(200).send('No topic');
  }

  let data = req.body.data;
  if (!data) {
    return res.status(200).send('No data');
  }
  if (typeof(data) != 'string') {
      data = JSON.stringify(data);
  }
  const attributes = req.body.attributes || {};
  
  publishMessage(topic, data, attributes);
  
  return res.status(200).send('Success');
};

const PubSub = require(`@google-cloud/pubsub`);

function publishMessage(topic, data, attributes) {
  console.log(`topic: ${topic} data: ${data} attributes: ${JSON.stringify(attributes)}`);
  
  const pubsub = PubSub();

  return pubsub.topic(topic).publisher().publish(Buffer.from(data), attributes)
    .then(() => {
      console.log(`Message published.`);
      return true;
    })
    .catch(err => {
      console.error(err);
      return false;
    });
}