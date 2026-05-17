import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Package, Clock, CheckCircle, XCircle, Truck, RefreshCw } from "lucide-react";
import "./ChatBox.css";

// ─── Order Status Config ───────────────────────────────────────────────────
// Supports both English keys and Vietnamese strings from API
const ORDER_STATUS_MAP = [
  { keys: ["pending", "chờ xác nhận", "cho xac nhan", "mới", "moi"],         cfg: { label: "Chờ xác nhận", icon: Clock,         color: "#b45309", bg: "#fef3c7", border: "#fcd34d" } },
  { keys: ["confirmed", "đã xác nhận", "da xac nhan", "xác nhận"],           cfg: { label: "Đã xác nhận",  icon: CheckCircle,   color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" } },
  { keys: ["shipping", "đang giao", "dang giao", "đang vận chuyển"],         cfg: { label: "Đang giao",    icon: Truck,         color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd" } },
  { keys: ["delivered", "đã giao", "da giao", "hoàn thành", "hoan thanh"],   cfg: { label: "Đã giao",      icon: CheckCircle,   color: "#15803d", bg: "#dcfce7", border: "#86efac" } },
  { keys: ["cancelled", "canceled", "đã hủy", "da huy", "hủy", "huy"],      cfg: { label: "Đã hủy",       icon: XCircle,       color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" } },
  { keys: ["returned", "hoàn trả", "hoan tra", "trả hàng"],                  cfg: { label: "Hoàn trả",     icon: RefreshCw,     color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db" } },
];

function getStatusConfig(status) {
  const normalized = (status || "").toLowerCase().trim();
  for (const { keys, cfg } of ORDER_STATUS_MAP) {
    if (keys.includes(normalized)) return cfg;
  }
  return { label: status || "—", icon: Package, color: "#374151", bg: "#f9fafb", border: "#e5e7eb" };
}

// ─── Single Order Card ─────────────────────────────────────────────────────
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const status = getStatusConfig(order.status);
  const StatusIcon = status.icon;

  const createdAt = order.created_at || order.order_date || order.date || null;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : null;

  const rawTotal = order.total_amount ?? order.total ?? order.total_price ?? null;
  const total = rawTotal !== null ? parseFloat(rawTotal) : null;
  const items = order.items || order.order_items || [];

  return (
    <div style={{
      border: `1px solid ${status.border}`,
      borderRadius: "12px",
      background: "#fff",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      marginBottom: "10px",
      fontFamily: "inherit",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        background: status.bg,
        borderBottom: `1px solid ${status.border}`,
        cursor: "pointer",
        gap: "8px",
      }} onClick={() => setExpanded(e => !e)}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Package size={15} color={status.color} />
          <span style={{ fontWeight: 600, fontSize: "13px", color: "#111827" }}>
            Đơn #{order.id || order.order_id || "N/A"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            padding: "2px 8px", borderRadius: "20px",
            background: status.bg, border: `1px solid ${status.border}`,
            fontSize: "11px", fontWeight: 600, color: status.color,
          }}>
            <StatusIcon size={11} />
            {status.label}
          </span>
          <span style={{ fontSize: "18px", color: "#9ca3af", lineHeight: 1 }}>
            {expanded ? "▴" : "▾"}
          </span>
        </div>
      </div>

      {/* Summary row */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", fontSize: "13px", color: "#374151",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {formattedDate && (
            <span style={{ color: "#6b7280", fontSize: "12px" }}>
              📅 {formattedDate}
            </span>
          )}
          {items.length > 0 && (
            <span style={{ color: "#6b7280", fontSize: "12px" }}>
              📦 {items.length} sản phẩm
            </span>
          )}
        </div>
        {total !== null && (
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#1d4ed8" }}>
            {Number(total).toLocaleString("vi-VN")}₫
          </span>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "10px 14px" }}>
          {/* Extra fields */}
          {(order.shipping_address || order.address) && (
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
              🏠 {order.shipping_address || order.address}
            </div>
          )}
          {order.payment_method && (
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
              💳 {order.payment_method}
            </div>
          )}

          {/* Order items */}
          {items.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map((item, i) => (
                <div key={item.id || i} style={{
                  display: "flex", gap: "10px", alignItems: "center",
                  background: "#f9fafb", borderRadius: "8px", padding: "8px 10px",
                }}>
                  {(item.image_url || item.image) && (
                    <img
                      src={item.image_url || item.image}
                      alt={item.name || item.product_name}
                      style={{ width: "44px", height: "44px", objectFit: "contain", borderRadius: "6px", background: "#fff", border: "1px solid #e5e7eb" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#111827", lineHeight: 1.3, marginBottom: "2px" }}>
                      {item.name || item.product_name || "Sản phẩm"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>
                      x{item.quantity || 1}
                      {(item.price || item.unit_price) && (
                        <span style={{ color: "#1d4ed8", fontWeight: 600, marginLeft: "6px" }}>
                          {Number(item.price || item.unit_price).toLocaleString("vi-VN")}₫
                        </span>
                      )}
                    </div>
                  </div>
                  {item.subtotal && (
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>
                      {Number(item.subtotal).toLocaleString("vi-VN")}₫
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            {["pending","chờ xác nhận","cho xac nhan"].includes((order.status || "").toLowerCase().trim()) && (
              <button
                style={{ fontSize: "12px", padding: "5px 12px", borderRadius: "8px", border: "1px solid #fca5a5", background: "#fee2e2", color: "#dc2626", cursor: "pointer", fontWeight: 600 }}
                onClick={() => window.sendPrompt && window.sendPrompt(`Hủy đơn hàng #${order.id || order.order_id}`)}
              >
                Hủy đơn
              </button>
            )}
            <a
              href={`/orders/${order.id || order.order_id}`}
              style={{ fontSize: "12px", padding: "5px 12px", borderRadius: "8px", border: "1px solid #bfdbfe", background: "#eff6ff", color: "#1d4ed8", textDecoration: "none", fontWeight: 600 }}
            >
              Chi tiết →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ChatBox ──────────────────────────────────────────────────────────
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

  // Parse response from AI Agent — supports JSON and plain text
  const parseAIResponse = (raw) => {
    try {
      const parsed = JSON.parse(raw);

      // output is a nested JSON string
      if (parsed.output && typeof parsed.output === "string") {
        try {
          const inner = JSON.parse(parsed.output);
          if (inner.type === "product") return { text: inner.message || "", products: inner.products || [], orders: [] };
          if (inner.type === "order")   return { text: inner.message || "", products: [], orders: inner.orders || (inner.order ? [inner.order] : []) || (inner.response ? inner.response : []) };
          // Handle raw {response:[...]} shape from n8n get_orders tool
          if (inner.response && Array.isArray(inner.response)) return { text: inner.message || "", products: [], orders: inner.response };
          if (inner.type === "text")    return { text: inner.message || "", products: [], orders: [] };
        } catch {}
        return { text: parsed.output, products: [], orders: [] };
      }

      if (parsed.type === "product") return { text: parsed.message || "", products: parsed.products || [], orders: [] };
      if (parsed.type === "order")   return { text: parsed.message || "", products: [], orders: parsed.orders || (parsed.order ? [parsed.order] : []) };
      if (parsed.type === "text")    return { text: parsed.message || raw, products: [], orders: [] };

      return {
        text: parsed.output || parsed.reply || parsed.message || raw,
        products: parsed.products || [],
        orders: parsed.orders || [],
      };
    } catch {
      // Try to extract embedded JSON
      const matchProduct = raw.match(/\{[\s\S]*"type"\s*:\s*"product"[\s\S]*\}/);
      if (matchProduct) {
        try {
          const p = JSON.parse(matchProduct[0]);
          return { text: p.message || "", products: p.products || [], orders: [] };
        } catch {}
      }
      const matchOrder = raw.match(/\{[\s\S]*"type"\s*:\s*"order"[\s\S]*\}/);
      if (matchOrder) {
        try {
          const o = JSON.parse(matchOrder[0]);
          return { text: o.message || "", products: [], orders: o.orders || (o.order ? [o.order] : []) };
        } catch {}
      }
      return { text: raw, products: [], orders: [] };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const sendText = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_CHAT_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sendText, user_id: 2 }),
      });

      const raw = (await res.text()).replace(/^=/, "").trim();
      const { text, products, orders } = parseAIResponse(raw);
      setMessages(prev => [...prev, { sender: "bot", text, products, orders }]);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages(prev => [
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
              <div
                key={index}
                className={`${msg.sender === "user" ? "text-right" : "text-left"} mb-2`}
              >
                {/* Text bubble */}
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

                {/* ✅ ORDER CARDS */}
                {msg.orders && msg.orders.length > 0 && (
                  <div className="mt-3">
                    {msg.orders.map((order, i) => (
                      <OrderCard key={order.id || order.order_id || i} order={order} />
                    ))}
                  </div>
                )}

                {/* ✅ PRODUCT CARDS */}
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
                          onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                            {p.name}
                          </div>
                          <div className="text-blue-600 font-bold text-sm mb-1">
                            {p.price?.toLocaleString("vi-VN")}₫
                          </div>
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
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
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