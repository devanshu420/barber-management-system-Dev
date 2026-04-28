

const { uploadImage } = require("../services/imagekit.services");
const { Modality } = require("@google/genai");
const ai = require("../config/gemini");
const Hair = require("../models/Hair");

const HairController = async (req, res) => {
  try {
    const file = req.file;
    const userPrompt = req.body.prompt;

    console.log("req.user =>", req.user);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const inputBase64 = file.buffer.toString("base64");
    const inputMimeType = file.mimetype || "image/jpeg";

    const originalUpload = await uploadImage({
      buffer: file.buffer,
      fileName: `original-${Date.now()}`,
      folder: "/barber-book/hairstyle/original",
      tags: ["hairstyle", "original", "input"],
    });

    // const editPrompt = `
    // Create a new photorealistic image based on the uploaded portrait.

    // Preserve the same person:
    // - Keep the exact same identity and facial features
    // - Preserve face shape, eyes, nose, lips, eyebrows, jawline, and skin tone
    // - Keep similar pose, framing, and camera angle
    // - Match lighting and background as closely as possible

    // Hair transformation:
    // - Apply this hairstyle: "${userPrompt}"
    // - Make the hairstyle realistic, clearly visible, and naturally blended
    // - Change only the hair, not the person's identity

    // Beard / facial hair transformation:
    // - Apply this beard style (if described): "${userPrompt}"
    // - Match beard color, density, and texture to the person’s natural hair
    // - Ensure the beard follows natural growth lines along jaw, chin, cheeks, and mustache area
    // - Blend the beard smoothly into the skin with realistic shadows and hair strands
    // - If no beard is requested, keep the person clean-shaven

    // Quality requirements:
    // - Photorealistic result
    // - No distortions, artifacts, duplicated features, or warped face
    // - Return only the final edited image
    // `;

    const editPrompt = `
Create a professional hairstyle analysis poster based on the uploaded portrait image.

Main Goal:
Generate a single high-quality collage-style image that looks like a modern barber or grooming app interface.

User Preference:
The user has requested this hairstyle: "${userPrompt}"

- Include this hairstyle as one of the main styles
- Prioritize it as the "Best Choice" if it suits the face
- Ensure it is clearly highlighted in the layout

Layout Instructions:
- Use a clean, modern dark theme
- LEFT side:
  - Show original uploaded image
  - Title: "Your Current Look"

- RIGHT side:
  - Grid layout (2 rows x 4 columns)
  - Show SAME person with different hairstyles

Hairstyle Variations:
Include these styles:
1. ${userPrompt} (user preferred style)
2. Volume Quiff
3. Mid Fade with Textured Top
4. Side Part
5. Slick Back
6. Crop Fringe
7. Buzz Cut
8. Long & Messy

Identity Rules (VERY IMPORTANT):
- Preserve EXACT same person
- Same face, same skin tone, same expression
- ONLY change hair

Hair Rules:
- Realistic blending
- Natural texture
- Match lighting and angle

Beard Rules:
- Keep beard natural and consistent
- Adjust only if it improves the style

For Each Card:
- Add hairstyle name at top
- Add rating label:
  - Best Choice (for userPrompt)
  - Great Choice
  - Good Choice
  - Fair Choice
  - Not Ideal

Analysis Section:
- Face Shape: Oval
- Hair Type: Thick & Straight

Quick Tips:
- Add volume at the top
- Keep sides tapered or faded
- Use matte styling products
- Regular trims every 3–4 weeks

Design:
- Dark UI
- Rounded cards
- Clean layout

Quality:
- Photorealistic
- No distortion
- Consistent identity

Output:
Return ONLY one final collage-style image.
`;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: editPrompt },
            {
              inlineData: {
                mimeType: inputMimeType,
                data: inputBase64,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const parts = geminiResponse?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part) => part.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      return res.status(500).json({
        success: false,
        message: "No image returned from Gemini",
      });
    }

    const outputBase64 = imagePart.inlineData.data;
    const outputMimeType = imagePart.inlineData.mimeType || "image/png";
    const generatedBuffer = Buffer.from(outputBase64, "base64");

    const generatedUpload = await uploadImage({
      buffer: generatedBuffer,
      fileName: `generated-${Date.now()}`,
      folder: "/barber-book/hairstyle/generated",
      tags: ["hairstyle", "generated", "ai-edit"],
    });

    const savedHair = await Hair.create({
      user: req.user.id,
      prompt: userPrompt,
      originalFileName: file.originalname,
      originalImageUrl: originalUpload.url,
      originalImageFileId: originalUpload.id,
      generatedImageUrl: generatedUpload.url,
      generatedThumbnailUrl: generatedUpload.thumbnail,
      generatedImageFileId: generatedUpload.id,
      mimeType: inputMimeType,
    });

    return res.status(201).json({
      success: true,
      message: "Images uploaded and saved successfully",
      data: savedHair,
    });
  } catch (error) {
    console.error("Hairstyle edit error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate, upload, and save image",
      error: error.message,
    });
  }
};


const getMyPhotos = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const photos = await Hair.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: photos,
    });
  } catch (error) {
    console.error("getMyPhotos error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch photos",
      error: error.message,
    });
  }
};

module.exports = { HairController, getMyPhotos };

// const getMyPhotos = async (req, res) => {
//   try {
//     const photos = await Hairstyle.find({ user: req.userId })
//       .sort({ createdAt: -1 })
//       .select("prompt originalImageUrl generatedImageUrl createdAt updatedAt");

//     return res.status(200).json({
//       success: true,
//       count: photos.length,
//       data: photos,
//     });
//   } catch (error) {
//     console.error("Get my photos error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch user photos",
//       error: error.message,
//     });
//   }
// };

// exports.HairController = async (req, res) => {
//   try {
//     console.log("req.user =>", req.user);

//     if (!req.user?.id) {
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const prompt = req.body.prompt;
//     const file = req.file;

//     if (!prompt) {
//       return res.status(400).json({
//         success: false,
//         message: "Prompt is required",
//       });
//     }

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image is required",
//       });
//     }

//     const savedHair = await Hair.create({
//       user: req.user.id,
//       prompt,
//       originalImageUrl: "original-image-url",
//       generatedImageUrl: "generated-image-url",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Image generated and saved successfully",
//       data: savedHair,
//     });
//   } catch (error) {
//     console.error("HairController error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to generate, upload, and save image",
//       error: error.message,
//     });
//   }
// };
















// const { Modality } = require("@google/genai");
// const ai = require("../config/gemini");
// const imagekit = require("../config/imagekit");
// const Hair = require("../models/Hair");

// const HairController = async (req, res) => {
//   try {
//     const file = req.file;
//     const userPrompt = req.body.prompt;

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image is required",
//       });
//     }

//     if (!userPrompt) {
//       return res.status(400).json({
//         success: false,
//         message: "Prompt is required",
//       });
//     }

//     const inputBase64 = file.buffer.toString("base64");
//     const inputMimeType = file.mimetype || "image/jpeg";
//     const originalExtension = inputMimeType.includes("png") ? "png" : "jpg";

//     const originalUploadResponse = await imagekit.upload({
//       file: `data:${inputMimeType};base64,${inputBase64}`,
//       fileName: `original-${Date.now()}.${originalExtension}`,
//       folder: "/ai-hairstyle-results/original",
//       useUniqueFileName: true,
//       tags: ["original", "input-image", "hairstyle"],
//     });

//     const editPrompt = `
// Create a new photorealistic image based on the uploaded portrait.

// Preserve the same person:
// - Keep the exact same identity and facial features
// - Preserve face shape, eyes, nose, lips, eyebrows, jawline, and skin tone
// - Keep similar pose, framing, and camera angle
// - Match lighting and background as closely as possible

// Hair transformation:
// - Apply this hairstyle: "${userPrompt}"
// - Make the hairstyle realistic, clearly visible, and naturally blended
// - Change only the hair, not the person's identity

// Quality requirements:
// - Photorealistic result
// - No distortions, artifacts, duplicated features, or warped face
// - Return only the final edited image
// `;

//     const geminiResponse = await ai.models.generateContent({
//       model: "gemini-3.1-flash-image-preview",
//       contents: [
//         {
//           role: "user",
//           parts: [
//             { text: editPrompt },
//             {
//               inlineData: {
//                 mimeType: inputMimeType,
//                 data: inputBase64,
//               },
//             },
//           ],
//         },
//       ],
//       config: {
//         responseModalities: [Modality.IMAGE],
//       },
//     });

//     const parts = geminiResponse?.candidates?.[0]?.content?.parts || [];
//     const imagePart = parts.find((part) => part.inlineData?.data);

//     if (!imagePart?.inlineData?.data) {
//       return res.status(500).json({
//         success: false,
//         message: "No image returned from Gemini",
//       });
//     }

//     const outputBase64 = imagePart.inlineData.data;
//     const outputMimeType = imagePart.inlineData.mimeType || "image/png";
//     const generatedExtension = outputMimeType.includes("png") ? "png" : "jpg";

//     const generatedUploadResponse = await imagekit.upload({
//       file: `data:${outputMimeType};base64,${outputBase64}`,
//       fileName: `generated-${Date.now()}.${generatedExtension}`,
//       folder: "/ai-hairstyle-results/generated",
//       useUniqueFileName: true,
//       tags: ["generated", "gemini", "hairstyle", "ai-edit"],
//     });

//     const savedHair = await Hair.create({
//       prompt: userPrompt,
//       originalFileName: file.originalname,
//       originalImageUrl: originalUploadResponse.url,
//       originalImageFileId: originalUploadResponse.fileId,
//       generatedImageUrl: generatedUploadResponse.url,
//       generatedThumbnailUrl: generatedUploadResponse.thumbnailUrl || "",
//       generatedImageFileId: generatedUploadResponse.fileId,
//       mimeType: inputMimeType,
//     });
//     console.log("Original upload:", originalUploadResponse);
//     console.log("Generated upload:", generatedUploadResponse);
//     console.log("Saved in DB:", savedHair);

//     return res.status(201).json({
//       success: true,
//       message: "Images uploaded and saved successfully",
//       data: savedHair,
//     });
//   } catch (error) {
//     console.error("Hairstyle edit error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to generate, upload, and save image",
//       error: error.message,
//     });
//   }
// };

// module.exports = HairController;