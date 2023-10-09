const express = require("express");
const cors = require("cors");
const tf = require("@tensorflow/tfjs");
const path = require("path"); // Import the path module
const app = express();
const port = 3001;

// Enable CORS for your React.js frontend
app.use(cors());

// Define an async function to load the model
async function loadModel() {
  // Get the absolute path to the model file
  const modelPath = path.resolve(__dirname, "saved_model.pb");

  // Load your trained TensorFlow model
  const model = await tf.loadLayersModel(`file://${modelPath}`);
  return model;
}

// Define an endpoint for making predictions
app.post("/predict", async (req, res) => {
  const inputData = req.body;

  // Load the model using the async function
  const model = await loadModel();

  // Perform predictions using your loaded model
  const prediction = model.predict(tf.tensor(inputData));

  // Convert prediction to JSON
  res.json({ prediction: prediction.arraySync() });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
