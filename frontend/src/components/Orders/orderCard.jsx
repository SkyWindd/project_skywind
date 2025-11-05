import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import OrderStatusBadge from "./OrderStatusBadge"

export default function OrderCard({ order }) {
  return (
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <img
            src={order.image}
            alt={order.name}
            className="w-16 h-16 object-cover rounded-md border"
          />
          <div>
            <p className="text-sm text-gray-500">
                Mã đơn hàng: {" "}
                <span className="font-medium">{order.id}</span>
                </p>
            <p className="text-sm text-gray-500">
                Ngày đặt hàng: {new Date(order.date).toLocaleDateString("vi-VN")}
                </p>
            <p className="font-semibold text-gray-800 mt-1">
                 {order.items[0].name}
                </p>
            <p className="text-sm text-gray-500">
                 {order.items[0].price.toLocaleString()}₫
                </p>
            <p className="text-xs text-gray-400 mt-1">
                Cùng {order.items.length - 1} sản phẩm khác
                </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <OrderStatusBadge status={order.status} />
          <div className="text-right mt-2">
            <p className="text-sm text-gray-600">Tổng thanh toán:</p>
            <p className="text-red-600 font-bold">
                {order.total.toLocaleString()}đ
                </p>
          </div>
          <Button variant="ghost" size="sm" className="mt-1 text-blue-600 hover:text-blue-800 flex items-center gap-1">
            Xem chi tiết <ChevronRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
