import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

// mock reviews -> sau này thay bằng API backend
const mockReviews = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    rating: 5,
    comment: "Máy chạy rất mượt, chơi game ngon.",
    date: "2024-09-12",
  },
  {
    id: 2,
    user: "Trần Minh",
    rating: 4,
    comment: "Ổn trong tầm giá nhưng hơi nóng.",
    date: "2024-09-14",
  },
];

export default function Rating({ productId }) {
  const [reviews, setReviews] = useState(mockReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment) return;
    const newReview = {
      id: Date.now(),
      user: "Guest",
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
    };
    setReviews([newReview, ...reviews]);
    setComment("");
  };

  return (
    <section id="rating" className="mt-6">
      <div className="rounded-lg border bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Đánh giá & nhận xét</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl font-bold text-yellow-500">
            {reviews.length > 0
              ? (
                  reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                ).toFixed(1)
              : "0"}
          </span>
          <div className="text-sm text-muted-foreground">
            ({reviews.length} đánh giá)
          </div>
        </div>

        {/* Form đánh giá */}
        <div className="border rounded-md p-4 space-y-3 bg-gray-50">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
              <Star
                key={v}
                size={20}
                className={`cursor-pointer ${
                  v <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(v)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Chia sẻ cảm nhận của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleSubmit}>Gửi đánh giá</Button>
        </div>

        {/* Danh sách đánh giá */}
        <div className="mt-4 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b pb-3">
              <div className="flex items-center gap-2">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mt-1">{r.comment}</p>
              <div className="text-xs text-gray-500 mt-1">
                {r.user} • {r.date}
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm mt-3">
          <Link to="#" className="text-blue-600 hover:underline">
            Xem thêm đánh giá →
          </Link>
        </div>
      </div>
    </section>
  );
}
