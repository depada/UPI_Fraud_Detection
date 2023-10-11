const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" })); // Set the request body size limit to 50MB

// Set up storage for uploaded CSV file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a route to train the model
app.post("/train-model", upload.single("csvFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Generate a unique file name for the temporary CSV file
    const tempFilePath = path.join(__dirname, "temp", `${Date.now()}.csv`);

    // Write the CSV data to the temporary file
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Spawn a Python process to run the script and pass the temporary file path as an argument
    const pythonProcess = spawn("python", ["fraud_detection.py", tempFilePath]);

    pythonProcess.stdout.on("data", (data) => {
      const message = data.toString();
      res.json({ message }); // Return the message from the Python script
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(data.toString());
      res
        .status(500)
        .json({ error: "An error occurred while training the model." });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ... (rest of your server code)
