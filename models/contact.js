const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const connectionString = process.env.MONGODB_URI;
console.log(`Connecting to ${connectionString}`);

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.log(`Error connecting to MongoDB: ${error.message}`)
  );

const schemaDefinition = {
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, unique: true, minlength: 8 },
};

const contactSchema = new mongoose.Schema(schemaDefinition);
contactSchema.plugin(uniqueValidator);

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
