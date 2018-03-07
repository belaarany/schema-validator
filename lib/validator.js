module.exports.validate = function(body, schema) {
	return validate(body, schema)
}

function validate(body, schema) {
	return new Promise((resolve, reject) => {
		

		// Checking if the `schema` is set
		if (schema == null || typeof schema != "object") {
			reject({
				"internalIssue": "`schema` is not set"
			})
		}

		// Checking if the schema is not empty so `body` should have value
		if (Object.keys(schema).length > 0) {
			// Checking if the `body` is set
			if (body == null || Object.keys(body).length <= 0) {
				reject({
					"internalIssue": "`body` is not set"
				})
			}
		}
		// If so then body should be empty as well
		else {
			if (Object.keys(body).length > 0) {
				reject({
					"internalIssue": "`body` should be empty"
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

		resolve()
	})
}

function lookupMissingKeys(body, schema, prevKey = null, missingKeys = []) {

	// Adding a dot to the previous keys as a seperator
	prevKey = prevKey == null ? "" : (prevKey + ".")

	// Current key
	let currKey = null;

	for (let key in schema) {

		// Declaring the current ky by adding the for's key to the previous keys
		currKey = prevKey + key

		// Checking wether it is required
		if (schema[key].required == true) {

			// Checking wether it is in the body
			if (key in body == false) {
				missingKeys.push(currKey)
			}
		}

		// Checking if has children
		if ("children" in schema[key]) {

			// Looping through the children as well
			missingKeys = lookupMissingKeys(body[key], schema[key].children, currKey, missingKeys)
		}
	}

	// Returning the `missingKeys` list
	return missingKeys
}

function lookupInvalidKeys(body, schema, prevKey = null, invalidKeys = []) {

	// Adding a dot to the previous keys as a seperator
	prevKey = prevKey == null ? "" : (prevKey + ".")

	// Current key
	let currKey = null;

	for (let key in body) {

		// Declaring the current ky by adding the for's key to the previous keys
		currKey = prevKey + key

		// Checking if it is in the schema or not
		if (key in schema == false) {
			invalidKeys.push(currKey)
		}

		if (typeof body[key] === "object" && Array.isArray(body[key]) == false) {

			// Looping through the children as well
			invalidKeys = lookupInvalidKeys(body[key], schema[key].children, currKey, invalidKeys)
		}
	}

	// Returning the `invalidKeys` list
	return invalidKeys
}





/*Array.prototype.myEach = function(callback) {
    for (var i = 0; i < this.length; i++)
        callback(this[i], i, this)
}*/

