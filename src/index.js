import md5hex from 'md5hex'
import doc from 'dynamodb-doc'

const dynamo = new doc.DynamoDB()

const shorten = (input) => md5hex(input)

exports.handler((event, context) => {

  const operation = event.operation

  let params = {
    "TableName": "qutto",
    "Item": {
      "url": event.url,
    }
  }

  switch (operation) {
    case 'shorten':
      params.Item.shorten = shorten(event.url)
      dynamo.putItem(params, context.done)
      break
    case 'deshorten':
      dynamo.getItem(params, context.done)
      break
  }

})
