export type InferenceResponse = {
    inference_id: string;
    time: number;
    image: { width: number; height: number };
    predictions: { class: string; class_id: number; confidence: number }[];
    top: string;
    confidence: number;
  };
  
  