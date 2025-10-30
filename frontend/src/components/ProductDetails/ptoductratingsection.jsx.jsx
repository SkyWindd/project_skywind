import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ProductRatingSection({ productId, buyerId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [ratings, setRatings] = useState([]);

  // ✅ Lấy danh sách đánh giá
  const fetchRatings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/rating/${productId}`);
      const data = await res.json();
      if (data.success) setRatings(data.data);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [productId]);

  // ✅ Gửi đánh giá mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage("Vui lòng chọn số sao 🌟");
      return;
    }

    const res = await fetch("http://localhost:5000/api/rating/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        buyer_id: buyerId,
        rating,
        comment,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("✅ Cảm ơn bạn đã đánh giá!");
      setRating(0);
      setComment("");
      fetchRatings(); // load lại danh sách
    } else {
      setMessage("❌ " + (data.message || "Không thể gửi đánh giá"));
    }
  };

  return (
    <Card className="p-5 border border-gray-200 shadow-sm mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Đánh giá & Nhận xét
      </h2>

      {/* 🟡 Form gửi đánh giá */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập nhận xét của bạn..."
          className="w-full border rounded-md p-2 text-sm"
          rows="3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gửi đánh giá
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>

      {/* 🟢 Danh sách đánh giá */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Đánh giá gần đây</h3>
        {ratings.length === 0 ? (
          <p className="text-gray-500 text-sm">Chưa có đánh giá nào</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((item) => (
              <div key={item.rating_id} className="border-t pt-3">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800">
                    {item.buyer_name || "Người dùng ẩn danh"}
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i <= item.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
