# Validating request payload and body

This module can validate the request's payload and body by using a schema JSON file.

## Installation
```sh
$ npm install goabela-schema-validator --save
```

## API
```js
var schemaValidator = require("goabela-schema-validator")
```

### schemaValidator.validate()
The `validate` method will do the validation. It will return a promise so you can call `then` and `catch` on the method. Required arguements are the body or the payload as a object and the schema object.

First you have to create the schema file such as `schema.json`. Then in the NodeJS file under the Express controller, you can call the `validate` method and pass the `body` (e.g. `req.body`) object. See the prototype below.

```js
schemaValidator.validate({schema}, {body})
  .then(() => {
    // The body is OK
  })
  .catch(err => {
    // The body is invalid
  })
```

The `err` variable will contain an object with all the errors that the body has.

## Errors

## Examples

```json
{
  "userId": {
    "type": "string",
    "required": true
  },
  "userRole": {
    "type": "string",
    "enum": ["owner", "writer"]
  }
}
```
