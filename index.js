require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

const app = express();

app.use(express.json());
app.use(cors());

//#region morgan
morgan.token("person", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

morgan("combined", {
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});
//#endregion

app.get("/", (req, res) =>
  res.send(
    "<h1>Hello, Part 3 Programming a server with NodeJS and Express</h1>"
  )
);

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Contact.findById(id).then((person) => res.json(person));
});

// new phonebook entry
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "name missing" });
  }

  if (body.number === undefined) {
    return res.status(400).json({ error: "number missing" });
  }

  // if (
  //   Contact.find(({ name }) => name.toLowerCase() === body.name.toLowerCase())
  // ) {
  //   return res.status(400).json({ error: "name must be unique" });
  // }

  const newPerson = new Contact({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => res.json(savedPerson));
});

/*
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  const currentDate = Date.now();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>`);
  // res.send(`<p>${new Date().toLocaleDateString()}</p>`);

  // res.send(currentDate);
  // res.send(res.getHeaders());
  // res.send(req.headers.date);

  // res.send(`<div>${new Date()}</div>`);
  // res.json(`<div>${new Date()}</div>`);
  // res.send(Date.now());
});
*/

// catch requests made to non-existent routes
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: 5, name: "John Doe", number: "40-12-5555122" },
];
*/
