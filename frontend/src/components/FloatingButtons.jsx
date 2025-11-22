import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------
    TRANSLATION (Google Translate Free API)
------------------------------------------------------------------ */
const translateText = async (text, targetLang) => {
  if (!text) return "";

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&dt=bd&dt=rm&q=${encodeURIComponent(
        text
      )}`
    );

    if (!res.ok) throw new Error("Translation API failed");

    const data = await res.json();

    // Join ALL segments properly
    return data[0].map((seg) => seg[0]).join(" ");
  } catch (err) {
    console.error("Translate Error:", err);
    return text; // fallback
  }
};


/* ------------------------------------------------------------------
    SAFE SPEECH OUTPUT
------------------------------------------------------------------ */
const speakSafe = (text, lang) => {
  try {
    if (!window.speechSynthesis) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "hi" ? "hi-IN" : lang === "bn" ? "bn-BD" : "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (err) {
    console.error("Speech failed:", err);
  }
};

/* ------------------------------------------------------------------
    URL VALIDATION AND REDIRECT
------------------------------------------------------------------ */
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

const extractUrl = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches && matches.length > 0 ? matches[0] : null;
};

// URL redirect will be handled inside component with navigate hook

/* ------------------------------------------------------------------
    MAIN COMPONENT (Play removed, no UI changes)
------------------------------------------------------------------ */
export default function FloatingButtons() {
  const navigate = useNavigate();
  
  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I'm your banking assistant. How can I help you today?",
      english: "Hello! I'm your banking assistant. How can I help you today?",
    },
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const recognitionRef = useRef(null);

  /* ------------------------------------------------------------------
      URL REDIRECT HANDLER (USES REACT ROUTER)
  ------------------------------------------------------------------ */
  const handleUrlRedirect = (text) => {
    const url = extractUrl(text);
    if (url && isValidUrl(url)) {
      // Check if it's an external URL (http/https) or internal route
      if (url.startsWith("http://") || url.startsWith("https://")) {
        // External URL - redirect in same tab
        window.location.href = url;
      } else {
        // Internal route - use React Router navigation
        navigate(url);
      }
      return true;
    }
    // Check if it's a relative path (starts with /)
    if (text && text.trim().startsWith("/")) {
      navigate(text.trim());
      return true;
    }
    return false;
  };

  // Helper states (exact copy of chatbot)
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [helperLanguage, setHelperLanguage] = useState("en");
  const [helperInput, setHelperInput] = useState("");
  const [helperMessages, setHelperMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I'm your banking assistant. How can I help you today?",
      english: "Hello! I'm your banking assistant. How can I help you today?",
    },
  ]);
  const [helperHistory, setHelperHistory] = useState([]);
  const helperRecognitionRef = useRef(null);

  /* ------------------------------------------------------------------
      VOICE LISTENING
------------------------------------------------------------------ */
  const startListening = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.error("Speech recognition unsupported.");
        return;
      }

      const rec = new SpeechRecognition();
      rec.lang = language === "hi" ? "hi-IN" : language === "bn" ? "bn-BD" : "en-US";
      rec.interimResults = false;

      rec.onresult = async (event) => {
        try {
          const spoken = event.results[0][0].transcript;

          const englishText = await translateText(spoken, "en");

          setInput(englishText);
          sendMessage(englishText);
        } catch (err) {
          console.error("Voice processing error:", err);
        }
      };

      rec.onerror = (e) => console.error("Speech error:", e.error);
      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.error("startListening failed:", err);
    }
  };

  /* ------------------------------------------------------------------
      SEND MESSAGE (BACKEND URL UPDATED)
------------------------------------------------------------------ */
  const sendMessage = async (text) => {
    if (!text) return;

    // Check if input contains a valid URL and redirect
    if (handleUrlRedirect(text)) {
      const userMsg = { id: Date.now(), sender: "user", text, english: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      return;
    }

    try {
      const userMsg = { id: Date.now(), sender: "user", text, english: text };
      setMessages((prev) => [...prev, userMsg]);

      let backendReply = null;

      try {
        const res = await fetch("https://accessone-bank-assistants.onrender.com/chatbot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text ,history:chatHistory}),
        });

        if (res.ok) {
          const data = await res.json();
          backendReply = data?.answer || null;
          setChatHistory((prev) => [...prev,  text, backendReply ]);
        }
      } catch (err) {
        console.error("Backend unreachable:", err);
      }

      // if (!backendReply || backendReply.trim() === "") {
      //   backendReply = "Sorry, I am not awake right now.";
      // }

      const translated = await translateText(backendReply, language);

      // Check if response contains a valid URL and redirect
      handleUrlRedirect(backendReply);
      handleUrlRedirect(translated);

      const assistantMsg = {
        id: Date.now() + 1,
        sender: "assistant",
        text: translated,
        english: backendReply,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      speakSafe(translated, language);

      setInput("");
    } catch (err) {
      console.error("sendMessage failed:", err);
    }
  };

  /* ------------------------------------------------------------------
      HELPER VOICE LISTENING (EXACT COPY OF CHATBOT)
------------------------------------------------------------------ */
  const startHelperListening = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.error("Speech recognition unsupported.");
        return;
      }

      const rec = new SpeechRecognition();
      rec.lang = helperLanguage === "hi" ? "hi-IN" : helperLanguage === "bn" ? "bn-BD" : "en-US";
      rec.interimResults = false;

      rec.onresult = async (event) => {
        try {
          const spoken = event.results[0][0].transcript;

          const englishText = await translateText(spoken, "en");

          setHelperInput(englishText);
          sendHelperMessage(englishText);
        } catch (err) {
          console.error("Voice processing error:", err);
        }
      };

      rec.onerror = (e) => console.error("Speech error:", e.error);
      rec.start();
      helperRecognitionRef.current = rec;
    } catch (err) {
      console.error("startHelperListening failed:", err);
    }
  };

  /* ------------------------------------------------------------------
      HELPER SEND MESSAGE (EXACT COPY OF CHATBOT, DIFFERENT ENDPOINT)
------------------------------------------------------------------ */
  const sendHelperMessage = async (text) => {
    if (!text) return;

    // Check if input contains a valid URL and redirect
    if (handleUrlRedirect(text)) {
      const userMsg = { id: Date.now(), sender: "user", text, english: text };
      setHelperMessages((prev) => [...prev, userMsg]);
      setHelperInput("");
      return;
    }

    try {
      const userMsg = { id: Date.now(), sender: "user", text, english: text };
      setHelperMessages((prev) => [...prev, userMsg]);

      let backendReply = null;

      try {
        const res = await fetch("https://accessone-bank-assistants.onrender.com/helper/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text ,history:helperHistory}),
        });

        if (res.ok) {
          const data = await res.json();
          backendReply = data?.item.url || null;
          setHelperHistory((prev) => [...prev,  text, backendReply ]);
        }
      } catch (err) {
        console.error("Backend unreachable:", err);
      }

      // if (!backendReply || backendReply.trim() === "") {
      //   backendReply = "Sorry, I am not awake right now.";
      // }

      // Check if backendReply is a valid URL or route and redirect
      if (backendReply && (isValidUrl(backendReply) || backendReply.trim().startsWith("/"))) {
        handleUrlRedirect(backendReply);
        const assistantMsg = {
          id: Date.now() + 1,
          sender: "assistant",
          text: `Redirecting to: ${backendReply}`,
          english: backendReply,
        };
        setHelperMessages((prev) => [...prev, assistantMsg]);
        setHelperInput("");
        return;
      }

      const translated = await translateText(backendReply, helperLanguage);

      // Check if response contains a valid URL and redirect
      handleUrlRedirect(backendReply);
      handleUrlRedirect(translated);

      const assistantMsg = {
        id: Date.now() + 1,
        sender: "assistant",
        text: translated,
        english: backendReply,
      };

      setHelperMessages((prev) => [...prev, assistantMsg]);

      speakSafe(translated, helperLanguage);

      setHelperInput("");
    } catch (err) {
      console.error("sendHelperMessage failed:", err);
    }
  };

  /* ------------------------------------------------------------------
      UI
------------------------------------------------------------------ */
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Helper Button */}
        <div className="relative">
          <button
            onClick={() => {
              setIsHelperOpen((v) => !v);
              setIsChatOpen(false);
            }}
            className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center"
          >
            ❓
          </button>

          {isHelperOpen && (
            <div className="absolute bottom-full right-0 mb-4 w-96 bg-white rounded-lg shadow-xl border">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-lg font-semibold">Banking Helper</h3>

              <select
                value={helperLanguage}
                onChange={(e) => setHelperLanguage(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
              </select>
            </div>

            <div className="p-3 max-h-64 overflow-y-auto space-y-2">
              {helperMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2 rounded ${
                    m.sender === "assistant" ? "bg-blue-50" : "bg-gray-100 text-right"
                  }`}
                >
                  <div className="text-sm">{m.text}</div>
                  {m.english && (
                    <div className="text-xs text-gray-500 italic">
                      English: {m.english}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t">
              <input
                value={helperInput}
                onChange={(e) => setHelperInput(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Type message…"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => sendHelperMessage(helperInput)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Send
                </button>

                <button
                  onClick={startHelperListening}
                  className="px-3 py-2 border rounded"
                >
                  🎤 Listen
                </button>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Chatbot Button */}
        <div className="relative">
          <button
            onClick={() => {
              setIsChatOpen((v) => !v);
              setIsHelperOpen(false);
            }}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
          >
            💬
          </button>

          {isChatOpen && (
            <div className="absolute bottom-full right-0 mb-4 w-96 bg-white rounded-lg shadow-xl border">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-lg font-semibold">Banking Assistant</h3>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
              </select>
            </div>

            <div className="p-3 max-h-64 overflow-y-auto space-y-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2 rounded ${
                    m.sender === "assistant" ? "bg-blue-50" : "bg-gray-100 text-right"
                  }`}
                >
                  <div className="text-sm">{m.text}</div>
                  {m.english && (
                    <div className="text-xs text-gray-500 italic">
                      English: {m.english}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Type message…"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => sendMessage(input)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Send
                </button>

                <button
                  onClick={startListening}
                  className="px-3 py-2 border rounded"
                >
                  🎤 Listen
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}
