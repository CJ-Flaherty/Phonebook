require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");
app.use(express.static("build"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const logger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(logger);
app.use(morgan("tiny"));
app.use(cors());

const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true });
let persons = [];

const currentTime = new Date().toLocaleString();

const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  res.send(`<h1>Info</h1>
      <p> Phonebook has info for ${maxId} persons</p>
      <p> ${currentTime}`);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons =>
    res.json(persons.map(person => person.toJSON()))
  );
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(mongoose.Types.ObjectId(String(request.params.id)))
    .then(person => {
      if (person) {
        response.json(person.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.deleteOne({ _id: mongoose.Types.ObjectId(String(request.params.id)) })
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const generateId = () => {
  return Math.random(1000);
};

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  });

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
