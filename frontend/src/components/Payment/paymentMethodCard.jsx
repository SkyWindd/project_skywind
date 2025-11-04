import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  QrCode,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export default function PaymentMethodCard() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng",
      icon: <Banknote className="w-6 h-6 text-blue-600" />,
      description: "Thanh toán trực tiếp cho nhân viên giao hàng.",
    },
    {
      id: "qr",
      name: "Chuyển khoản ngân hàng qua mã QR",
      icon: <QrCode className="w-6 h-6 text-blue-600" />,
      description: "Hỗ trợ quét mã từ hầu hết các ngân hàng.",
    },
    {
      id: "vnpay",
      name: "VNPay",
      icon: <CreditCard className="w-6 h-6 text-blue-600" />,
      description: "Thanh toán nhanh chóng qua VNPay.",
    },
    {
      id: "momo",
      name: "MoMo",
      icon: <Smartphone className="w-6 h-6 text-pink-500" />,
      description: "Nhập ưu đãi MoMo, giảm thêm 2% tối đa 200.000đ.",
    },
    {
      id: "visa",
      name: "OnePay - Visa / Master / JCB / Napas",
      icon: <Wallet className="w-6 h-6 text-blue-500" />,
      description: "Thanh toán an toàn qua cổng OnePay.",
    },
  ];

  // 🔄 Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("payment_method_id");
    if (saved) setSelectedId(saved);
  }, []);

  // ✅ Khi chọn phương thức
  const handleMethodSelect = (method) => {
    setSelectedId(method.id);
    localStorage.setItem("payment_method_id", method.id);

    // 🔔 Phát sự kiện để các trang khác (CheckoutPayment) lắng nghe
    window.dispatchEvent(
      new CustomEvent("paymentMethodChanged", { detail: method.id })
    );

    // Đóng modal sau khi chọn
    setTimeout(() => setOpen(false), 100);
  };

  const selectedMethod = paymentMethods.find((m) => m.id === selectedId);

  return (
    <Card className="p-5 mb-6 border border-gray-100 shadow-md rounded-2xl bg-white hover:shadow-lg transition-all duration-300">
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Click toàn bộ card để mở modal */}
        <DialogTrigger asChild>
          <div
            className="flex items-center justify-between w-full cursor-pointer select-none"
            onClick={() => setOpen(true)}
          >
            {!selectedMethod ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-blue-600 w-5 h-5" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Chọn phương thức thanh toán
                    </p>
                  </div>
                </div>
                <span className="text-blue-600 text-sm font-medium">›</span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  {selectedMethod.icon}
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedMethod.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Phương thức bạn đã chọn
                    </p>
                  </div>
                </div>
                <span className="text-blue-600 text-sm font-medium hover:underline">
                  Thay đổi
                </span>
              </div>
            )}
          </div>
        </DialogTrigger>

        {/* Danh sách phương thức thanh toán */}
        <DialogContent className="max-w-md p-0 rounded-2xl overflow-hidden">
          <DialogHeader className="border-b px-5 py-3">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Chọn phương thức thanh toán
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[380px] p-5">
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const isSelected = selectedId === method.id;
                return (
                  <motion.div
                    key={method.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleMethodSelect(method)}
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/60 shadow-sm"
                        : "hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="shrink-0">{method.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {method.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {method.description}
                      </p>
                    </div>
                    {isSelected && <Check className="text-blue-600 w-5 h-5" />}
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
