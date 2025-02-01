"use client";

import { useState, useEffect, useRef } from "react";
import FileUploader from "@/components/FileUploader";

type InferenceResponse = {
  inference_id: string;
  time: number;
  image: { width: number; height: number };
  predictions: {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
  }[];
};

export default function Home() {
  const [model, setModel] = useState("wildfire-image-detection");
  const [version, setVersion] = useState("1");
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_API_KEY);
  const [output, setOutput] = useState<InferenceResponse | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [useFile, setUseFile] = useState(true);
  const [curFile, setCurFile] = useState<File | null>(null);
  const [curUrl, setCurUrl] = useState("");
  const [placeholder, setPlaceholder] = useState("Analyze image");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("rf.api_key");
    const storedModel = localStorage.getItem("rf.model");
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedModel) setModel(storedModel);
  }, []);

  const handleInference = async () => {
    
    
    try {
      const baseUrl = `https://detect.roboflow.com/${model}/${version}?api_key=${apiKey}`;
      let response;

      if (useFile && file) {
        setPlaceholder("Predicting image...");
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch(baseUrl, {
          method: "POST",
          body: formData,
        });
      } else if (!useFile && imageUrl) {
        setPlaceholder("Predicting image...");
        response = await fetch(
          `${baseUrl}&confidence=1&image=${encodeURIComponent(imageUrl)}`,
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
      useFile && file ? setCurFile(file) : setCurUrl(imageUrl);
      setOutput(result);
      setPlaceholder("Analyze image");
    } catch (error) {
      setPlaceholder("Error loading response. Check your parameters.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (!output || !canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = imageRef.current;
    image.onload = () => {
      // Adjust canvas size to match image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Overlay bounding boxes
     
      ctx.lineWidth = 3;
      ctx.font = "18px Arial";
      ctx.fillStyle = "white";

      output.predictions.forEach((prediction) => {
        const { x, y, width, height, class: label, confidence } = prediction;
        ctx.strokeStyle = label === "fire" ? "yellow" : "red";
        ctx.strokeRect(x - width / 2, y - height / 2, width, height);
        ctx.fillText(
          `${label} (${(confidence * 100).toFixed(2)}%)`,
          x - width / 2,
          y - height/3 
        );
      });
    };
  }, [output]);

  return (
    <div className="justify-center flex bg-gradient-to-b">
      <div className="lg:p-4 lg:w-1/2 p-5 w-full">
        <h1 className="text-3xl mt-12 w-full font-bold text-center">
        🌲 Wild-no-fire 🌲
        </h1>
        <h2 className="text-center text-lg">Machine learning wildfire detection</h2>
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
              className="border p-1 w-full rounded-md"
            />
          </div>
          <div className="my-2">
            <label>Version:</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="border p-1 w-full rounded-md"
            />
          </div>
          <div className="my-2 gap-2">
          <label>Upload image or paste URL:</label>
          <div className="flex mt-2">

            <button
              type="button"
              onClick={() => setUseFile(true)}
              className={`btn mr-2 p-2 rounded-md w-[50%] ${
                useFile ? "bg-blue-300" : "bg-gray-300"
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUseFile(false)}
              className={`btn  p-2 rounded-md w-[50%] ${
                !useFile ? "bg-blue-300" : "bg-gray-300"
              }`}
            >
              Use Image URL
            </button>
          </div>
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
                className="border p-2 w-full rounded-md"
              />
            </div>
          )}
          
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md w-full mt-2"
          >
            {placeholder}
          </button>
        </form>

        <div className="mt-4">
          {output &&
(
            <>
              {/* Image is hidden, only used to draw on canvas */}
              <img
                ref={imageRef}
                src={useFile && file ? URL.createObjectURL(curFile as Blob) : curUrl}
                alt="Detected"
                className="hidden"
              />
              <canvas ref={canvasRef} className="border bg-gray-100 w-full" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
