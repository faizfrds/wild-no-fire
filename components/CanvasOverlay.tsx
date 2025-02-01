import { useEffect, useRef } from "react";

type Prediction = {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
};

type CanvasOverlayProps = {
  predictions: Prediction[];
  imageWidth: number;
  imageHeight: number;
};

export default function CanvasOverlay({ predictions, imageWidth, imageHeight }: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach(({ x, y, width, height, class: label, confidence }) => {
      // Set colors
      const color = label === "fire" ? "#FF0000" : "#808080"; // Red for fire, Gray for smoke
      const bgColor = label === "fire" ? "rgba(255, 0, 0, 0.7)" : "rgba(128, 128, 128, 0.7)"; // Semi-transparent

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x - width / 2, y - height / 2, width, height);

      // Label text
      const confidenceText = `${label} (${Math.round(confidence * 100)}%)`;

      // Label styling
      const textPadding = 6;
      const fontSize = 16;
      ctx.font = `${fontSize}px Arial`;
      ctx.textBaseline = "top";

      const textWidth = ctx.measureText(confidenceText).width;
      const textHeight = fontSize + textPadding;

      // **Default Position (Above the Bounding Box)**
      let textX = x - width / 2;
      let textY = y - height / 2 - textHeight - 2;

      // **Prevent Text from Going Out of Image Bounds**
      if (textX < 0) textX = 2; // Keep from left edge
      if (textX + textWidth > imageWidth) textX = imageWidth - textWidth - 2; // Keep from right edge

      // **If text goes above the image, move it below the bounding box**
      if (textY < 0) textY = y + height / 2 + 2;

      // **If text goes below the image, shift it above the box instead**
      if (textY + textHeight > imageHeight) textY = y - height / 2 - textHeight - 2;

      // **Ensure shifting didn't put it outside the top boundary**
      if (textY < 0) textY = 2;

      // Draw background rectangle
      ctx.fillStyle = bgColor;
      ctx.fillRect(textX - textPadding / 2, textY - textPadding / 2, textWidth + textPadding, textHeight);

      // Draw text
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(confidenceText, textX, textY);
    });
  }, [predictions, imageWidth, imageHeight]);

  return <canvas ref={canvasRef} width={imageWidth} height={imageHeight} className="absolute top-0 left-0" />;
}
