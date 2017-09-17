/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.accept = function(req, res) {
  let topicName = req.body.topicName || 'talk';
  let data = req.body;
  
  exports.publishMessage(topicName, data);
  
  res.status(200).send('Success');
};

const PubSub = require(`@google-cloud/pubsub`);

exports.publishMessage = function(topicName, data) {
  console.log(`topic: ${topicName} data: ${data}`)
  
  const pubsub = PubSub();

  const topic = pubsub.topic(topicName);
  const publisher = topic.publisher();
  
  const dataBuffer = Buffer.from(JSON.stringify(data));
  return publisher.publish(dataBuffer)
    .then((results) => {
      const messageId = results[0];

      console.log(`Message ${messageId} published.`);

      return messageId;
    });
}