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

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
        body: JSON.stringify({ message: sendText, user_id: 2 }),s
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { reply: text };
      }

      const botMsg = {
        sender: "bot",
        text: data.reply || data.output || data.message || text,
        products: data.products || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Lỗi kết nối tới server!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🟦 Hàm xử lý ảnh – đảm bảo đúng URL backend
  const getImageUrl = (img) => {
    if (!img) {
      return "https://via.placeholder.com/80x80?text=No+Image";
    }

    // Nếu backend đã trả full URL → dùng luôn
    if (img.startsWith("http")) return img;

    // Nếu backend trả "uploads/xxx" → thêm domain backend vào
    return `http://127.0.0.1:5000/${img}`;
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
                className={`${
                  msg.sender === "user" ? "text-right" : "text-left"
                } mb-2`}
              >
                {/* BUBBLE */}
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>

                {/* PRODUCT LIST */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {msg.products.map((p) => (
                      <div
                        key={p.product_id}
                        className="flex gap-3 border rounded-lg p-3 bg-white shadow"
                      >
                        <img
                          src={getImageUrl(p.images?.[0])}
                          alt={p.name}
                          className="w-20 h-20 object-cover rounded border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />

                        <div className="flex-1">
                          <div className="font-semibold text-sm">{p.name}</div>

                          <div className="text-blue-600 font-bold text-sm">
                            {p.price.toLocaleString()}₫
                          </div>

                          {p.old_price && (
                            <div className="text-gray-400 text-xs line-through">
                              {p.old_price.toLocaleString()}₫
                            </div>
                          )}

                          <a
                            href={`/laptop/${p.slug}`}
                            target="_blank"
                            className="text-xs text-blue-500 underline"
                          >
                            Xem chi tiết
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-left text-gray-400 italic">
                Đang trả lời...
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
