require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

const app = express();

app.use(express.static("build"));
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

// get all
app.get("/api/persons", (req, res, next) => {
  Contact.find({})
    .then((persons) => res.json(persons))
    .catch((error) => next(error));
});

// get by id
app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// new phonebook entry
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "name missing" });
  }

  if (body.number === undefined) {
    return res.status(400).json({ error: "number missing" });
  }

  console.log(body.name);

  if (
    Contact.find(({ name }) => name.toLowerCase() === body.name.toLowerCase())
  ) {
    const newPerson = new Contact({
      name: body.name,
      number: body.number,
    });
    Contact.findOneAndUpdate({ name: body.name }, newPerson, { new: true })
      .then((updatedPerson) => res.json(updatedPerson))
      .catch((error) => next(error));
    // return res.status(400).json({ error: "name must be unique" });
  }

  const newPerson = new Contact({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

// delete phonebook entry
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Contact.findByIdAndRemove(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

// update phonebook entry
app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const person = { name: body.name, number: body.number };
  Contact.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  // const currentDate = Date.now();
  Contact.countDocuments({}, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.json(`Phonebook has info for ${result} people.`);
    }
  });
  //
});

// catch requests made to non-existent routes
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// Move the error handling of the application to a new error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

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
