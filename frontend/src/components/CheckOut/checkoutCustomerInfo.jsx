import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutCustomerInfo({ form, onChange }) {
  return (
    <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mb-8 transition-all duration-200 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
        👤 Thông tin khách hàng
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Họ và tên */}
        <div>
          <Label
            htmlFor="name"
            className="text-gray-700 font-medium mb-2 block"
          >
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Nhập họ và tên của bạn"
            className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <Label
            htmlFor="phone"
            className="text-gray-700 font-medium mb-2 block"
          >
            Số điện thoại <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="Nhập số điện thoại"
            className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <Label
            htmlFor="email"
            className="text-gray-700 font-medium mb-2 block"
          >
            Email <span className="text-gray-400 text-sm">(tuỳ chọn)</span>
          </Label>
          <Input
            id="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="VD: tenban@email.com"
            className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
