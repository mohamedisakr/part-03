const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.get("/", (req, res) =>
  res.send(
    "<h1>Hello, Part 3 Programming a server with NodeJS and Express</h1>"
  )
);

app.get("/api/persons", (req, res) => res.json(persons));

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

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => Number(person.id) === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send(`Person with id ${id} does not exist`);
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const maxId = generateId();

  if (!body.name) {
    return res.status(400).json({ error: "name missing" });
  }

  if (!body.number) {
    return res.status(400).json({ error: "number missing" });
  }

  const newPerson = {
    id: maxId,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  console.log(newPerson);
  res.json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};
