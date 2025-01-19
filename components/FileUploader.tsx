import React from "react";

export default function FileUploader({ file, setFile }) {
  return (
    <div>
      <label>Upload File:</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-1 w-full"
      />
      {file && <p>Selected File: {file.name}</p>}
    </div>
  );
}
