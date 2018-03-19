var assert = require("chai").assert
var expect = require("chai").expect

var schemaValidator = require("../index.js")


describe("GOabela Schema Validator", () => {

	/**
	 * Defining the schema and the body.
	 *
	 * Resetting before each test.
	 * Later this will be modified for testing.
	 */
	let schema = null
	let body = null

	beforeEach(done => {
		schema = {
			username: {
				type: "string"
			},
			name: {
				children: {
					last: {
						type: "string"
					},
					first: {
						type: "string"
					},
					nick: {
						type: "string"
					}
				}
			},
			born: {
				children: {
					place: {
						type: "string"
					},
					date: {
						children: {
							year: {
								type: "number"
							},
							month: {
								type: "string",
								enum: ["Jan", "Feb", "Marc"]
							},
							day: {
								type: "number"
							}
						}
					}
				}
			},
			skills: {
				type: "array"
			}
		}

		body = {
			username: "johndoe",
			name: {
				last: "Doe",
				first: "John",
				nick: "Johnny"
			},
			born: {
				place: "Colorado, Denver",
				date: {
					year: 1985,
					month: "Jan",
					day: 15
				}
			},
			skills: [
				"SEO",
				"HTML",
				"CSS"
			]
		}

		done()
	})

	// Testing for success validation
	it("Should be OK", () => {
		return schemaValidator.validate(body, schema)
		.then(() => {
			assert
		})
		.catch(err => {
			assert.fail(0, 1, "Validate thrown Error")
		})
	})

	// Testing for `invalidKeys` error
	it("Should throw InvalidKey Error", () => {

		// Adding an foreign key
		body.testingForInvalidKey = 123

		return schemaValidator.validate(body, schema)
		.then(() => {
			assert.fail(0, 1, "Should have thrown an Error")
		})
		.catch(err => {
			assert.property(err, "invalidKeys")
		})
	})
})
