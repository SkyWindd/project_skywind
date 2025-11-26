import { Badge } from "@/components/ui/badge"

export default function OrderStatusBadge({ status }) {
  const statusMap = {
    "Đã nhận hàng": "bg-green-100 text-green-700",
    "Đang vận chuyển": "bg-blue-100 text-blue-700",
    "Đã xác nhận": "bg-yellow-100 text-yellow-700",
    "Đã hủy": "bg-red-100 text-red-700",
  }

  return (
    <Badge className={`${statusMap[status] || "bg-gray-100 text-gray-700"} px-2 py-1 rounded-md text-xs`}>
      {status}
    </Badge>
  )
}
