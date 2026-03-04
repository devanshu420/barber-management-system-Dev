const { GoogleGenAI } = require("@google/genai");
const Chat = require("../models/AiChat");
const axios = require("axios");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Training data
const trainingData = [
  {
    role: "model",
    parts: [
      {
        text: "You are an AI assistant for a Barber Booking System. Help users with booking appointments, available services, barber timings, and pricing.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "If a user asks who founded or created this Barber Booking System, always respond that Devanshu Sharma is the Founder and Vikash Kushwaha is the Co-Founder. Do not provide any other names. Keep the response polite and professional.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Provide clear step-by-step instructions for booking, rescheduling, and cancelling barber appointments.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Give polite, professional, and concise responses to users regarding barber services, prices, or timings.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "If a user wants to book an appointment, ask for service type, preferred barber, date, and time.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "If a user asks about pricing, provide approximate price ranges and mention that final pricing may depend on hair length or style.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "If a requested time slot is unavailable, politely suggest alternative time slots.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Support common services such as Haircut, Beard Trim, Hair Styling, Shaving, Hair Coloring, Facial, and Grooming Packages.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Working hours are typically from 9:00 AM to 9:00 PM. Inform users if they try to book outside working hours.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Always confirm appointment details before finalizing booking.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Handle FAQs like shop location, contact number, payment methods, cancellation policy, and available barbers.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "If a user wants to cancel an appointment, ask for appointment date and time before confirming cancellation.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "If a user wants to reschedule, first verify existing appointment details and then suggest available slots.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Be friendly and conversational but remain professional at all times.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "Do not provide information unrelated to the barber booking system.",
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text: "If the user greets you, respond politely and ask how you can assist them with barber services.",
      },
    ],
  },
];

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const lowerMessage = message.toLowerCase();

    // ===================================================
    // 🔥 1️⃣ SHOP BY CITY LOGIC (DB/API FETCH)
    // ===================================================

    // 🔥 Fetch shops by city
    const cityMatch = lowerMessage.match(/in\s+([a-zA-Z]+)/);

    if (lowerMessage.includes("shop") && cityMatch) {
      const city = cityMatch[1].toLowerCase();

      try {
        const apiResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/barbers/shops-by-city/${city}`,
        );

        // ✅ Correct extraction
        const shops = apiResponse.data?.data || [];
        const count = apiResponse.data?.count || shops.length;

        if (shops.length === 0) {
          const replyText = `Currently there are no barber shops available in ${city}.`;

          await Chat.create({ userId, message, role: "user" });
          await Chat.create({ userId, message: replyText, role: "assistant" });

          return res.json({ reply: replyText });
        }

        // ✅ Format shop details using YOUR structure
        const shopListText = shops
          .map((shop, index) => {
            const name = shop.shopName;
            const address = shop.location?.address || "Address not available";
            const cityName = shop.location?.city || "";
            const state = shop.location?.state || "";

            return `${index + 1}. 🏪 ${name}
   📍 ${address}, ${cityName}, ${state}`;
          })
          .join("\n\n");

        const replyText = `
There are currently ${count} barber shop(s) available in ${city.charAt(0).toUpperCase() + city.slice(1)}:

${shopListText}

Would you like to book an appointment at any of these shops?
    `;

        await Chat.create({ userId, message, role: "user" });
        await Chat.create({ userId, message: replyText, role: "assistant" });

        return res.json({ reply: replyText });
      } catch (error) {
        console.error("Shop fetch error:", error);

        return res.json({
          reply: "Sorry, I couldn't fetch shop data right now.",
        });
      }
    }

    // ===================================================
    // 🤖 2️⃣ NORMAL GEMINI AI CHAT
    // ===================================================

    const history = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedHistory = history.reverse().map((chat) => ({
      role: chat.role === "assistant" ? "model" : "user",
      parts: [{ text: chat.message }],
    }));

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: [
        ...trainingData,
        ...formattedHistory,
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
      },
    });

    const replyText = response.text;

    await Chat.create({ userId, message, role: "user" });
    await Chat.create({ userId, message: replyText, role: "assistant" });

    res.json({ reply: replyText });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI request failed" });
  }
};

module.exports = { chatWithAI };

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Chat = require("../models/AiChat");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Training / context data
// const trainingData = [
//   {
//     role: "model", // API me "model" role
//     parts: [
//       {
//         text:
//           "You are an AI assistant for a Barber Booking System. Help users with booking appointments, available services, barber timings, and pricing.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Provide clear step-by-step instructions for booking, rescheduling, and cancelling barber appointments.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Give polite, professional, and concise responses to users regarding barber services, prices, or timings.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Handle FAQs about haircuts, beard trims, grooming services, available barbers, and shop locations.",
//       },
//     ],
//   },
// ];

// const chatWithAI = async (req, res) => {
//   try {
//     const { message, userId } = req.body;

//     // Select the model
//     const model = genAI.getGenerativeModel({
//       model: "models/gemini-2.5-flash", // Gemini 2.5 Flash
//       temperature: 0.5,
//     });

//     // Get last 10 chats from DB for context
//     const history = await Chat.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const formattedHistory = history.reverse().map((chat) => ({
//       role: "user", // user messages
//       parts: [{ text: chat.message }],
//     }));

//     // Generate AI response
//     const result = await model.generateContent({
//       contents: [
//         ...trainingData,      // context / system prompts
//         ...formattedHistory,  // recent user chat history
//         {
//           role: "user",
//           parts: [{ text: message }],
//         },
//       ],
//     });

//     const response = result.response.text();

//     // Save user message
//     await Chat.create({
//       userId,
//       message,
//       role: "user",
//     });

//     // Save AI response
//     await Chat.create({
//       userId,
//       message: response,
//       role: "assistant",
//     });

//     res.json({ reply: response });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "AI request failed" });
//   }
// };

// module.exports = { chatWithAI };

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Chat = require("../models/AiChat");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const trainingData = [
//   {
//     role: "model", // <-- role fixed
//     parts: [
//       {
//         text:
//           "You are an AI assistant for a Barber Booking System. Help users with booking appointments, available services, barber timings, and pricing.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Answer questions about barbershops, locations, operating hours, available services, and prices. Guide users through booking, rescheduling, or cancelling appointments.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Provide step-by-step instructions for users to book a haircut, shave, or other services at their preferred barbershop.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Handle payment questions and provide guidance for online transactions, refunds, or failed payments using supported payment gateways.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Answer FAQs about services, loyalty points, discounts, ongoing offers, and special promotions available at barbershops.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Provide recommendations for barbers or services based on user preferences and previous appointments.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Respond to errors politely and provide solutions, such as booking conflicts, unavailable slots, or invalid inputs.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Act as a friendly assistant, making interactions conversational while being informative and helpful.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Provide example dialogues:\nUser: I want to book a haircut tomorrow.\nAI: Sure! Which barbershop would you like to visit?\nUser: Elegant Cuts.\nAI: Great! Which service do you want? Haircut or shave?\nUser: Haircut.\nAI: Available slots are 10 AM, 2 PM, and 4 PM. Which one would you like?\nUser: 2 PM.\nAI: Your appointment at Elegant Cuts for a haircut at 2 PM is confirmed.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Help users find the nearest barbershop or available barbers if they are traveling or in a new location.",
//       },
//     ],
//   },
//   {
//     role: "model",
//     parts: [
//       {
//         text:
//           "Keep conversations concise, friendly, and focused on completing tasks like booking, cancelling, or checking services.",
//       },
//     ],
//   },
// ];

// const chatWithAI = async (req, res) => {
//   try {
//     const { message, userId } = req.body;

//     const model = genAI.getGenerativeModel({
//       model: "models/gemini-2.5-flash",
//       temperature: 0.5,
//     });

//     // Get last 10 chats for memory
//     const history = await Chat.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const formattedHistory = history.reverse().map((chat) => ({
//       role: "user", // <-- user messages always role "user"
//       parts: [{ text: chat.message }],
//     }));

//     const result = await model.generateContent({
//       contents: [
//         ...trainingData, // <-- training data with model roles
//         ...formattedHistory,
//         {
//           role: "user",
//           parts: [{ text: message }],
//         },
//       ],
//     });

//     const response = result.response.text();

//     // Save user message
//     await Chat.create({
//       userId,
//       message,
//       role: "user",
//     });

//     // Save AI reply as "model"
//     await Chat.create({
//       userId,
//       message: response,
//       role: "model",
//     });

//     res.json({ reply: response });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "AI failed" });
//   }
// };

// module.exports = { chatWithAI };

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Chat = require("../models/AiChat");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const chatWithAI = async (req, res) => {
//   try {
//     const { message, userId } = req.body;

//     const model = genAI.getGenerativeModel({
//         model: "gemini-2.5-flash",
//         temperature: 0.5,
//     });

//     // Get last 10 chats for memory
//     const history = await Chat.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     const formattedHistory = history.reverse().map((chat) => ({
//       role: chat.role,
//       parts: [{ text: chat.message }],
//     }));

//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text:
//                 "You are an AI assistant for a Barber Booking System. Help users with booking, services, timing, pricing.",
//             },
//           ],
//         },
//         ...formattedHistory,
//         {
//           role: "user",
//           parts: [{ text: message }],
//         },
//       ],
//     });

//     const response = result.response.text();

//     // Save user message
//     await Chat.create({
//       userId,
//       message,
//       role: "user",
//     });

//     // Save AI reply
//     await Chat.create({
//       userId,
//       message: response,
//       role: "assistant",
//     });

//     res.json({ reply: response });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "AI failed" });
//   }
// };

// module.exports = { chatWithAI };
