const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URI;
console.log(`Connecting to ${connectionString}`);

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Connected to MongoDB"))
  .catch((error) => console.log(`Error connecting to MongoDB: ${error}`));

const schemaDefinition = { name: String, number: String };

const contactSchema = new mongoose.Schema(schemaDefinition);

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
