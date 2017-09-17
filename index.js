const PubSub = require(`@google-cloud/pubsub`);

exports.acceptHttp = function(req, res) {
  let data
  if (typeof(req.body) === 'string') {
    data = Buffer.from(req.body)
  } else if (Buffer.isBuffer(req.body)) {
    data = req.body
  } else {
    data = Buffer.from('')
  }
  
  PubSub().topic('receive-http')
    .publisher()
    .publish(data, {
      protocol: req.protocol,
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      headers: JSON.stringify(req.headers),
      body: JSON.stringify(req.body)
    })
    .catch(err => console.error(err))
  
  return res.status(200).end();
}

exports.acceptPubsub = function(event, callback) {
  if (Buffer.isBuffer(event.data.data)) {
    console.log(`data: '<Buffer>' attributes: ${JSON.stringify(event.data.attributes)}`)
  } else {
    console.log(`data: ${Buffer.from(event.data.data, 'base64').toString()} attributes: ${JSON.stringify(event.data.attributes)}`)
  }
  callback()
}