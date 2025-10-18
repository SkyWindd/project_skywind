import React, { useState, useRef, useEffect } from "react";
import { Bot, X } from "lucide-react";
import "./ChatBox.css";

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Chào bạn! Tôi là Sidon, bạn cần hỗ trợ gì?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "Không có phản hồi từ server" },
      ]);
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="chatbox-container animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
            <div className="flex items-center gap-2 font-semibold">
              <Bot size={18} className="animate-wiggle" />
              <span>Chat hỗ trợ</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="chatbox-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-left text-gray-400 italic">
                Đang trả lời...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
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
