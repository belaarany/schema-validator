
# Validating request payload and body

[![npm version](https://badge.fury.io/js/goabela-schema-validator.svg)](https://badge.fury.io/js/goabela-schema-validator)

This module can validate the request's payload and body by using a schema JSON file.

## Installation
Install it by using the `npm install` command in the node shell:
```sh
$ npm install goabela-schema-validator --save
```
\
Import the module in your `.js` file:
```js
var schemaValidator = require("goabela-schema-validator")
```

## Features
### schemaValidator.validate()
The `validate` method will do the validation. It will return a promise so you can call `then` and `catch` on the method. Required arguements are the body/payload as an object and the schema object.

First you have to create a schema object. A good solution could be that creating a schema file such as `schema.json`.

After that in the NodeJS file (e.g. under the Express controller), you can call the `validate` method with the schema and the body object.

The prototype of the method:
```js
schemaValidator.validate(body, schema)
  .then(() => {
    // The body is OK
  })
  .catch(err => {
    // The body is invalid
  })
```

The `err` variable will contain an object with all the errors that the body has. You can check the possible errors at the [errors section](#errors).

_For a full example please check the [example section](#example)._

## Schema structure
### Properties
The available properties are the followings:
- `type`: The type of the element. Valid values are `string`, `number`, `float` and `array`. Default is `string`.
- `required`: Wether the given element is required or not. Can be `true` or `false`. Default is `false`.
- `children`: The sub-elements.
- `enum`: The list of the possible values collected into an array.
- `length`: The length settings of the element. Can have a `min` and a `max` value.
- `range`: When the `type` is `number`, you can specify a range by adding `min` and `max`.
- `test`: A regex script that you want to run on the given value.

### Prototype
```js
{
  "username": {
    "type": "string",
    "required": true
  }
}
```

## Errors

## Example

The `schema.json` file:
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
\
The `app.js` file:

## License
[MIT](LICENSE)
