const PubSub = require(`@google-cloud/pubsub`);

exports.acceptHttp = function(req, res) {
  PubSub().topic('receive-http')
    .publisher()
    .publish(
      Buffer.from(JSON.stringify({
        body: req.body,
        headers: req.headers,
        query: req.query
      })),
      {
        protocol: req.protocol,
        method: req.method,
        contentType: req.get('content-type')
      })
    .catch(err => console.error(err))
  
  return res.status(200).end();
}

exports.acceptPubsub = function(event, callback) {
  console.log(`data: ${Buffer.from(event.data.data, 'base64').toString()} attributes: ${JSON.stringify(event.data.attributes)}`)
  callback()
}