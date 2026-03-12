// frontend/app/hairstyle-preview/page.jsx
"use client";

import { useState } from "react";
import {
  analyzeFace,
  generateHairstyleImages,
} from "../../lib/hairStyleApi";

export default function HairstylePreviewPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setAnalysis(null);
    setResults([]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const data = await analyzeFace(file);
      setAnalysis(data.analysis);
    } catch (e) {
      console.error(e);
      setError(e.message || "Analysis error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!file || !analysis) return;
    const styles =
      analysis?.recommendedHairstyles?.map((h) => h.name) || [];
    if (!styles.length) {
      setError("No styles found in analysis JSON");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await generateHairstyleImages(file, styles);
      setResults(data.suggestions || []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Generation error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            BarberBook AI Hairstyle Preview
          </h1>
          <p className="text-sm text-gray-400">
            Upload your photo, get face analysis, and preview
            4–5 AI-generated hairstyles before booking.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-8 items-start">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-gray-300">
                Upload portrait (JPG/PNG, max 5MB)
              </span>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="block w-full text-sm text-gray-300
                             file:mr-3 file:py-2 file:px-3
                             file:rounded-md file:border-0
                             file:text-xs file:font-semibold
                             file:bg-teal-500/20 file:text-teal-300
                             hover:file:bg-teal-500/30"
                />
              </div>
            </label>

            {preview && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">
                  Original photo
                </p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-xl border border-gray-800 shadow-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-black text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Analyze Face"}
              </button>
              <button
                onClick={handleGenerate}
                disabled={!file || !analysis || loading}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Hairstyle Images
              </button>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            {analysis && (
              <div className="mt-3 bg-gray-900/80 border border-gray-800 rounded-xl p-3 max-h-80 overflow-auto text-xs leading-relaxed">
                <div className="flex flex-wrap items-center justify-between mb-2">
                  <span className="font-semibold text-gray-200">
                    Face analysis JSON
                  </span>
                  {analysis.faceShape && (
                    <span className="text-[11px] text-teal-300">
                      {analysis.faceShape} •{" "}
                      {analysis.hairType} •{" "}
                      {analysis.ageRange}
                    </span>
                  )}
                </div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>

        {results.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              AI Hairstyle Previews
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {results.map((item) => (
                <div
                  key={item.name}
                  className="bg-gray-900/70 border border-gray-800 rounded-2xl p-3 flex flex-col gap-2"
                >
                  <div className="text-sm font-semibold">
                    {item.name}
                  </div>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full aspect-square object-cover rounded-xl border border-gray-800"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-xl border border-gray-800 flex items-center justify-center text-xs text-red-400">
                      No image
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                    <span>
                      Maintenance:{" "}
                      <span className="text-teal-300">
                        {item.maintenanceLevel || "Medium"}
                      </span>
                    </span>
                    <button className="px-2 py-1 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/40 text-[11px]">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
