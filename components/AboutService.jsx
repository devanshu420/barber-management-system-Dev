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
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black min-h-screen flex flex-col items-center pt-10 py-10 px-4 sm:px-12 lg:px-24">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14 mb-12">
        {features.map((feature, index) => (
          <ScrollFade key={index} className="flex items-center border-b border-gray-700 pb-8">
            <img
              src={feature.image}
              alt=""
              className="w-32 h-32 rounded-lg object-cover mr-8 shadow-lg"
            />
            <div>
              <h3 className="font-extrabold text-2xl text-teal-400 mb-2">{feature.title}</h3>
              <span className="text-gray-400 text-sm">{feature.subtitle}</span>
            </div>
          </ScrollFade>
        ))}
      </div>

      {/* Action Buttons */}
      <ScrollFade className="flex gap-6 mt-6">
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md font-semibold shadow-lg transition">
          Start free now
        </button>
        <button className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-md font-semibold shadow hover:bg-teal-700 hover:text-white transition">
          Make the Switch
        </button>
      </ScrollFade>
    </div>
  );
};

export default AboutService;
