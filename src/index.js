import random from 'randomstring'
import doc from 'dynamodb-doc'

const dynamo = new doc.DynamoDB()

const uid = () => {
  const tmp = random.generate(7)
  const uniqParams = {
    "TableName": "qutto",
    "Key": {
      "shorten": tmp
    }
  }
  dynamo.getItem(uniqParams, (err, data) => {
    console.log(tmp)
    if (err) {
      context.fail(err)
    }
    if (data.length < 1) {
      return tmp
    }
    return uid()
  })
}

exports.handler = (event, context) => {

  const operation = event.operation

  switch (operation) {
    case 'shorten':
      const shortenUrl = uid()
      const shortenParams = {
        "TableName": "qutto",
        "Item": {
          "shorten": shortenUrl,
          "url": event.url
        }
      }
      dynamo.putItem(shortenParams, (err, data) => {
        if (err) {
          context.fail(err)
        }
        context.succeed({"shorten": shortenUrl})
      })
      break
    case 'deshorten':
      const deshortenParams = {
        "TableName": "qutto",
        "Key": {
          "shorten": event.shorten
        }
      }
      dynamo.getItem(deshortenParams, (err, data) => {
        if (err) {
          context.fail(err)
        }
        context.succeed(data)
      })
      break
  }

}
