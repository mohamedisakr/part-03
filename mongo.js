const mongoose = require("mongoose");

const connectionString = "mongodb://localhost:27017/contact-app";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const schemaDefinition = { name: String, number: String };
const contactSchema = new mongoose.Schema(schemaDefinition);

const Contact = mongoose.model("Contact", contactSchema);

Contact.find({}).then((contacts) => {
  contacts.forEach((cont) => console.log(cont));
  mongoose.connection.close();
});

/*
let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: 5, name: "John Doe", number: "40-12-5555122" },
];

persons.forEach(({ name, number }) => {
  const contact = new Contact({ name, number });
  contact.save().then((result) => {
    console.log("Note successfully saved");
  });
});
*/
