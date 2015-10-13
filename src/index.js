import md5hex from 'md5hex'
import doc from 'dynamodb-doc'

const dynamo = new doc.DynamoDB()

const shorten = (input) => md5hex(input)

exports.handler = (event, context) => {

  const operation = event.operation

  switch (operation) {
    case 'shorten':
      const shortenParams = {
        "TableName": "qutto",
        "Item": {
          "shorten": shorten(event.url),
          "url": event.url
        }
      }
      dynamo.putItem(shortenParams, context.done)
      break
    case 'deshorten':
      const deshortenParams = {
        "TableName": "qutto",
        "Key": {
          "shorten": event.shorten
        }
      }
      dynamo.getItem(deshortenParams, context.done)
      break
  }

}
