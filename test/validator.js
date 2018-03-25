var assert = require("chai").assert
var expect = require("chai").expect

var schemaValidator = require("../index.js")


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
							type: "number",
							required: true
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

// Internal issue tests
describe("Internal tests", () => {

	// Testing with empty body
	it("Should throw EmptyBody error", () => {
		return schemaValidator.validate(null, schema)
		.then(() => {
			assert.fail(0, 1, "Validate should have thrown Error")
		})
		.catch(err => {
			expect(err).to.be.an.instanceof(Object)
			expect(Object.keys(err).length).to.equal(1)

			expect(err).to.have.property("internalIssue")
			expect(err.internalIssue).to.equal("bodyNotSet")
		})
	})

	// Testing with empty schema
	it("Should throw EmptySchema error", () => {
		return schemaValidator.validate(body, null)
		.then(() => {
			assert.fail(0, 1, "Validate should have thrown Error")
		})
		.catch(err => {
			expect(err).to.be.an.instanceof(Object)
			expect(Object.keys(err).length).to.equal(1)

			expect(err).to.have.property("internalIssue")
			expect(err.internalIssue).to.equal("schemaNotSet")
		})
	})
})

// Basic tests
describe("Basic tests", () => {

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
		body.testingForInvalidKey1 = 123
		body.testingForInvalidKey2 = { subKey2: null }
		body.testingForInvalidKey3 = { subKey3: { subSubKey3: 123 } }
		body.testingForInvalidKey4 = { subKey4: { subSubKey4: { subSubSubKey4: 123 } } }

		return schemaValidator.validate(body, schema)
		.then(() => {
			assert.fail(0, 1, "Should have thrown an Error")
		})
		.catch(err => {
			expect(err).to.be.an.instanceof(Object)
			expect(Object.keys(err).length).to.equal(1)
			expect(err).to.have.property("invalidKeys")

			expect(err.invalidKeys).to.be.an.instanceof(Array)
			expect(err.invalidKeys).to.have.lengthOf(4)

			expect(err.invalidKeys[0]).to.equal("testingForInvalidKey1")
			expect(err.invalidKeys[1]).to.equal("testingForInvalidKey2")
			expect(err.invalidKeys[2]).to.equal("testingForInvalidKey3")
			expect(err.invalidKeys[3]).to.equal("testingForInvalidKey4")
		})
	})

	// Testing for `missingKey` error
	it("Should throw MissingKey Error", () => {

		// Adding extra keys to the schema
		schema.requiredTest1 = { type: "string", required: true }
		schema.requiredTest2 = { type: "string", required: false }
		schema.requiredTest3 = { children: { subItem3: { type: "string", required: true } } }
		schema.requiredTest4 = { children: { subItem4: { children: { subSubItem4: { type: "string", required: true } } } } }

		return schemaValidator.validate(body, schema)
		.then(() => {
			assert.fail(0, 1, "Should have thrown an Error")
		})
		.catch(err => {
			expect(err).to.be.an.instanceof(Object)
			expect(Object.keys(err).length).to.equal(1)
			expect(err).to.have.property("missingKeys")

			expect(err.missingKeys).to.be.an.instanceof(Array)
			expect(err.missingKeys).to.have.lengthOf(3)

			expect(err.missingKeys[0]).to.equal("requiredTest1")
			expect(err.missingKeys[1]).to.equal("requiredTest3.subItem3")
			expect(err.missingKeys[2]).to.equal("requiredTest4.subItem4.subSubItem4")
		})
	})
})

// Type tests
describe("Type tests", () => {

	it("Should expect `string` instead of `number` and `array`", () => {

		// Setting up invalid types

		body.testWithNumber = { subItem: { subSubItem: 47576458 } }
		schema.testWithNumber = { children: { subItem: { children: { subSubItem: { type: "string" } } } } }

		body.testWithArray = { subItem: [ "one", "two", "three" ] }
		schema.testWithArray = { children: { subItem: { type: "string" } } }

		return schemaValidator.validate(body, schema)
		.then(() => {
			assert.fail(0, 1, "Should have thrown an Error")
		})
		.catch(err => {
			expect(err).to.be.an.instanceof(Object)
			expect(Object.keys(err).length).to.equal(1)
			expect(err).to.have.property("invalidTypes")

			expect(err.invalidTypes).to.be.an.instanceof(Array)
			expect(err.invalidTypes).to.have.lengthOf(2)

			expect(err.invalidTypes[0].key).to.equal("testWithNumber.subItem.subSubItem")
			expect(err.invalidTypes[0].expected).to.equal("string")
			expect(err.invalidTypes[0].received).to.equal("number")

			expect(err.invalidTypes[1].key).to.equal("testWithArray.subItem")
			expect(err.invalidTypes[1].expected).to.equal("string")
			expect(err.invalidTypes[1].received).to.equal("array")
		})
	})

	it("Should expect `number` instead of `string` and `array`", () => {

		// Setting up invalid types
		body.testWithString = { subItem: { subSubItem: "two" } }
		schema.testWithString = { children: { subItem: { children: { subSubItem: { type: "number" } } } } }

		body.testWithArray = { subItem: [ "one", "two", "three" ] }
		schema.testWithArray = { children: { subItem: { type: "number" } } }

		return schemaValidator.validate(body, schema)
		.then(() => {
			assert.fail(0, 1, "Should have thrown an Error")
		})
		.catch(err => {
			expect(err).to.be.an.instanceof(Object)
			expect(Object.keys(err).length).to.equal(1)
			expect(err).to.have.property("invalidTypes")

			expect(err.invalidTypes).to.be.an.instanceof(Array)
			expect(err.invalidTypes).to.have.lengthOf(2)

			expect(err.invalidTypes[0].key).to.equal("testWithString.subItem.subSubItem")
			expect(err.invalidTypes[0].expected).to.equal("number")
			expect(err.invalidTypes[0].received).to.equal("string")

			expect(err.invalidTypes[1].key).to.equal("testWithArray.subItem")
			expect(err.invalidTypes[1].expected).to.equal("number")
			expect(err.invalidTypes[1].received).to.equal("array")
		})
	})

	it("Should expect `array` instead of `string` and `number`", () => {

		// Setting up invalid types
		body.testWithString = { subItem: { subSubItem: "two" } }
		schema.testWithString = { children: { subItem: { children: { subSubItem: { type: "array" } } } } }

		body.testWithNumber = { subItem: 123 }
		schema.testWithNumber = { children: { subItem: { type: "array" } } }

		return schemaValidator.validate(body, schema)
		.then(() => {
			assert.fail(0, 1, "Should have thrown an Error")
		})
		.catch(err => {
			expect(err).to.be.an.instanceof(Object)
			expect(Object.keys(err).length).to.equal(1)
			expect(err).to.have.property("invalidTypes")

			expect(err.invalidTypes).to.be.an.instanceof(Array)
			expect(err.invalidTypes).to.have.lengthOf(2)

			expect(err.invalidTypes[0].key).to.equal("testWithString.subItem.subSubItem")
			expect(err.invalidTypes[0].expected).to.equal("array")
			expect(err.invalidTypes[0].received).to.equal("string")

			expect(err.invalidTypes[1].key).to.equal("testWithNumber.subItem")
			expect(err.invalidTypes[1].expected).to.equal("array")
			expect(err.invalidTypes[1].received).to.equal("number")
		})
	})
})

describe("Property tests", () => {

	it("Should be out of enum", () => {

		// Setting up a out-of-enum body property
		body.born.date.month = "Apr"

		return schemaValidator.validate(body, schema)
		.then(() => {
			assert.fail(0, 1, "Should have thrown an Error")
		})
		.catch(err => {
			expect(err).to.be.éan.instanceof(Object)
			expect(Object.keys(err).length).to.equal(1)
			expect(err).to.have.property("outOfEnum")

			expect(err.outOfEnum).to.be.an.instanceof(Array)
			expect(err.outOfEnum).to.have.lengthOf(1)

			expect(err.outOfEnum[0].key).to.equal("born.date.month")
			expect(err.outOfEnum[0].received).to.equal("Apr")
			expect(err.outOfEnum[0]).to.have.property("enum")
			expect(err.outOfEnum[0].enum).to.be.an.instanceof(Array)
		})
	})
})
