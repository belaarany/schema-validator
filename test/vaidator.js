// Importing the validator
var schemaValidator = require("./index.js")

var schema = {

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

	})
	.catch(err => {

	})
