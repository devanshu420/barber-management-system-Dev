"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wand2,
  Sparkles,
  GalleryHorizontal,
  ArrowLeft,
  Scissors,
  UserRound,
  ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ChatInput from "@/components/hairstyle/ChatInput";
import ChatMessage from "@/components/hairstyle/ChatMessage";
import Loader from "@/components/hairstyle/Loader";
import GalleryModal from "@/components/hairstyle/GalleryModal";
import FullScreenImageModal from "@/components/hairstyle/FullScreenImageModal";

const FACE_PROMPTS = [
  "Analyze my face and suggest the best hairstyle like a professional barber.",
  "Analyze my face and suggest the best beard style like a professional barber.",
  "Give me the most suitable haircut for my face shape and hairline.",
];

const HAIR_STYLE_PROMPTS = [
  "Curly fade hairstyle with natural volume on top and clean tapered sides",
  "Short textured crop with light fade and messy top",
  "Buzz cut with sharp clean edges and even length",
  "Low fade with side part and smooth combed finish",
  "Classic taper with clean neckline and soft textured top",
  "Modern mid fade with thick top and natural finish",
];

const BEARD_STYLE_PROMPTS = [
  "Heavy stubble beard with sharp cheek line and clean neckline",
  "Short boxed beard with neat edges and natural density",
  "Corporate beard with clean jawline and trimmed mustache",
  "Balbo beard with defined chin beard and separated mustache",
  "Van Dyke beard with pointed goatee and detached mustache",
  "Clean mustache with light stubble and sharp finishing",
];

function PromptSection({ title, icon: Icon, items, onPick, activePrompt }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Icon className="h-4 w-4 text-cyan-300" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          {title}
        </p>
      </div>

      <div className="space-y-2">
        {items.map((chip) => {
          const active = activePrompt === chip;

          return (
            <button
              key={chip}
              type="button"
              onClick={() => onPick(chip)}
              className={`w-full rounded-2xl border px-3 py-3 text-left text-xs leading-5 transition ${
                active
                  ? "border-cyan-300/70 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.10)]"
                  : "border-white/10 bg-white/5 text-gray-200 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-100"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [error, setError] = useState(null);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [gallery, setGallery] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const [chatTopHeight, setChatTopHeight] = useState(64);
  const [isResizing, setIsResizing] = useState(false);

  const messagesEndRef = useRef(null);
  const rightPanelRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setFilePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    const updateHeight = (clientY) => {
      if (!rightPanelRef.current) return;

      const rect = rightPanelRef.current.getBoundingClientRect();
      const headerHeight = 57;
      const usableTop = rect.top + headerHeight;
      const usableHeight = rect.height - headerHeight;

      const offsetY = clientY - usableTop;
      const nextTop = (offsetY / usableHeight) * 100;
      const clamped = Math.max(35, Math.min(82, nextTop));

      setChatTopHeight(clamped);
    };

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      updateHeight(e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!isResizing) return;
      if (!e.touches?.[0]) return;
      updateHeight(e.touches[0].clientY);
    };

    const stopResize = () => {
      setIsResizing(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    if (isResizing) {
      document.body.style.userSelect = "none";
      document.body.style.cursor = "row-resize";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopResize);
    };
  }, [isResizing]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("Please enter a hairstyle prompt.");
      return;
    }

    if (!file) {
      setError("Please upload a face image.");
      return;
    }

    setError(null);
    setLoading(true);

    const userMessage = {
      id: `user-${Date.now()}`,
      prompt,
      originalImageUrl: filePreview || undefined,
      role: "user",
    };

    setChat((prev) => [...prev, userMessage]);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", prompt);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hairstyle/hairstyle-generator`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.log(text);
        
        throw new Error("Failed to generate hairstyle");
      }

      const data = await res.json();

      const generatedUrl =
        data?.data?.generatedImageUrl ||
        data?.data?.imageUrl ||
        data?.generatedImageUrl ||
        data?.imageUrl ||
        "";

      if (!generatedUrl) {
        throw new Error("No generated image returned from API");
      }

      const assistantMessage = {
        id: `ai-${Date.now()}`,
        prompt,
        generatedImageUrl: generatedUrl,
        role: "assistant",
      };

      setChat((prev) => [...prev, assistantMessage]);
      setPrompt("");
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGallery = async () => {
    setIsGalleryOpen(true);
    setGalleryLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hairstyle/all-photos`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch photos");
      }

      const data = await res.json();

      const items = (data?.data || data || []).map((item) => ({
        id: item._id || Math.random().toString(36).slice(2),
        prompt: item.prompt || "Generated hairstyle",
        imageUrl:
          item.generatedImageUrl ||
          item.imageUrl ||
          item.originalImageUrl ||
          "",
      }));

      setGallery(items);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load gallery");
    } finally {
      setGalleryLoading(false);
    }
  };

  return (
    <main className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_20%),linear-gradient(135deg,#020617_0%,#030712_45%,#082f49_100%)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[8%] top-[6%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[8%] left-[10%] h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.45),rgba(0,0,0,0.75))]" />
      </div>

      <div className="relative z-10 mx-auto flex h-screen w-full max-w-7xl flex-col overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-sky-100 backdrop-blur-md transition hover:border-sky-300/70 hover:bg-sky-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-300 shadow-lg shadow-cyan-500/30">
              <Wand2 className="h-6 w-6 text-slate-950" />
            </div>

            <div>
              <h1 className="bg-gradient-to-r from-cyan-300 via-white to-teal-200 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                AI Hairstyle Generator
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-400">
                Upload your photo, try smart hairstyle and beard prompts, and
                preview polished AI-generated looks before visiting the barber.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenGallery}
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-100 shadow-md shadow-cyan-500/10 transition hover:border-cyan-300 hover:bg-cyan-400/15 hover:text-white"
          >
            <GalleryHorizontal className="h-4 w-4" />
            View Photos
          </button>
        </header>

        <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
          <aside className="hidden h-full w-[300px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl md:flex md:flex-col">
            <div className="mb-4 shrink-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Pick a style prompt
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Click any prompt to fill the input quickly.
              </p>
            </div>

            <div className="no-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
              <PromptSection
                title="Face analysis"
                icon={UserRound}
                items={FACE_PROMPTS}
                onPick={setPrompt}
                activePrompt={prompt}
              />

              <PromptSection
                title="Haircuts"
                icon={Scissors}
                items={HAIR_STYLE_PROMPTS}
                onPick={setPrompt}
                activePrompt={prompt}
              />

              <PromptSection
                title="Beard styles"
                icon={Sparkles}
                items={BEARD_STYLE_PROMPTS}
                onPick={setPrompt}
                activePrompt={prompt}
              />
            </div>
          </aside>

          <section
            ref={rightPanelRef}
            className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-gray-500">
                <ImageIcon className="h-3.5 w-3.5 text-cyan-400/80" />
                <span>Chat history</span>
              </div>
              <span className="text-[11px] text-gray-500">
                {chat.length === 0
                  ? "No conversations yet"
                  : `${chat.length} message${chat.length > 1 ? "s" : ""}`}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <div
                className="min-h-0 overflow-hidden"
                style={{ height: `${chatTopHeight}%` }}
              >
                <div className="no-scrollbar h-full overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
                  <div className="space-y-4">
                    {chat.length === 0 && !loading && (
                      <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-500/10 shadow-inner shadow-cyan-900/30">
                          <Wand2 className="h-6 w-6 text-cyan-300" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-white">
                          Start with a hairstyle idea
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
                          Select a preset from the left sidebar or type your own
                          prompt below, then upload a clear portrait photo.
                        </p>
                      </div>
                    )}

                    <AnimatePresence initial={false}>
                      {chat.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                        >
                          <ChatMessage
                            item={item}
                            onImageClick={(url) => setSelectedImage(url)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {loading && <Loader />}

                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              <div
                onMouseDown={() => setIsResizing(true)}
                onTouchStart={() => setIsResizing(true)}
                className={`group relative flex h-3 shrink-0 cursor-row-resize items-center justify-center border-y border-white/10 ${
                  isResizing ? "bg-cyan-400/10" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="h-1 w-16 rounded-full bg-white/20 transition group-hover:bg-cyan-300/60" />
              </div>

              <div
                className="overflow-hidden bg-black/20"
                style={{ height: `${100 - chatTopHeight}%` }}
              >
                <div className="no-scrollbar h-full overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
                  <div className="mx-auto w-full max-w-4xl space-y-3">
                    {filePreview && (
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                          <img
                            src={filePreview}
                            alt="Uploaded preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200">
                            Photo attached
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            This portrait will be used to generate hairstyle previews.
                          </p>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 sm:text-sm">
                        {error}
                      </div>
                    )}

                    <ChatInput
                      prompt={prompt}
                      setPrompt={setPrompt}
                      file={file}
                      setFile={setFile}
                      onSubmit={handleSubmit}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <GalleryModal
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        loading={galleryLoading}
        items={gallery}
        onImageClick={(url) => setSelectedImage(url)}
      />

      <FullScreenImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}


























// "use client";

// import { useEffect, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Wand2,
//   Sparkles,
//   GalleryHorizontal,
//   Camera,
//   ImageIcon,
//   ArrowLeft,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// import ChatInput from "@/components/hairstyle/ChatInput";
// import ChatMessage from "@/components/hairstyle/ChatMessage";
// import Loader from "@/components/hairstyle/Loader";
// import GalleryModal from "@/components/hairstyle/GalleryModal";
// import FullScreenImageModal from "@/components/hairstyle/FullScreenImageModal";

// const PREDEFINED_PROMPTS = [
//   "Analyze the provided photo and suggest the best hairstyle for me as if I am going to a professional barber.",
//   "Analyze the provided photo and suggest the best Beard for me as if I am going to a professional barber.",
//   "Curly fade hairstyle with natural volume on top and clean tapered sides",
//   "Short textured crop with light fade and messy top",
//   "Buzz cut with sharp clean edges and even length",
//   "Low fade with side part and smooth combed finish",
//   "Heavy stubble beard with sharp cheek line and clean neckline",
//   "Short boxed beard with neat edges and natural density",
//   "Corporate beard with clean jawline and trimmed mustache",
//   "Balbo beard with defined chin beard and separated mustache",
//   "Van Dyke beard with pointed goatee and detached mustache",
//   "Clean mustache with light stubble and sharp finishing",
// ];

// export default function Page() {
//   const [prompt, setPrompt] = useState("");
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [chat, setChat] = useState([]);
//   const [error, setError] = useState(null);

//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [galleryLoading, setGalleryLoading] = useState(false);
//   const [gallery, setGallery] = useState([]);

//   const [selectedImage, setSelectedImage] = useState(null);

//   const messagesEndRef = useRef(null);

//   const router = useRouter();

//   useEffect(() => {
//     if (!file) {
//       setFilePreview(null);
//       return;
//     }

//     const url = URL.createObjectURL(file);
//     setFilePreview(url);

//     return () => URL.revokeObjectURL(url);
//   }, [file]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, loading]);

//   const handleSubmit = async () => {
//     if (!prompt.trim()) {
//       setError("Please enter a hairstyle prompt.");
//       return;
//     }

//     if (!file) {
//       setError("Please upload a face image.");
//       return;
//     }

//     setError(null);
//     setLoading(true);

//     const userMessage = {
//       id: `user-${Date.now()}`,
//       prompt,
//       originalImageUrl: filePreview || undefined,
//       role: "user",
//     };

//     setChat((prev) => [...prev, userMessage]);

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", file);
//       formData.append("prompt", prompt);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/hairstyle/hairstyle-generator`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         },
//       );

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "Failed to generate hairstyle");
//       }

//       const data = await res.json();

//       const generatedUrl =
//         data?.data?.generatedImageUrl ||
//         data?.data?.imageUrl ||
//         data?.generatedImageUrl ||
//         data?.imageUrl ||
//         "";

//       if (!generatedUrl) {
//         throw new Error("No generated image returned from API");
//       }

//       const assistantMessage = {
//         id: `ai-${Date.now()}`,
//         prompt,
//         generatedImageUrl: generatedUrl,
//         role: "assistant",
//       };

//       setChat((prev) => [...prev, assistantMessage]);
//       setPrompt("");
//       setFile(null);
//       setFilePreview(null);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenGallery = async () => {
//     setIsGalleryOpen(true);
//     setGalleryLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Please login first");
//       }

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/hairstyle/all-photos`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "Failed to fetch photos");
//       }

//       const data = await res.json();

//       const items = (data?.data || data || []).map((item) => ({
//         id: item._id || Math.random().toString(36).slice(2),
//         prompt: item.prompt || "Generated hairstyle",
//         imageUrl:
//           item.generatedImageUrl ||
//           item.imageUrl ||
//           item.originalImageUrl ||
//           "",
//       }));

//       setGallery(items);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to load gallery");
//     } finally {
//       setGalleryLoading(false);
//     }
//   };

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white">
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
//         <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-cyan-950/80" />
//       </div>

//       <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
//         <header className="mb-6 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             {/* Back button */}
//             <button
//               type="button"
//               onClick={() => router.push("/")}
//               className="mr-1 inline-flex items-center gap-1.5 cursor-pointer rounded-full border border-sky-300/70 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-sky-100 shadow-md shadow-sky-500/30 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-sky-200 hover:bg-sky-500/30 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-300/80"
//             >
//               <ArrowLeft className="h-3.5 w-3.5" />
//               <span className="hidden sm:inline">Back</span>
//             </button>

//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-400 shadow-lg shadow-cyan-400/40">
//               <Wand2 className="h-6 w-6 text-white" />
//             </div>

//             <div>
//               <h1 className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl">
//                 AI Hairstyle Generator
//               </h1>
//               <p className="text-xs text-gray-400 sm:text-sm">
//                 Upload your photo and generate stylish AI hairstyle & beard
//                 previews.
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleOpenGallery}
//             className="inline-flex items-center gap-2 rounded-xl cursor-pointer border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-100 shadow-md shadow-cyan-500/20 transition hover:border-cyan-300 hover:bg-cyan-400/15 hover:text-white"
//           >
//             <GalleryHorizontal className="h-4 w-4" />
//             View Photos
//           </button>
//         </header>

//         <section className="mb-4 flex flex-col gap-4 rounded-3xl border border-gray-800/70 bg-black/60 p-4 shadow-2xl shadow-cyan-900/40 backdrop-blur-xl sm:p-6">
//           <div className="flex flex-wrap gap-2">
//             {PREDEFINED_PROMPTS.map((chip) => (
//               <button
//                 key={chip}
//                 type="button"
//                 onClick={() => setPrompt(chip)}
//                 className="group inline-flex items-center gap-2 rounded-full border border-gray-700/80 bg-gray-900/70 px-3 py-1.5 text-xs text-gray-200 shadow transition hover:border-cyan-400/80 hover:bg-cyan-500/10 hover:text-cyan-200"
//               >
//                 <Sparkles className="h-3.5 w-3.5 text-cyan-300/80 group-hover:text-cyan-200" />
//                 <span>{chip}</span>
//               </button>
//             ))}
//           </div>

//           <ChatInput
//             prompt={prompt}
//             setPrompt={setPrompt}
//             file={file}
//             setFile={setFile}
//             onSubmit={handleSubmit}
//             loading={loading}
//           />

//           {filePreview && (
//             <div className="mt-1 flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700/80 bg-gray-900/80">
//                 <Camera className="h-5 w-5 text-cyan-300/80" />
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-700/80 bg-gray-900/60">
//                   <img
//                     src={filePreview}
//                     alt="Uploaded preview"
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//                 <span className="text-xs text-gray-400">
//                   Preview of your uploaded photo
//                 </span>
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="rounded-xl border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs text-red-200">
//               {error}
//             </div>
//           )}
//         </section>

//         <section className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-gray-800/70 bg-black/70 p-3 sm:p-4">
//           <div className="mb-2 flex items-center gap-2 px-1 text-xs text-gray-500">
//             <ImageIcon className="h-3.5 w-3.5 text-cyan-400/80" />
//             <span>Chat history</span>
//           </div>

//           <div className="relative flex-1 space-y-4 overflow-y-auto rounded-2xl bg-slate-950/60 p-3 sm:p-4">
//             {chat.length === 0 && !loading && (
//               <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 text-center">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-700/80 bg-gray-900/80 shadow-inner shadow-gray-900/60">
//                   <Wand2 className="h-6 w-6 text-cyan-300" />
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium text-gray-200">
//                     Start with a hairstyle idea
//                   </p>
//                   <p className="mt-1 text-xs text-gray-500">
//                     Choose a preset or type your own prompt, then upload a clear
//                     portrait photo.
//                   </p>
//                 </div>
//               </div>
//             )}

//             <AnimatePresence initial={false}>
//               {chat.map((item) => (
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, y: 14 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -8 }}
//                   transition={{ duration: 0.24, ease: "easeOut" }}
//                 >
//                   <ChatMessage
//                     item={item}
//                     onImageClick={(url) => setSelectedImage(url)}
//                   />
//                 </motion.div>
//               ))}
//             </AnimatePresence>

//             {loading && <Loader />}

//             <div ref={messagesEndRef} />
//           </div>
//         </section>
//       </div>

//       <GalleryModal
//         open={isGalleryOpen}
//         onClose={() => setIsGalleryOpen(false)}
//         loading={galleryLoading}
//         items={gallery}
//         onImageClick={(url) => setSelectedImage(url)}
//       />

//       <FullScreenImageModal
//         imageUrl={selectedImage}
//         onClose={() => setSelectedImage(null)}
//       />
//     </main>
//   );
// }

// // "use client";

// // import { useEffect, useRef, useState } from "react";
// // import { AnimatePresence, motion } from "framer-motion";
// // import {
// //   Wand2,
// //   Sparkles,
// //   GalleryHorizontal,
// //   Camera,
// //   ImageIcon,
// // } from "lucide-react";

// // import ChatInput from "@/components/hairstyle/ChatInput";
// // import ChatMessage from "@/components/hairstyle/ChatMessage";
// // import Loader from "@/components/hairstyle/Loader";
// // import GalleryModal from "@/components/hairstyle/GalleryModal";

// // const PREDEFINED_PROMPTS = [
// //   "Analyze the provided photo and suggest the best possible hairstyle for me as if I am going to a professional barber.",
// //   "Curly fade hairstyle with natural volume on top and clean tapered sides",
// //   "Long wavy hair with soft layers and natural flow",
// //   "Short textured crop with light fade and messy top",
// //   "Buzz cut with sharp clean edges and even length",
// //   "Low fade with side part and smooth combed finish",
// //   "Medium length layered hair with natural texture and volume",
// //   "Undercut hairstyle with longer hair on top and short sides",
// //   "Messy curly hairstyle with high volume and natural look",
// //   "Straight sleek hair with middle part and smooth finish",
// //   "High fade with spiky textured top",
// // ];

// // export default function Page() {
// //   const [prompt, setPrompt] = useState("");
// //   const [file, setFile] = useState(null);
// //   const [filePreview, setFilePreview] = useState(null);

// //   const [loading, setLoading] = useState(false);
// //   const [chat, setChat] = useState([]);
// //   const [error, setError] = useState(null);

// //   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
// //   const [galleryLoading, setGalleryLoading] = useState(false);
// //   const [gallery, setGallery] = useState([]);

// //   const messagesEndRef = useRef(null);

// //   useEffect(() => {
// //     if (!file) {
// //       setFilePreview(null);
// //       return;
// //     }

// //     const url = URL.createObjectURL(file);
// //     setFilePreview(url);

// //     return () => URL.revokeObjectURL(url);
// //   }, [file]);

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [chat, loading]);

// //   const handleSubmit = async () => {
// //     if (!prompt.trim()) {
// //       setError("Please enter a hairstyle prompt.");
// //       return;
// //     }

// //     if (!file) {
// //       setError("Please upload a face image.");
// //       return;
// //     }

// //     setError(null);
// //     setLoading(true);

// //     const userMessage = {
// //       id: `user-${Date.now()}`,
// //       prompt,
// //       originalImageUrl: filePreview || undefined,
// //       role: "user",
// //     };

// //     setChat((prev) => [...prev, userMessage]);

// //     try {
// //       const token = localStorage.getItem("token");
// //       const formData = new FormData();
// //       formData.append("image", file);
// //       formData.append("prompt", prompt);

// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/hairstyle/hairstyle-generator`,
// //         {
// //           method: "POST",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: formData,
// //         },
// //       );

// //       if (!res.ok) {
// //         const text = await res.text();
// //         throw new Error(text || "Failed to generate hairstyle");
// //       }

// //       const data = await res.json();

// //       const generatedUrl =
// //         data?.data?.generatedImageUrl ||
// //         data?.data?.imageUrl ||
// //         data?.generatedImageUrl ||
// //         data?.imageUrl ||
// //         "";

// //       if (!generatedUrl) {
// //         throw new Error("No generated image returned from API");
// //       }

// //       const assistantMessage = {
// //         id: `ai-${Date.now()}`,
// //         prompt,
// //         generatedImageUrl: generatedUrl,
// //         role: "assistant",
// //       };

// //       setChat((prev) => [...prev, assistantMessage]);
// //       setPrompt("");
// //       setFile(null);
// //       setFilePreview(null);
// //     } catch (err) {
// //       console.error(err);
// //       setError(err.message || "Something went wrong");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleOpenGallery = async () => {
// //     setIsGalleryOpen(true);
// //     setGalleryLoading(true);
// //     setError(null);

// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       throw new Error("Please login first");
// //     }

// //     try {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/hairstyle/all-photos`,
// //         {
// //           method: "GET",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         },
// //       );

// //       if (!res.ok) {
// //         const text = await res.text();
// //         throw new Error(text || "Failed to fetch photos");
// //       }

// //       const data = await res.json();

// //       const items = (data?.data || data || []).map((item) => ({
// //         id: item._id || Math.random().toString(36).slice(2),
// //         prompt: item.prompt || "Generated hairstyle",
// //         imageUrl:
// //           item.generatedImageUrl ||
// //           item.imageUrl ||
// //           item.originalImageUrl ||
// //           "",
// //       }));

// //       setGallery(items);
// //     } catch (err) {
// //       console.error(err);
// //       setError(err.message || "Failed to load gallery");
// //     } finally {
// //       setGalleryLoading(false);
// //     }
// //   };

// //   return (
// //     <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-cyan-950 text-white">
// //       <div className="pointer-events-none absolute inset-0">
// //         <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
// //         <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
// //         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-cyan-950/80" />
// //       </div>

// //       <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
// //         <header className="mb-6 flex items-center justify-between gap-4">
// //           <div className="flex items-center gap-3">
// //             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-400 shadow-lg shadow-cyan-400/40">
// //               <Wand2 className="h-6 w-6 text-white" />
// //             </div>

// //             <div>
// //               <h1 className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl">
// //                 AI Hairstyle Generator
// //               </h1>
// //               <p className="text-xs text-gray-400 sm:text-sm">
// //                 Upload your photo and generate stylish AI hairstyle previews.
// //               </p>
// //             </div>
// //           </div>

// //           <button
// //             type="button"
// //             onClick={handleOpenGallery}
// //             className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-100 shadow-md shadow-cyan-500/20 transition hover:border-cyan-300 hover:bg-cyan-400/15 hover:text-white"
// //           >
// //             <GalleryHorizontal className="h-4 w-4" />
// //             View Photos
// //           </button>
// //         </header>

// //         <section className="mb-4 flex flex-col gap-4 rounded-3xl border border-gray-800/70 bg-black/60 p-4 shadow-2xl shadow-cyan-900/40 backdrop-blur-xl sm:p-6">
// //           <div className="flex flex-wrap gap-2">
// //             {PREDEFINED_PROMPTS.map((chip) => (
// //               <button
// //                 key={chip}
// //                 type="button"
// //                 onClick={() => setPrompt(chip)}
// //                 className="group inline-flex items-center gap-2 rounded-full border border-gray-700/80 bg-gray-900/70 px-3 py-1.5 text-xs text-gray-200 shadow transition hover:border-cyan-400/80 hover:bg-cyan-500/10 hover:text-cyan-200"
// //               >
// //                 <Sparkles className="h-3.5 w-3.5 text-cyan-300/80 group-hover:text-cyan-200" />
// //                 <span>{chip}</span>
// //               </button>
// //             ))}
// //           </div>

// //           <ChatInput
// //             prompt={prompt}
// //             setPrompt={setPrompt}
// //             file={file}
// //             setFile={setFile}
// //             onSubmit={handleSubmit}
// //             loading={loading}
// //           />

// //           {filePreview && (
// //             <div className="mt-1 flex items-center gap-3">
// //               <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700/80 bg-gray-900/80">
// //                 <Camera className="h-5 w-5 text-cyan-300/80" />
// //               </div>

// //               <div className="flex items-center gap-3">
// //                 <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-700/80 bg-gray-900/60">
// //                   <img
// //                     src={filePreview}
// //                     alt="Uploaded preview"
// //                     className="h-full w-full object-cover"
// //                   />
// //                 </div>
// //                 <span className="text-xs text-gray-400">
// //                   Preview of your uploaded photo
// //                 </span>
// //               </div>
// //             </div>
// //           )}

// //           {error && (
// //             <div className="rounded-xl border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs text-red-200">
// //               {error}
// //             </div>
// //           )}
// //         </section>

// //         <section className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-gray-800/70 bg-black/70 p-3 sm:p-4">
// //           <div className="mb-2 flex items-center gap-2 px-1 text-xs text-gray-500">
// //             <ImageIcon className="h-3.5 w-3.5 text-cyan-400/80" />
// //             <span>Chat history</span>
// //           </div>

// //           <div className="relative flex-1 space-y-4 overflow-y-auto rounded-2xl bg-slate-950/60 p-3 sm:p-4">
// //             {chat.length === 0 && !loading && (
// //               <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 text-center">
// //                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-700/80 bg-gray-900/80 shadow-inner shadow-gray-900/60">
// //                   <Wand2 className="h-6 w-6 text-cyan-300" />
// //                 </div>

// //                 <div>
// //                   <p className="text-sm font-medium text-gray-200">
// //                     Start with a hairstyle idea
// //                   </p>
// //                   <p className="mt-1 text-xs text-gray-500">
// //                     Choose a preset or type your own prompt, then upload a clear
// //                     portrait photo.
// //                   </p>
// //                 </div>
// //               </div>
// //             )}

// //             <AnimatePresence initial={false}>
// //               {chat.map((item) => (
// //                 <motion.div
// //                   key={item.id}
// //                   initial={{ opacity: 0, y: 14 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -8 }}
// //                   transition={{ duration: 0.24, ease: "easeOut" }}
// //                 >
// //                   <ChatMessage item={item} />
// //                 </motion.div>
// //               ))}
// //             </AnimatePresence>

// //             {loading && <Loader />}

// //             <div ref={messagesEndRef} />
// //           </div>
// //         </section>
// //       </div>

// //       <GalleryModal
// //         open={isGalleryOpen}
// //         onClose={() => setIsGalleryOpen(false)}
// //         loading={galleryLoading}
// //         items={gallery}
// //       />
// //     </main>
// //   );
// // }
