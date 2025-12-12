# AI Product-Mockup

**AI Product-Mockup** is a professional-grade design studio that leverages Google's Gemini models to generate photo-realistic product visualizations. By intelligently compositing logos and graphics onto product bases, it handles complex surface warping, lighting, and texture blending automatically.

![App Interface](https://placehold.co/1200x600/000000/FFFFFF?text=AI+Product-Mockup+Studio)

## ✨ Features

### 🎨 Asset Management
- **Upload & Organize**: Easily manage your library of product base images (t-shirts, mugs, packaging) and graphic assets (logos, stickers).
- **AI Generation**: Don't have assets? Use the built-in AI tools to generate professional product photography or vector-style logos from text prompts.

### 🛠️ Interactive Studio
- **Visual Editor**: Drag, drop, scale, and rotate logos directly onto your product base.
- **Precision Control**: The layout you create serves as a spatial guide for the AI.
- **History**: Full Undo/Redo support for all canvas actions.
- **Advanced Options**:
  - **Multi-Shot**: Generate 1-3 variations in a single run.
  - **Creativity Control**: Switch between 'Standard' fidelity or 'High' creativity for more artistic lighting and composition.
  - **Angle Variation**: Automatically generate alternate camera angles (side, top-down, close-up) based on your single input.

### 🤖 AI Compositing Engine
- **Powered by Gemini**: Uses the latest `gemini-2.5-flash-image` model for rapid, high-fidelity image synthesis.
- **Smart Blending**: The AI understands 3D geometry from 2D images, wrapping your logos around curves, folding them into creases, and matching the product's lighting conditions.

### 🖼️ Gallery & Export
- **High-Res Output**: View generated mockups in a lightbox and download them for production use.
- **Prompt Retention**: Every generated image saves the prompt and layout data used to create it.

## 🚀 Getting Started

### Prerequisites
- A **Google Gemini API Key** (Free tier supported).
- Node.js and npm/yarn (for local development).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-product-mockup.git
   cd ai-product-mockup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

### Configuration

The application supports **Bring Your Own Key (BYOK)** architecture. You do not need to hardcode API keys.

1. Launch the application.
2. Navigate to **Settings** or click "Start Creating".
3. Enter your Google Gemini API Key.
   - *Note: Your key is stored securely in your browser's Local Storage and is never sent to our servers.*
4. (Optional) Test the connection or switch models in the Settings panel.

## 📖 How It Works

1.  **Select Product**: Choose a base image (e.g., a plain white hoodie).
2.  **Place Graphics**: Drag your logo onto the hoodie. Resize and rotate it to the desired position.
3.  **Instruct**: Add a text prompt like *"Embed the logo into the fabric texture, soft cinematic lighting"*.
4.  **Generate**: The app sends the base image, the graphic, and spatial coordinates to Gemini.
5.  **Result**: Gemini returns a fully composited image where the logo looks like it was printed on the product.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Build Tooling**: Vite (implied by structure)

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

---

*Built with the Google Gemini API.*
