const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateHairstyleImages(prompt) {
  const response = await ai.models.generateContent({
    model: "models/gemini-2.5-flash-image",
    // model: "models/gemini-3.1-flash-image-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  // Extract images
  const images = [];

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      images.push({
        mimeType: part.inlineData.mimeType,
        base64: part.inlineData.data,
      });
    }
  }

  return images;
}

module.exports = { generateHairstyleImages };





















// const { GoogleGenerativeAI } = require("@google/genai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.analyzeFaceWithGemini = async (imageBuffer) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const base64Image = imageBuffer.toString("base64");

//   const prompt = `
// Analyze this face image and return ONLY JSON format.

// {
//   "faceShape": "",
//   "hairType": "",
//   "beardType": "",
//   "recommendedHairstyles": [
//     {
//       "name": "",
//       "description": "",
//       "maintenanceLevel": ""
//     }
//   ]
// }

// Suggest 4 to 5 modern hairstyles suitable for this person.
// `;

//   const result = await model.generateContent([
//     prompt,
//     {
//       inlineData: {
//         mimeType: "image/jpeg",
//         data: base64Image,
//       },
//     },
//   ]);

//   const response = await result.response;
//   const text = response.text();

//   return JSON.parse(text);
// };