/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality } from "@google/genai";
import { Asset, PlacedLayer } from "../types";

/**
 * Helper to strip the data URL prefix (e.g. "data:image/png;base64,")
 */
const getBase64Data = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

/**
 * Helper to initialize AI client with the best available key
 */
const getAiClient = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    throw new Error("API Key is missing. Please provide a valid Gemini API Key in Settings.");
  }
  return new GoogleGenAI({ apiKey: key });
};

/**
 * Test the connection to the API with the selected model.
 */
export const testModelConnection = async (modelId: string, apiKey?: string): Promise<{ success: boolean; message: string }> => {
  try {
    const ai = getAiClient(apiKey);
    
    if (modelId.includes('image') || modelId.includes('imagen')) {
       // Test image generation
       const response = await ai.models.generateContent({
         model: modelId,
         contents: { parts: [{ text: "A small red dot" }] },
         config: { responseModalities: [Modality.IMAGE] }
       });
       if (response.candidates?.[0]?.content?.parts?.[0]) return { success: true, message: "Image generation model connected successfully." };
    } else {
       // Test text generation
       const response = await ai.models.generateContent({
         model: modelId,
         contents: "Say hello",
       });
       if (response.text) return { success: true, message: `Connected to ${modelId} successfully.` };
    }
    
    return { success: false, message: "No content returned." };
  } catch (error: any) {
    console.error("Connection test failed:", error);
    return { success: false, message: error.message || "Connection failed" };
  }
};

/**
 * Generates a product mockup by compositing multiple logos onto a product image.
 */
export const generateMockup = async (
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string,
  modelId: string = 'gemini-2.5-flash-image',
  apiKey?: string
): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    const model = modelId;

    // 1. Add Product Base
    const parts: any[] = [
      {
        inlineData: {
          mimeType: product.mimeType,
          data: getBase64Data(product.data),
        },
      },
    ];

    // 2. Add All Logos
    let layoutHints = "";
    layers.forEach((layer, index) => {
      parts.push({
        inlineData: {
          mimeType: layer.asset.mimeType,
          data: getBase64Data(layer.asset.data),
        },
      });

      // Construct simple positioning hint (assuming 0,0 is top-left)
      const vPos = layer.placement.y < 33 ? "top" : layer.placement.y > 66 ? "bottom" : "center";
      const hPos = layer.placement.x < 33 ? "left" : layer.placement.x > 66 ? "right" : "center";
      
      layoutHints += `\n- Logo ${index + 1}: Place at ${vPos}-${hPos} area (approx coords: ${Math.round(layer.placement.x)}% x, ${Math.round(layer.placement.y)}% y). Scale: ${layer.placement.scale}.`;
    });

    // 3. Add Instructions
    const finalPrompt = `
    User Instructions: ${instruction}
    
    Layout Guidance based on user's rough placement on canvas:
    ${layoutHints}

    System Task: Composite the provided logo images (images 2-${layers.length + 1}) onto the first image (the product) to create a realistic product mockup. 
    Follow the Layout Guidance for positioning if provided, but prioritize realistic surface warping, lighting, and perspective blending.
    Output ONLY the resulting image.
    `;

    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                 return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Mockup generation failed:", error);
    throw error;
  }
};

/**
 * Generates a new logo or product base from scratch using text.
 */
export const generateAsset = async (
  prompt: string, 
  type: 'logo' | 'product', 
  modelId: string = 'gemini-2.5-flash-image',
  apiKey?: string
): Promise<string> => {
   try {
    const ai = getAiClient(apiKey);
    const model = modelId;
    
    const enhancedPrompt = type === 'logo' 
        ? `A high-quality, professional vector-style logo design of a ${prompt}. Isolated on a pure white background. Minimalist and clean, single distinct logo.`
        : `Professional studio product photography of a single ${prompt}. Ghost mannequin style or flat lay. Front view, isolated on neutral background. High resolution, photorealistic. Single object only, no stacks, no duplicates.`;

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [{ text: enhancedPrompt }]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                 return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
     throw new Error("No image generated");

   } catch (error) {
       console.error("Asset generation failed:", error);
       throw error;
   }
}

/**
 * Takes a raw AR composite and makes it photorealistic.
 */
export const generateRealtimeComposite = async (
    compositeImageBase64: string,
    prompt: string = "Make this look like a real photo",
    modelId: string = 'gemini-2.5-flash-image',
    apiKey?: string
  ): Promise<string> => {
    try {
      const ai = getAiClient(apiKey);
      const model = modelId;
  
      const parts = [
        {
          inlineData: {
            mimeType: 'image/png',
            data: getBase64Data(compositeImageBase64),
          },
        },
        {
          text: `Input is a rough AR composite. Task: ${prompt}. 
          Render the overlaid object naturally into the scene. 
          Match the lighting, shadows, reflections, and perspective of the background. 
          Keep the background largely as is, but blend the object seamlessly.
          Output ONLY the resulting image.`,
        },
      ];
  
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
  
      const candidates = response.candidates;
      if (candidates && candidates[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                   return `data:image/png;base64,${part.inlineData.data}`;
              }
          }
      }
      throw new Error("No image data found in response");
  
    } catch (error) {
      console.error("AR Composite generation failed:", error);
      throw error;
    }
  };