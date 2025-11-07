"use client";

import { useState, useRef, useEffect } from "react";

const BarberChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages([
      {
        type: "bot",
        text: "Welcome to our Barbershop! 💈 I'm here to help you with any questions about our services, bookings, and more. Click on any question below or type your own!",
      },
    ]);
  }, []);

const questionsAndAnswers = [
    {
      id: 1,
      question: 'How do I book an appointment?',
      answer:
        "You can book an appointment by visiting our website's booking page, calling us at the phone number listed, or texting us on WhatsApp. Simply select your preferred date, time, and barber, and we'll confirm your appointment. We also accept walk-ins during business hours!",
    },
    {
      id: 2,
      question: 'What are your operating hours?',
      answer:
        "We are open Monday to Saturday, 9:00 AM - 7:00 PM, and Sunday 10:00 AM - 5:00 PM. We're closed on major holidays. For extended hours during peak seasons, please contact us directly.",
    },
    {
      id: 3,
      question: 'What services do you offer and what are the prices?',
      answer:
        "Our services include: Standard Haircuts, Fade Haircuts, Beard Trims, Full Grooming Packages, Hair Styling, Kids' Haircuts, and Specialty Designs. For detailed pricing, please call us or visit our website. We offer discounts on package deals!",
    },
    {
      id: 4,
      question: 'Do you have any current specials or discounts?',
      answer:
        'Yes! We offer 15% off for first-time customers, loyalty rewards after 5 visits, and special package discounts combining hair and beard services. Follow us on social media for weekly flash sales and promotions!',
    },
    {
      id: 5,
      question: 'What payment methods do you accept?',
      answer:
        'We accept Cash, Credit Cards (Visa, Mastercard, American Express), Debit Cards, and Mobile Payment Apps (Apple Pay, Google Pay, PayPal, Cash App). Choose whatever is most convenient for you!',
    },
    {
      id: 6,
      question: 'Can I request a specific barber?',
      answer:
        "Absolutely! You can request your favorite barber when booking. If your preferred barber isn't available at your chosen time, we'll suggest our next available specialist or offer an alternative time slot.",
    },
    {
      id: 7,
      question: 'How long does a typical haircut take?',
      answer:
        'Standard haircuts usually take 20-30 minutes, while beard trims take 10-15 minutes. Full grooming packages may take 45-60 minutes. Exact timing depends on the complexity of your style and current shop traffic.',
    },
    {
      id: 8,
      question: 'What is your cancellation policy?',
      answer:
        'We require 24-hour notice for cancellations to avoid a 50% cancellation fee. For emergencies, please call us immediately. Reschedules are always free if done within 24 hours of your appointment.',
    },
    {
      id: 9,
      question: 'Do you accommodate walk-ins, or is it appointment-only?',
      answer:
        'We welcome walk-ins! However, during peak hours, wait times may be 30-60 minutes. For the shortest wait, we recommend booking an appointment in advance through our website or app.',
    },
    {
      id: 10,
      question: "What should I do if I'm allergic to certain products?",
      answer:
        'Please let us know about any allergies when booking or at check-in. We have hypoallergenic and fragrance-free alternatives available. Your safety is our priority!',
    },
    {
      id: 11,
      question: 'Do you offer beard grooming or facial services?',
      answer:
        'Yes! We offer professional beard trims, shaping, and maintenance. We also have facial grooming services. Inquire about our beard care packages that include complementary beard products.',
    },
    {
      id: 12,
      question: 'Can I reschedule my appointment?',
      answer:
        "Yes, rescheduling is easy and free! Just contact us at least 12 hours before your appointment. You can reschedule through our website, by phone, or via WhatsApp. We'll find a time that works for you.",
    },
    {
      id: 13,
      question: 'What grooming packages do you have available?',
      answer:
        'Our popular packages include: The Fresh Start (haircut + beard trim), The Premium (haircut + beard trim + facial), and The VIP (full grooming + hairwash + head massage). Package discounts save you 20-30%!',
    },
    {
      id: 14,
      question: 'Do you sell hair care products?',
      answer:
        'Yes! We carry premium hair care products including shampoos, conditioners, styling gels, pomades, and beard oils. Our staff can recommend products perfect for your hair type and style.',
    },
    {
      id: 15,
      question: 'How can I contact you for urgent issues?',
      answer:
        'For urgent matters, please call us directly at 8604005690 or text/WhatsApp us. Our team responds within 1 hour during business hours. Email support is available at barberbook@gmail.com.',
    },
  ];

  // Simulate bot typing animation
  const simulateBotResponse = (answer) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessages((prev) => [...prev, { type: "bot", text: answer }]);
    }, 1200);
  };

  const handleQuestionClick = (question, answer) => {
    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setShowQuestions(false);
    simulateBotResponse(answer);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");
    setShowQuestions(false);
    simulateBotResponse("Let me check that for you…");
  };

  const handleReset = () => {
    setMessages([{ type: "bot", text: "Welcome back! How can I help you today? 💈" }]);
    setShowQuestions(true);
  };

  return (
    <div className="max-w-3xl mx-auto h-[90vh] flex flex-col bg-gray-900 text-gray-200 rounded-xl shadow-2xl overflow-hidden font-inter">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 text-center py-5 shadow-md">
        <h2 className="text-2xl font-semibold tracking-wide text-gray-100">
          💈 Barbershop Support
        </h2>
        <p className="text-sm text-gray-400">Get instant answers to your questions</p>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md transition-colors duration-300 ${
                msg.type === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Bot typing animation */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}

        {/* Question options */}
        {showQuestions && (
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mt-3 shadow-inner">
            <p className="text-gray-300 font-semibold text-sm border-b border-gray-700 pb-2 mb-3">
              Common Questions
            </p>
            <div className="flex flex-col gap-2">
              {questionsAndAnswers.map((qa) => (
                <button
                  key={qa.id}
                  onClick={() => handleQuestionClick(qa.question, qa.answer)}
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 hover:translate-x-1"
                >
                  {qa.question}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="bg-gray-800 border-t border-gray-700 px-5 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 bg-gray-900 text-gray-100 border border-gray-700 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition-all duration-200"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-blue-500/30"
          >
            Send
          </button>
        </form>

        <button
          onClick={handleReset}
          className="w-full mt-3 text-sm border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md py-2 transition-all duration-200"
        >
          Show Questions Menu
        </button>
      </div>
    </div>
  );
};

export default BarberChatbot;
