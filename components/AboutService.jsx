import React, { useRef, useState, useEffect } from "react";

const ScrollFade = ({ children, className = "" }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const AboutService = () => {
  const features = [
    {
      image: "https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/666839863dab24bf838b7fbd_onboarding-2.webp",
      title: "24/7 live chat",
      subtitle: "Get a human response in less than 30 seconds",
    },
    {
      image: "https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/66a9df0f7cd3ab3b4e1a3108_livechat.png",
      title: "Phone and email support",
      subtitle: "90+ customer satisfaction",
    },
    {
      image: "https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/66a9df0fdc8b449c43b0a6dd_support.png",
      title: "Personal onboarding support",
      subtitle: "We’ll set you up for success",
    },
    {
      image: "https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/66683986724a5ce7bbbd1e5e_transfer-2.webp",
      title: "Free data transfer",
      subtitle: "All appointments, reviews and clients transferred to your new Booksy account",
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col items-center py-10 px-2">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mb-8">
        {features.map((feature, index) => (
          <ScrollFade key={index} className="flex items-center border-b border-gray-200 pb-8">
            <img
              src={feature.image}
              alt=""
              className="w-32 h-32 rounded-lg object-cover mr-7"
            />
            <div>
              <h3 className="font-extrabold text-2xl text-gray-800 mb-1">{feature.title}</h3>
              <span className="text-sm text-gray-500">{feature.subtitle}</span>
            </div>
          </ScrollFade>
        ))}
      </div>

      {/* Action Buttons */}
      <ScrollFade className="flex gap-4 mt-4">
        <button className="bg-black text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-800 transition">
          Start free now
        </button>
        <button className="border-2 border-black text-black px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition">
          Make the Switch
        </button>
      </ScrollFade>
    </div>
  );
};

export default AboutService;
