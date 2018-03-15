module.exports.validate = function(body, schema) {
	return validate(body, schema)
}

function validate(body, schema) {
	return new Promise((resolve, reject) => {
		

		// Checking if the `schema` is set
		if (schema == null || typeof schema != "object") {
			reject({
				"internalIssue": "schemaNotSet"
			})
		}

		// Checking if the schema is not empty so `body` should have value
		if (Object.keys(schema).length > 0) {
			// Checking if the `body` is set
			if (body == null || Object.keys(body).length <= 0) {
				reject({
					"internalIssue": "bodyNotSet"
				})
			}
		}
		// If so then body should be empty as well
		else {
			if (Object.keys(body).length > 0) {
				reject({
					"internalIssue": "bodyNotEmpty"
				})
			}
			else {
				reject(null)
			}
		}

		// As the next-step we are going to loop through all the keys and children
		// keys in order to check if is there any missing keys
		let missingKeys = lookupMissingKeys(body, schema)
		let invalidKeys = lookupInvalidKeys(body, schema)
		// Returning the missing keys and/or the invalid keys as error
		if (missingKeys.length > 0 || invalidKeys.length > 0) {
			let tempErr = {}

			if (missingKeys.length > 0) tempErr.missingKeys = missingKeys
			if (invalidKeys.length > 0) tempErr.invalidKeys = invalidKeys
			
			reject(tempErr)
		}

		// Now checking the types
		let invalidTypes = lookupInvalidTypes(body, schema)
		if (invalidTypes.length > 0) {
			reject({invalidTypes})
		}

		// Looping again to check the enum, length, range and test pattern
		let optionalPropertiesIssues = lookupOptionalProperties(body, schema)
		if (Object.keys(optionalPropertiesIssues).length > 0) {
			reject(optionalPropertiesIssues)
		}

		resolve()
	})
}

function lookupMissingKeys(body, schema, prevKey = null, missingKeys = []) {

	prevKey = prevKey == null ? "" : (prevKey + ".")
	let currKey = null

	for (let key in schema) {

		currKey = prevKey + key

		// Checking wether it is required
		if (schema[key].required == true) {

			// Checking wether it is in the body
			if (key in body == false) {
				missingKeys.push(currKey)
			}
		}

		// Checking if has children
		if ("children" in schema[key] && body[key]) {

			missingKeys = lookupMissingKeys(body[key], schema[key].children, currKey, missingKeys)
		}
	}

	return missingKeys
}

function lookupInvalidKeys(body, schema, prevKey = null, invalidKeys = []) {

	prevKey = prevKey == null ? "" : (prevKey + ".")
	let currKey = null

	for (let key in body) {

		currKey = prevKey + key

		// Checking if it is in the schema or not
		if (key in schema == false) {
			invalidKeys.push(currKey)
			continue
		}

		if (typeof body[key] === "object" && Array.isArray(body[key]) == false) {

			invalidKeys = lookupInvalidKeys(body[key], schema[key].children, currKey, invalidKeys)
		}
	}

	return invalidKeys
}

function lookupInvalidTypes(body, schema, prevKey = null, invalidTypes = []) {

	prevKey = prevKey == null ? "" : (prevKey + ".")
	let currKey = null

	for (let key in body) {

		currKey = prevKey + key

		// Checking if schema has children but body not
		if ("children" in schema[key] && typeof body[key] !== "object") {
			invalidTypes.push({
				"key": currKey,
				"expected": "child",
				"received": "value"
			})
			continue
		}

		// Looping the child
		if (typeof body[key] === "object" && Array.isArray(body[key]) == false) {			
			invalidKeys = lookupInvalidTypes(body[key], schema[key].children, currKey, invalidTypes)
			continue
		}

		// Validating the type
		if (body[key].type === false) {
			body[key].type = "string"
			// If `type` does not set then the default type will be `string`
		}

		let currExpectedType = schema[key].type || "string"
		//currType.toLowerCase()
		switch (currExpectedType) {

			// String (default)
			case "string":
			case "str": {
				if (typeof body[key] !== "string") {
					invalidTypes.push({
						"key": currKey,
						"expected": "string",
						"received": typeof body[key]
					})
				}
				break
			}

			// Number
			case "number":
			case "num":
			case "integer":
			case "int":
			case "numeric": {
				if (typeof body[key] !== "number") {
					invalidTypes.push({
						"key": currKey,
						"expected": "number",
						"received": typeof body[key]
					})
				}
				break
			}

			// Array
			case "array":
			case "list": {
				if (Array.isArray(body[key]) == false) {
					invalidTypes.push({
						"key": currKey,
						"expected": "array",
						"received": typeof body[key]
					})
				}
				break
			}

			// Default
			default: {

			}
		}
	}

	return invalidTypes
}

function lookupOptionalProperties(body, schema, prevKey = null, issues = {}) {

	prevKey = prevKey == null ? "" : (prevKey + ".")
	let currKey = null

	for (let key in body) {

		currKey = prevKey + key

		// Checking for enum
		if ("enum" in schema[key]) {

			// Checking the enum	
			let tempIssue = checkEnum(schema[key].enum, body[key])

			// If invalid
			if (tempIssue) {

				// Checking if the `enum` key is set or not
				if ("enum" in issues == false) {
					issues.enum = []
				}

				// Then adding the current issue
				issues.enum.push(tempIssue)
			}
		}

		// Checking the length
		/*
		 * Prototype:
		 * "length": {
		 * 	"min": 10,
		 * 	"max": 30
		 * }
		 * or
		 * "length": [10, 30] --> NOT YET DONE
		 */
		if ("length" in schema[key]) {

		}


		if (typeof body[key] === "object" && Array.isArray(body[key]) == false) {

			issues = lookupOptionalProperties(body[key], schema[key].children, currKey, issues)
		}
	}

	return issues
}

// As the `enum` argument is reserved word, I'm using `enumm` instead
function checkEnum(enumm, received) {

	if (enumm.indexOf(received) == -1) {
		return {
			"received": received,
			"enum": enumm
		}
	}
	else {
		return null
	}
}

function checkLength(length, received) {

}


/*Array.prototype.myEach = function(callback) {
    for (var i = 0; i < this.length; i++)
        callback(this[i], i, this)
}*/

