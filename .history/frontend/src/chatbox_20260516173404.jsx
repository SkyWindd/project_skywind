import React, { useState, useRef, useEffect } from "react";
import { Bot, X } from "lucide-react";
import "./ChatBox.css";

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Chào bạn! Tôi là Bi, bạn cần hỗ trợ gì?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ Parse response từ AI Agent — hỗ trợ cả JSON lẫn text thường
  const parseAIResponse = (raw) => {
  try {
    const parsed = JSON.parse(raw);

    // ✅ THÊM: output là JSON string lồng bên trong
    if (parsed.output && typeof parsed.output === "string") {
      try {
        const inner = JSON.parse(parsed.output);
        if (inner.type === "product") return { text: inner.message || "", products: inner.products || [] };
        if (inner.type === "text") return { text: inner.message || "", products: [] };
      } catch {}
      return { text: parsed.output, products: [] };
    }

    if (parsed.type === "product") {
      return { text: parsed.message || "", products: parsed.products || [] };
    }
    if (parsed.type === "text") {
      return { text: parsed.message || raw, products: [] };
    }
    return {
      text: parsed.output || parsed.reply || parsed.message || raw,
      products: parsed.products || [],
    };
  } catch {
    const match = raw.match(/\{[\s\S]*"type"\s*:\s*"product"[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        return { text: parsed.message || "", products: parsed.products || [] };
      } catch {}
    }
    return { text: raw, products: [] };
  }
};

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const sendText = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sendText, user_id: 2 }),
      });

      const raw = await res.text();
      const { text, products } = parseAIResponse(raw);
      setMessages((prev) => [...prev, { sender: "bot", text, products }]);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Lỗi kết nối tới server!", products: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="chatbox-container animate-fade-in">
          {/* HEADER */}
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
            <div className="flex items-center gap-2 font-semibold">
              <Bot size={18} className="animate-wiggle" />
              <span>Chat hỗ trợ</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className="chatbox-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${msg.sender === "user" ? "text-right" : "text-left"} mb-2`}
              >
                {/* BUBBLE TEXT */}
                {msg.text ? (
                  <div
                    className={`inline-block px-3 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                ) : null}

                {/* ✅ PRODUCT CARDS — dùng image_url mới */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {msg.products.map((p, i) => (
                      <div
                        key={p.id || i}
                        className="flex gap-3 border rounded-lg p-3 bg-white shadow"
                      >
                        <img
                          src={p.image_url || "https://via.placeholder.com/80x80?text=No+Image"}
                          alt={p.name}
                          className="w-20 h-20 object-contain rounded border bg-gray-50"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                            {p.name}
                          </div>

                          <div className="text-blue-600 font-bold text-sm mb-1">
                            {p.price?.toLocaleString("vi-VN")}₫
                          </div>

                          {/* Specs */}
                          {p.specs && Object.keys(p.specs).length > 0 && (
                            <div className="grid grid-cols-2 gap-1 mb-2">
                              {Object.entries(p.specs).map(([key, val]) => (
                                <div key={key} className="bg-gray-50 rounded px-1.5 py-0.5">
                                  <span className="text-gray-400 text-[10px] block">{key}</span>
                                  <span className="text-gray-700 text-[11px] font-medium truncate block">{val}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium ${p.in_stock ? "text-green-600" : "text-red-500"}`}>
                              {p.in_stock ? "● Còn hàng" : "● Hết hàng"}
                            </span>
                            <a
                              href={`/laptop/${p.slug || p.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-500 underline"
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-left text-gray-400 italic text-sm">
                Bi đang trả lời...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* FOOTER */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Gửi
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all animate-glow animate-wiggle"
        >
          <Bot size={32} />
        </button>
      )}
    </div>
  );
}