import md5hex from 'md5hex'
import doc from 'dynamodb-doc'

const dynamo = new doc.DynamoDB()

const shorten = (input) => md5hex(input)

exports.handler = (event, context) => {

  const dynamoCallback = (err, data) => {
    if (err) {
      context.fail(err)
    }
    context.succeed(data)
  }
  const operation = event.operation

  switch (operation) {
    case 'shorten':
      const shortenParams = {
        "TableName": "qutto",
        "Item": {
          "shorten": shorten(event.url),
          "url": event.url
        },
        "ReturnValues": "ALL_OLD"
      }
      dynamo.putItem(shortenParams, dynamoCallback)
      break
    case 'deshorten':
      const deshortenParams = {
        "TableName": "qutto",
        "Key": {
          "shorten": event.shorten
        }
      }
      dynamo.getItem(deshortenParams, dynamoCallback)
      break
  }

}
