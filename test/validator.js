
var schemaValidator = require("../index.js")

var schema = {
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

var body = {
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

schemaValidator.validate(body, schema)
	.then(() => {
		console.log("No issue")
	})
	.catch(err => {
		console.log("Total issues:")
		console.log(JSON.stringify(err))
	})
