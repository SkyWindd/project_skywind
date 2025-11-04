import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Banknote } from "lucide-react";
import { toast } from "sonner";

export default function PaymentTransferModal({ open, onClose }) {
  const [orderId, setOrderId] = useState("");
  const [customer, setCustomer] = useState({});
  const [total, setTotal] = useState(0);

  // 🧾 Lấy dữ liệu từ localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem("checkout_delivery_form");
    const savedTotal = localStorage.getItem("checkout_total_price");

    if (savedForm) setCustomer(JSON.parse(savedForm));
    if (savedTotal) setTotal(Number(savedTotal));

    // Tạo mã đơn hàng ngẫu nhiên
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setOrderId(`#DH${randomId}`);
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`);
  };

  const transferContent = `Thanh toan don hang ${orderId} - ${customer.name || "Khach hang"}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl bg-white p-0 overflow-hidden shadow-xl border border-gray-100">
        {/* 🔹 Header */}
        <DialogHeader className="bg-blue-600 px-6 py-4 text-white">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Banknote size={20} />
            Thanh toán chuyển khoản ngân hàng
          </DialogTitle>
        </DialogHeader>

        {/* 🔸 Nội dung */}
        <div className="p-6 space-y-5 text-sm text-gray-700">
          {/* 🧾 QR Image */}
          <div className="text-center">
            <img
              src="/qr.jpg"
              alt="QR Thanh toán"
              className="w-48 h-48 mx-auto rounded-lg border border-gray-200 shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Quét mã QR bằng ứng dụng ngân hàng để thanh toán
            </p>
          </div>

          {/* 💳 Thông tin ngân hàng */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Ngân hàng:</span>
              <span className="font-semibold text-gray-900">Techcombank</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 tracking-wide">
                  2107 6666 8888
                </span>
                <Copy
                  size={16}
                  className="cursor-pointer text-blue-600 hover:text-blue-800 transition"
                  onClick={() =>
                    copyToClipboard("210766668888", "Số tài khoản")
                  }
                />
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Chủ tài khoản:</span>
              <span className="font-semibold text-gray-900">
                NGUYEN MINH QUAN
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Số tiền:</span>
              <span className="font-semibold text-blue-700">
                {total.toLocaleString()}₫
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-600 whitespace-nowrap">
                Nội dung:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-right break-all">
                  {transferContent}
                </span>
                <Copy
                  size={16}
                  className="cursor-pointer text-blue-600 hover:text-blue-800 transition"
                  onClick={() =>
                    copyToClipboard(transferContent, "nội dung chuyển khoản")
                  }
                />
              </div>
            </div>
          </div>

          {/* ⚙️ Lưu ý */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-3 rounded-lg leading-snug">
            ⚠️ Vui lòng chuyển khoản chính xác số tiền và nội dung để hệ thống tự động xác nhận đơn hàng nhanh chóng.
          </div>

          {/* 🔘 Nút hành động */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onClose(false)}
              className="rounded-lg border-gray-300 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              onClick={() => {
                toast.success("✅ Thanh toán thử thành công!");
                onClose(false);
              }}
            >
              <CheckCircle2 size={16} />
              Tôi đã chuyển tiền
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
