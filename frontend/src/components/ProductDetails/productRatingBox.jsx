import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductRatingBox({ product, onNewRating }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingsList, setRatingsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  // ✅ Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Lấy danh sách đánh giá khi load trang
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/rating/${product.product_id || product.id}`
        );
        const data = await res.json();
        if (data.success) setRatingsList(data.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải đánh giá:", err);
      }
    };
    if (product?.id || product?.product_id) fetchRatings();
  }, [product]);

  // ✅ Gửi đánh giá
  const handleSubmit = async () => {
    if (!user) return setMessage("⚠️ Vui lòng đăng nhập để gửi đánh giá!");
    if (!rating) return setMessage("⚠️ Vui lòng chọn số sao!");
    if (!comment.trim()) return setMessage("⚠️ Vui lòng nhập nội dung nhận xét!");

    try {
      setSubmitting(true);
      setMessage("");

      const res = await fetch("http://localhost:5000/api/rating/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id || product.product_id,
          user_id: user.user_id,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      setMessage("🎉 Đánh giá đã được gửi!");
      setRating(0);
      setComment("");

      // ✅ Thêm đánh giá mới ngay lập tức vào danh sách
      const newRating = {
        rating_id: Date.now(),
        user_name: user.name || "Bạn",
        rating,
        comment,
        created_at: new Date().toISOString(),
      };
      setRatingsList((prev) => [newRating, ...prev]);

      // ✅ Báo component cha (ProductDetail) reload lại nếu cần
      if (onNewRating) onNewRating();

    } catch (err) {
      console.error("❌ Lỗi gửi đánh giá:", err);
      setMessage("❌ " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-5 border border-gray-200 shadow-sm mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Đánh giá & Nhận xét {product.name}
      </h2>

      {/* --- Gửi đánh giá --- */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => {
            const value = i + 1;
            return (
              <Star
                key={i}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                className={`w-8 h-8 cursor-pointer transition ${
                  value <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            );
          })}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập nhận xét của bạn..."
          className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          rows={3}
        />

        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}

        <Button
          className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </div>

      {/* --- Danh sách đánh giá --- */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Các đánh giá gần đây
        </h3>

        {ratingsList.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {ratingsList.map((r) => (
              <div
                key={r.rating_id}
                className="border rounded-lg p-3 bg-gray-50 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">
                    {r.user_name || "Người dùng ẩn danh"}
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-gray-700 mt-2">{r.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
