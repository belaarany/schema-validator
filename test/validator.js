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
						type: "string",
						required: true
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
			expect(err.invalidKeys).to.be.an.instanceof(Array)
			expect(err.invalidKeys).to.have.lengthOf(1)
			expect(err.invalidKeys[0]).to.not.be.undefined
			expect(err.invalidKeys[0]).to.equal("testingForInvalidKey")
		})
	})

	// Testing for `missingKey` error
	it("Should throw MissingKey Error", () => {

		// Adding extra keys to the schema
		schema.requiredTest1 = { type: "string", required: true }
		schema.requiredTest2 = { type: "string", required: false }
		schema.requiredTest3 = { children: { subItem: { type: "string", required: true } } }

		return schemaValidator.validate(body, schema)
		.then(() => {
			assert.fail(0, 1, "Should have thrown an Error")
		})
		.catch(err => {
			console.log(JSON.stringify(err))
			assert.property(err, "missingKeys")
		})
	})
})
