import React, { useState } from "react";
import "../styles/Upload.css"; // Import the CSS file

const Upload = () => {
  const [csvData, setCsvData] = useState([]);
  const [showTrainBtn, setShowTrainBtn] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // Assuming CSV data has headers in the first row
        const rows = content.split(/\r\n|\n/);
        const headers = rows[0].split(",");
        const data = [];
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(",");
          if (values.length === headers.length) {
            const rowObject = {};
            for (let j = 0; j < headers.length; j++) {
              rowObject[headers[j]] = values[j];
            }
            data.push(rowObject);
          }
        }
        setCsvData(data);
        setShowTrainBtn(true); // Set showTrainBtn to true when data is loaded
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="upload-container">
      <label className="upload-label">
        Upload CSV File
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="upload-input"
        />
      </label>
      {csvData.length > 0 && (
        <table className="upload-table">
          <thead>
            <tr>
              {Object.keys(csvData[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showTrainBtn && (
        <button
          className="train-button"
          onClick={() => console.log("training")}
        >
          Click to Train
        </button>
      )}
    </div>
  );
};

export default Upload;
