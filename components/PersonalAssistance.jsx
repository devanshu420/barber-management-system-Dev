import React from "react";

const overlayButtons = [
  {
    label: "Complete front desk solution",
    top: "30%",
    left: "42%",
    onClick: () => alert("Complete front desk solution clicked!"),
  },
  {
    label: "Booksy Biz App",
    top: "55%",
    left: "28%",
    onClick: () => alert("Booksy Biz App clicked!"),
  },
  {
    label: "24/7 online booking",
    top: "57%",
    left: "69%",
    onClick: () => alert("24/7 online booking clicked!"),
  },
  {
    label: "Process payments",
    top: "77%",
    left: "45%",
    onClick: () => alert("Process payments clicked!"),
  },
];

const PersonalAssistance = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="flex flex-col items-center w-full max-w-5xl mx-auto mt-16 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold mb-5 text-center">
          You're used to doing it all.
          <br /> We're your personal assistant.
        </h2>
        <div className="relative mt-12 flex justify-center w-full" style={{ minHeight: 480 }}>
          <img
            src="https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/664368be3351e8d66132cce6_why-booksy2.jpg"
            srcSet="https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/664368be3351e8d66132cce6_why-booksy2-p-500.webp 500w, https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/664368be3351e8d66132cce6_why-booksy2-p-800.webp 800w, https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/664368be3351e8d66132cce6_why-booksy2-p-1080.webp 1080w, https://cdn.prod.website-files.com/65ce807a7f0051db5b622a45/664368be3351e8d66132cce6_why-booksy2.jpg 1600w"
            alt="Booksy Demo"
            className="rounded-xl shadow-md w-full max-w-[720px] h-auto"
          />
          {overlayButtons.map((btn) => (
            <button
              key={btn.label}
              className="absolute flex items-center gap-2 bg-black bg-opacity-90 text-white px-5 py-2 rounded-full text-base font-semibold hover:bg-pink-600 transition border border-gray-700"
              style={{
                top: btn.top,
                left: btn.left,
                transform: "translate(-50%,-50%)",
                minWidth: 210,
                zIndex: 2,
              }}
              onClick={btn.onClick}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                  style={{ opacity: 0.3 }}
                >
                  <line x1="10" y1="4" x2="10" y2="16" stroke="white" strokeWidth="2" />
                  <line x1="4" y1="10" x2="16" y2="10" stroke="white" strokeWidth="2" />
                </svg>
              </span>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalAssistance;
