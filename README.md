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

### `schemaValidator.validate()`
The `validate` method will do the validation. It will return a promise so you can call `then` and `catch` on the method. Required arguements are the body/payload as an object and the schema object.

First you have to create a schema object. A good solution could be that creating a schema file such as `schema.json`.

After that in the NodeJS file (e.g. under the Express controller), you can call the `validate` method with the schema and the body object.

The prototype of the method:
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
