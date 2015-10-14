import md5hex from 'md5hex'
import doc from 'dynamodb-doc'

const dynamo = new doc.DynamoDB()

const shorten = (input) => md5hex(input)

exports.handler = (event, context) => {

  const operation = event.operation

  switch (operation) {
    case 'shorten':
      const shortenUrl = shorten(event.url)
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
