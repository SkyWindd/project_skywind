import React, { useState, useRef, useEffect } from "react";
import { Bot, X } from "lucide-react";
import "./ChatBox.css";
import { useAuth } from "./context/AuthContext";

// ── Status badge config ───────────────────────────────────
const STATUS_STYLE = {
  "đã hủy":       { label: "Đã hủy",        bg: "#FCEBEB", color: "#A32D2D", icon: "❌" },
  "đang giao":    { label: "Đang giao",      bg: "#E1F5EE", color: "#0F6E56", icon: "🚚" },
  "đã giao":      { label: "Đã giao",        bg: "#EAF3DE", color: "#3B6D11", icon: "✅" },
  "đang xử lý":  { label: "Đang xử lý",     bg: "#E6F1FB", color: "#185FA5", icon: "⚙️" },
  "chờ xác nhận": { label: "Chờ xác nhận",  bg: "#FAEEDA", color: "#854F0B", icon: "⏳" },
};

function getStatus(status = "") {
  return STATUS_STYLE[status.toLowerCase()] || { label: status, bg: "#F1EFE8", color: "#5F5E5A", icon: "📦" };
}

function formatPrice(amount) {
  if (!amount && amount !== 0) return "—";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(dateStr));
  } catch { return dateStr; }
}

// ── Order Card component ──────────────────────────────────
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const st = getStatus(order.status);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 8,
      fontSize: 13,
    }}>
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{st.icon}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Đơn #{order.order_id}</div>
            {order.order_date && (
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{formatDate(order.order_date)}</div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: st.bg, color: st.color,
            borderRadius: 20, padding: "2px 10px",
            fontSize: 11, fontWeight: 600,
          }}>
            {st.label}
          </span>
          {order.items?.length > 0 && (
            <button
              onClick={() => setExpanded(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 14, padding: 0 }}
            >
              {expanded ? "▲" : "▼"}
            </button>
          )}
        </div>
      </div>

      {order.total_amount != null && (
        <div style={{ padding: "0 14px 10px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#9ca3af" }}>Tổng cộng</span>
          <span style={{ fontWeight: 700, color: "#185FA5" }}>{formatPrice(order.total_amount)}</span>
        </div>
      )}

      {expanded && order.items?.length > 0 && (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "8px 14px", background: "#fafafa" }}>
          {order.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "3px 0",
              borderBottom: i < order.items.length - 1 ? "1px solid #f3f4f6" : "none",
              fontSize: 12,
            }}>
              <span>{item.product_name} <span style={{ color: "#9ca3af" }}>×{item.quantity}</span></span>
              <span style={{ fontWeight: 500 }}>{formatPrice(item.price)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Parse AI response ─────────────────────────────────────
const parseAIResponse = (raw) => {
  const tryParse = (str) => {
    try { return JSON.parse(str); } catch { return null; }
  };

  let parsed = tryParse(raw);

  if (parsed?.output && typeof parsed.output === "string") {
    const inner = tryParse(parsed.output);
    if (inner) parsed = inner;
    else return { text: parsed.output, products: [], orders: [] };
  }

  if (parsed) {
    if (parsed.type === "order") return { text: parsed.message || "", products: [], orders: parsed.orders || [] };
    if (parsed.type === "product") return { text: parsed.message || "", products: parsed.products || [], orders: [] };
    if (parsed.type === "text") return { text: parsed.message || raw, products: [], orders: [] };
    return { text: parsed.output || parsed.reply || parsed.message || raw, products: parsed.products || [], orders: parsed.orders || [] };
  }

  const matchOrder = raw.match(/\{[\s\S]*?"type"\s*:\s*"order"[\s\S]*?\}/);
  if (matchOrder) { const p = tryParse(matchOrder[0]); if (p) return { text: p.message || "", products: [], orders: p.orders || [] }; }

  const matchProduct = raw.match(/\{[\s\S]*?"type"\s*:\s*"product"[\s\S]*?\}/);
  if (matchProduct) { const p = tryParse(matchProduct[0]); if (p) return { text: p.message || "", products: p.products || [], orders: [] }; }

  return { text: raw, products: [], orders: [] };
  
};

// ── Main ChatBox ──────────────────────────────────────────
export default function ChatBox() {
  const { user } = useAuth(); // ✅ lấy user đang login
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

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const sendText = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_CHAT_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: sendText,
          user_id: user?.id || user?.user_id || null, // ✅ dynamic user_id
        }),
      });

      const raw = (await res.text()).replace(/^=/, "").trim();
      const { text, products, orders } = parseAIResponse(raw);
      setMessages((prev) => [...prev, { sender: "bot", text, products, orders }]);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Lỗi kết nối tới server!", products: [], orders: [] },
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
              <div key={index} className={`${msg.sender === "user" ? "text-right" : "text-left"} mb-2`}>
                {msg.text ? (
                  <div className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                  }`}>
                    {msg.text}
                  </div>
                ) : null}

                {msg.orders && msg.orders.length > 0 && (
                  <div className="mt-2">
                    {msg.orders.map((order, i) => (
                      <OrderCard key={order.order_id || i} order={order} />
                    ))}
                  </div>
                )}

                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {msg.products.map((p, i) => (
                      <div key={p.id || i} className="flex gap-3 border rounded-lg p-3 bg-white shadow">
                        <img
                          src={p.image_url || "https://via.placeholder.com/80x80?text=No+Image"}
                          alt={p.name}
                          className="w-20 h-20 object-contain rounded border bg-gray-50"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{p.name}</div>
                          <div className="text-blue-600 font-bold text-sm mb-1">{p.price?.toLocaleString("vi-VN")}₫</div>
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
                            <a href={`/laptop/${p.slug || p.id}`} rel="noreferrer" className="text-xs text-blue-500 underline">
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
              <div className="text-left text-gray-400 italic text-sm">Bi đang trả lời...</div>
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