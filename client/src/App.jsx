import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hi");
  const [voice, setVoice] = useState("5wMbvhmH1gu6ikxvSjzY");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const voices = [
    { id: "5wMbvhmH1gu6ikxvSjzY", name: "Voice 1" },
    { id: "HUcv7tyt8K2WejyuPpLi", name: "Voice 2" },
    { id: "VwDEmEhQz5IX6lwITIJw", name: "Voice 3" },
  ];

  const languages = [
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
];

  const generateSpeech = async () => {
    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl("");
      }

      const response = await axios.post(
        "https://text-to-speech-h8be.onrender.com/api/tts",
        {
          text,
          language,
          voice,
        },
        {
          responseType: "blob",
        }
      );

      if (response.data.type?.includes("application/json")) {
        const errorData = JSON.parse(await response.data.text());
        throw new Error(errorData.message || "Speech generation failed.");
      }

      const audioBlob = new Blob([response.data], {
        type: "audio/mpeg",
      });

      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Speech generate nahi ho payi. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearText = () => {
    setText("");
    setError("");

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
  };

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const selectedLanguage = languages.find(
    (lang) => lang.code === language
  );

  const selectedVoice = voices.find((v) => v.id === voice);

  return (
    <div className="min-h-screen bg-[#08090D] text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/4 w-[500px] h-[500px] bg-violet-700/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 -right-48 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Navbar */}
        <nav className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
              <span className="text-2xl">🔊</span>
            </div>

            <div>
              <h1 className="font-bold text-lg tracking-tight">
                Ur<span className="text-violet-400">Studio</span>
              </h1>
              <p className="text-[11px] text-gray-500 tracking-widest uppercase">
                AI Speech Generator
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03]">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Studio is ready</span>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-violet-500/20 bg-violet-500/[0.07]">
            <span className="text-violet-300 text-xs">✦</span>
            <span className="text-xs font-medium text-violet-300">
              YOUR VOICE. YOUR WORDS.
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Words into
            <span className="block mt-2 bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Voice.
            </span>
          </h2>

          <p className="max-w-xl mx-auto mt-5 text-gray-400 text-sm sm:text-base leading-7">
            Transform your text into natural-sounding speech.
            Choose a language, pick a voice, and bring your words to life.
          </p>
        </header>

        {/* Main Workspace */}
        <main className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Text Editor */}
          <section className="rounded-3xl border border-white/[0.08] bg-[#111218]/90 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <span className="text-violet-300">✍️</span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm">
                    Speech Workspace
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Create your audio
                  </p>
                </div>
              </div>

              <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-white/[0.08] px-2.5 py-1 rounded-lg">
                Editor
              </span>
            </div>

            <div className="p-5 sm:p-7">
              {/* Text Input */}
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-200">
                  Your Script
                </label>

                <span className="text-xs text-gray-500">
                  Max 5,000 characters
                </span>
              </div>

              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError("");
                }}
                placeholder="Start typing or paste your text here..."
                maxLength={5000}
                className="w-full h-56 sm:h-64 bg-[#0B0C11] border border-white/[0.08] rounded-2xl p-5 text-sm sm:text-base text-gray-200 placeholder-gray-600 outline-none focus:border-violet-500/60 focus:ring-4 focus:ring-violet-500/[0.07] resize-y transition-all leading-7"
              />

              {/* Text Counters */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 mb-7">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    <span className="text-gray-300 font-medium">
                      {text.length}
                    </span>{" "}
                    / 5000 characters
                  </span>

                  <span className="w-1 h-1 rounded-full bg-gray-700" />

                  <span>
                    <span className="text-gray-300 font-medium">
                      {wordCount}
                    </span>{" "}
                    words
                  </span>
                </div>

                <button
                  onClick={clearText}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  Clear text ↗
                </button>
              </div>

              {/* Language & Voice */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2.5 uppercase tracking-wider">
                    🌐 Language
                  </label>

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full appearance-none bg-[#0B0C11] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-gray-200 outline-none focus:border-violet-500/50 transition cursor-pointer"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2.5 uppercase tracking-wider">
                    🎙️ Voice
                  </label>

                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full appearance-none bg-[#0B0C11] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-gray-200 outline-none focus:border-violet-500/50 transition cursor-pointer"
                  >
                    {voices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-5 flex items-start gap-3 bg-red-500/[0.07] border border-red-500/20 text-red-300 rounded-xl px-4 py-3.5 text-sm">
                  <span>⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generateSpeech}
                disabled={loading}
                className="group w-full mt-7 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed py-4 font-semibold text-sm shadow-lg shadow-violet-950/40 transition-all duration-300 active:scale-[0.99]"
              >
                <span className="flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating your speech...
                    </>
                  ) : (
                    <>
                      🔊 Generate Speech <span>✦</span>
                    </>
                  )}
                </span>
              </button>

              <p className="text-center text-[11px] text-gray-600 mt-3">
                Powered by ElevenLabs AI · Audio generated in seconds
              </p>
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="space-y-5">
            {/* Settings Card */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#111218]/90 backdrop-blur-xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-sm">Your Settings</h3>
                <span className="text-violet-300 text-xs">✦</span>
              </div>

              {/* Language Info */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.05]">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center text-2xl">
                  {selectedLanguage?.flag}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Output Language
                  </p>
                  <p className="text-sm font-semibold text-gray-200">
                    {selectedLanguage?.name}
                  </p>
                </div>
              </div>

              {/* Voice Info */}
              <div className="flex items-center gap-3 p-3.5 mt-3 rounded-2xl bg-white/[0.025] border border-white/[0.05]">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <span className="text-xl">🎙️</span>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Selected Voice
                  </p>
                  <p className="text-sm font-semibold text-gray-200">
                    {selectedVoice?.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    AI Voice
                  </p>
                </div>
              </div>

              {/* Character Progress */}
              <div className="border-t border-white/[0.06] my-5" />

              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-gray-500">Characters used</span>
                <span className="text-gray-300">{text.length} / 5000</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-300"
                  style={{
                    width: `${Math.min((text.length / 5000) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Audio Result Card */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#111218]/90 backdrop-blur-xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <span>🎧</span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm">Your Audio</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Generated speech
                  </p>
                </div>
              </div>

              {audioUrl ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-300 font-medium">
                      Speech generated successfully
                    </span>
                  </div>

                  <audio
                    controls
                    src={audioUrl}
                    className="w-full h-10 mb-4"
                  />

                  <a
                    href={audioUrl}
                    download="speech.mp3"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 py-3 text-sm font-semibold transition"
                  >
                    ⬇️ Download MP3
                  </a>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] py-8 px-4 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                    <span className="text-2xl opacity-50">🎵</span>
                  </div>

                  <p className="text-sm font-medium text-gray-400">
                    No audio yet
                  </p>

                  <p className="text-xs text-gray-600 mt-1.5 leading-5">
                    Your generated speech will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Tip Card */}
            <div className="rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.07] to-indigo-500/[0.03] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-violet-300">✦</span>
                <p className="text-xs font-semibold text-violet-200">
                  Pro Tip
                </p>
              </div>

              <p className="text-xs text-gray-500 leading-5">
                Use clear sentences and punctuation for more natural-sounding
                speech.
              </p>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © 2026 UrStudio · AI Text-to-Speech
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Built with React, Node.js & ElevenLabs
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
