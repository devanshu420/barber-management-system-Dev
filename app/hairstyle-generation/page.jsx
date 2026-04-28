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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        },
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
        },
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
        <header className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-sky-100 backdrop-blur-md transition hover:border-sky-300/70 hover:bg-sky-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-300 shadow-lg shadow-cyan-500/30">
              <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-slate-950" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="bg-gradient-to-r from-cyan-300 via-white to-teal-200 bg-clip-text text-xl font-bold text-transparent sm:text-2xl lg:text-3xl">
                AI Hairstyle Generator
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-400 line-clamp-2">
                Upload your photo, try smart hairstyle and beard prompts, and
                preview polished AI-generated looks before visiting the barber.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-100 shadow-md shadow-cyan-500/10 transition hover:border-cyan-300 hover:bg-cyan-400/15 hover:text-white"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden xs:inline">Prompts</span>
            </button>

            <button
              type="button"
              onClick={handleOpenGallery}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs sm:text-sm sm:px-4 sm:py-2.5 font-medium text-cyan-100 shadow-md shadow-cyan-500/10 transition hover:border-cyan-300 hover:bg-cyan-400/15 hover:text-white"
            >
              <GalleryHorizontal className="h-4 w-4" />
              <span>View Photos</span>
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
          {/* Mobile Sidebar */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-0 z-50 md:hidden"
              >
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <motion.aside
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-hidden rounded-r-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl"
                >
                  <div className="mb-4 flex shrink-0 items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                        Pick a style prompt
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        Click any prompt to fill the input quickly.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="no-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 pb-4">
                    <PromptSection
                      title="Face analysis"
                      icon={UserRound}
                      items={FACE_PROMPTS}
                      onPick={(prompt) => {
                        setPrompt(prompt);
                        setIsMobileSidebarOpen(false);
                      }}
                      activePrompt={prompt}
                    />

                    <PromptSection
                      title="Haircuts"
                      icon={Scissors}
                      items={HAIR_STYLE_PROMPTS}
                      onPick={(prompt) => {
                        setPrompt(prompt);
                        setIsMobileSidebarOpen(false);
                      }}
                      activePrompt={prompt}
                    />

                    <PromptSection
                      title="Beard styles"
                      icon={Sparkles}
                      items={BEARD_STYLE_PROMPTS}
                      onPick={(prompt) => {
                        setPrompt(prompt);
                        setIsMobileSidebarOpen(false);
                      }}
                      activePrompt={prompt}
                    />
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar */}
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
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-gray-500">
                <ImageIcon className="h-3.5 w-3.5 text-cyan-400/80" />
                <span className="hidden xs:inline">Chat history</span>
                <span className="xs:hidden">Chat</span>
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
                <div className="no-scrollbar h-full overflow-y-auto px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-5">
                  <div className="space-y-3 sm:space-y-4">
                    {chat.length === 0 && !loading && (
                      <div className="flex flex-col items-center justify-center px-3 py-8 sm:px-4 sm:py-10 text-center">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-500/10 shadow-inner shadow-cyan-900/30">
                          <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-300" />
                        </div>

                        <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-white">
                          Start with a hairstyle idea
                        </h2>
                        <p className="mt-1.5 sm:mt-2 max-w-xs sm:max-w-md text-xs sm:text-sm leading-5 sm:leading-6 text-gray-400">
                          Select a preset from the prompts menu or type your own
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
                className={`group relative flex h-2 sm:h-3 shrink-0 cursor-row-resize items-center justify-center border-y border-white/10 ${
                  isResizing ? "bg-cyan-400/10" : "bg-white/5 hover:bg-white/10"
                } hidden sm:flex`}
              >
                <div className="h-1 w-12 sm:w-16 rounded-full bg-white/20 transition group-hover:bg-cyan-300/60" />
              </div>

              <div
                className="overflow-hidden bg-black/20"
                style={{
                  height: isMobileSidebarOpen
                    ? "100%"
                    : `${100 - chatTopHeight}%`,
                }}
              >
                <div className="no-scrollbar h-full overflow-y-auto px-2 py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-4">
                  <div className="mx-auto w-full max-w-4xl space-y-2.5 sm:space-y-3">
                    {filePreview && (
                      <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3">
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                          <img
                            src={filePreview}
                            alt="Uploaded preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-200">
                            Photo attached
                          </p>
                          <p className="truncate text-[10px] sm:text-xs text-gray-500">
                            This portrait will be used to generate hairstyle
                            previews.
                          </p>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-2.5 py-2 text-[10px] sm:text-xs sm:px-3 text-red-200">
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
