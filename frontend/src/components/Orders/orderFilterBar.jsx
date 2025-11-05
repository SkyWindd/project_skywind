import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function OrderFilterBar({ onFilter }) {
  const [date, setDate] = useState()

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <Tabs defaultValue="all" className="w-full md:w-auto">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="shipping">Đang vận chuyển</TabsTrigger>
          <TabsTrigger value="done">Đã giao hàng</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon size={16} /> {date ? date.toLocaleDateString() : "Chọn ngày"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
        <Input placeholder="Tìm đơn hàng..." className="w-[200px]" />
      </div>
    </div>
  )
}
