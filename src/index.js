import random from 'randomstring'
import doc from 'dynamodb-doc'

const dynamo = new doc.DynamoDB()

const generateShortUrl = () => {
  return new Promise((resolve, reject) => {
    const shortUrl = random.generate(7)
    const params = {
      "TableName": "qutto",
      "Key": {
        "shorten": shortUrl
      }
    }
    dynamo.getItem(params, (err, data) => {
      if (err) {
        reject(err)
      }
      console.log(data)
      resolve(shortUrl)
      if (data.length < 1) {
        resolve(shortUrl)
      }
      generateShortUrl().then((shortUrl) => {
        resolve(shortUrl)
      })
    })
  })
}

const save = (url, shortUrl) => {
  return new Promise((resolve, reject) => {
    const params = {
      "TableName": "qutto",
         "Item": {
           "shorten": shortUrl,
           "url": url
         }
    }
    dynamo.putItem(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve({"shorten": shortUrl})
    })
  })
}

const find = (shortUrl) => {
  return new Promise((resolve, reject) => {
    const params = {
      "TableName": "qutto",
      "Key": {
        "shorten": shortUrl
      }
    }
    dynamo.getItem(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

exports.handler = (event, context) => {

  const operation = event.operation

  switch (operation) {
    case 'shorten':
      generateShortUrl()
        .then((shortUrl) => save(event.url, shortUrl))
        .then((result) => context.succeed(result))
        .catch((error) => context.fail(error))
      break
    case 'deshorten':
      find(event.shorten)
        .then((result) => context.succeed(result))
        .catch((error) => context.fail(error))
      break
  }

}
