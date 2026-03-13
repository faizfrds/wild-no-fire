# Wild-No-Fire: Wildfire Detection System

**Wild-No-Fire** is a computer vision application designed to identify, classify, and monitor wildfires in real-time. Powered by the **YOLOv11** architecture, the system processes data from various camera sensors to mitigate the rising risks of climate-change-driven wildfires.

![poster-image](images/poster.png)

## Project Overview

As global temperatures rise, wildfires have become more frequent and destructive. This project provides an automated solution for early detection, helping to protect communities and ecosystems through advanced object detection.

### Key Features

* **Multi-Source Detection:** Optimized for images from satellites, surveillance cameras (CCTV), and mobile phones.
* **YOLOv11 Integration:** Utilizes the latest YOLOv11 model for high-speed, high-accuracy supervised learning.
* **Severity Classification:** Categorizes fire events into Low, Moderate, and High severity based on visual data.

## Methodology & Findings

The project followed a rigorous data pipeline to ensure model reliability:

1. **Data Collection:** Gathered over **6,000+** wildfire and smoke images.
2. **Data Annotation:** Labeled images to distinguish between fire and smoke across various environments.
3. **Data Split:** * **Training:** 88%
* **Validation:** 8%
* **Test:** 4%


4. **Performance:** The model achieved significant Mean Average Precision (mAP) scores across its primary classes:
* **Fire:** 54% (High Severity detection)
* **Smoke:** 42% (Early-stage detection)


## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (Frontend/Dashboard)
* **Model:** YOLOv11
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)

## 📂 Repository Structure

* `/app`: Core Next.js application logic and error handling.
* `/components`: UI elements, including the canvas overlay for image detection.
* `/public`: Static assets, including the project poster and icons.
* `/types`: TypeScript definitions for the detection objects.

## 🚦 Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install

```

Run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the application.

## Future Works

* **Multi-Camera Network:** Integrating CCTV, satellite, and drone feeds for large-scale monitoring.
* **Crowdsourced Reporting:** Developing a mobile interface for real-time community fire reporting.
* **Edge Computing:** Deploying the model on **Raspberry Pi** and **Jetson Nano** for on-site, low-latency detection without cloud reliance.

---

*Developed at UMass Amherst - Manning College of Information & Computer Sciences.*
