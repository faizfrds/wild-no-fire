"use client";

import { useState, useEffect } from "react";
import FileUploader from "@/components/FileUploader";

type InferenceResponse = {
  inference_id: string;
  time: number;
  image: { width: number; height: number };
  predictions: { class: string; class_id: number; confidence: number }[];
  top: string;
  confidence: number;
};

export default function Home() {
  const [model, setModel] = useState("wildfire-prediction-ews4u");
  const [version, setVersion] = useState("2");
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_API_KEY);
  const [output, setOutput] = useState<InferenceResponse | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [useFile, setUseFile] = useState(true);
  const [curFile, setCurFile] = useState<File | null>(null);
  const [curUrl, setCurUrl] = useState("");
  const [placeholder, setPlaceholder] = useState("Nothing to show");

  useEffect(() => {
    const storedApiKey = localStorage.getItem("rf.api_key");
    const storedModel = localStorage.getItem("rf.model");
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedModel) setModel(storedModel);
  }, []);

  const handleInference = async () => {
    try {

      console.log(apiKey);
      const baseUrl = `https://classify.roboflow.com/${model}/${version}?api_key=${apiKey}`;
      let response;

      if (useFile && file) {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch(baseUrl, {
          method: "POST",
          body: formData,
        });
      } else if (!useFile && imageUrl) {
        response = await fetch(
          `${baseUrl}&image=${encodeURIComponent(imageUrl)}`,
          {
            method: "POST",
          }
        );
      } else {
        alert("Please provide a valid file or image URL.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result: InferenceResponse = await response.json();
      setOutput(result);
    } catch (error) {
      setPlaceholder("Error loading response. Check your parameters.")
      console.error(error);
    }
  };

  return (
    <div className="justify-center flex">
      <div className="p-4 w-1/2">
        <h1 className="text-2xl w-full font-bold text-center">
          Wildfire Risk Predictor
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInference();
          }}
        >
          <div className="my-2">
            <label>Model:</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="border p-1 w-full"
            />
          </div>
          <div className="my-2">
            <label>Version:</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="border p-1 w-full"
            />
          </div>
          <div className="my-2 gap-2">
            <button
              type="button"
              onClick={() => setUseFile(true)}
              className={`btn mr-2 p-2 rounded-md ${
                useFile ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUseFile(false)}
              className={`btn  p-2 rounded-md ${
                !useFile ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              Use Image URL
            </button>
          </div>
          {useFile ? (
            <FileUploader file={file} setFile={setFile} />
          ) : (
            <div className="my-2">
              <label>Image URL:</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="border p-1 w-full"
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md"
            onClick={() => {
              useFile && file ? setCurFile(file) : setCurUrl(imageUrl);
              setPlaceholder("Predicting image...")
            }}
          >
            Predict
          </button>
        </form>
        <pre className="mt-4 p-2 border bg-gray-100">
          {output && output.predictions && output.predictions.length > 0 ? (
            <>
              <img
                src={useFile && file ? URL.createObjectURL(curFile as Blob) : curUrl}
                alt="Preview"
              />
              <div className="flex">
                <p>{output.predictions[0].class}</p>
                <p>
                  {" "}
                  Confidence:{" "}
                  {(output.predictions[0].confidence * 100).toFixed(2)}%
                </p>
              </div>
              {output.predictions[1] && (
                <div className="flex">
                  <p>{output.predictions[1].class}</p>
                  <p>
                    {" "}
                    Confidence:{" "}
                    {(output.predictions[1].confidence * 100).toFixed(2)}%
                  </p>
                </div>
              )}
            </>
          ) : (
            <p>{placeholder}</p>
          )}
        </pre>
      </div>
    </div>
  );
}
