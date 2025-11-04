import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CheckoutDeliveryInfo({ form, onChange }) {
  const navigate = useNavigate();

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingWards, setLoadingWards] = useState(false);

  // 🛰️ Lấy danh sách tỉnh / thành phố
  useEffect(() => {
    fetch("http://localhost:5000/api/provinces")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("❌ Lỗi tải tỉnh/thành:", err));
  }, []);

  // 🏙️ Khi chọn tỉnh / thành phố
  const handleProvinceChange = async (provinceName) => {
    onChange({ target: { name: "province", value: provinceName } });
    onChange({ target: { name: "ward", value: "" } });
    setWards([]);
    setLoadingWards(true);

    const selectedProvince = provinces.find((p) => p.name === provinceName);
    if (!selectedProvince) return setLoadingWards(false);

    try {
      const res = await fetch(
        `http://localhost:5000/api/wards?province_code=${selectedProvince.code}`
      );
      const data = await res.json();
      setWards(data);
    } catch (err) {
      console.error("❌ Lỗi tải phường:", err);
    } finally {
      setLoadingWards(false);
    }
  };

  const handleWardChange = (wardName) => {
    onChange({ target: { name: "ward", value: wardName } });
  };

  return (
    <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mb-8 transition-all duration-200 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
        🏠 Thông tin giao hàng
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* 🏙️ Tỉnh / Thành phố */}
        <div>
          <Label className="text-gray-700 font-medium mb-2 block">
            Tỉnh / Thành phố
          </Label>
          <Select
            value={form.province || ""}
            onValueChange={handleProvinceChange}
          >
            <SelectTrigger className="w-full h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <SelectValue placeholder="Chọn tỉnh / thành phố" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {provinces.map((p) => (
                <SelectItem key={p.code} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🏘️ Phường / Xã */}
        <div>
          <Label className="text-gray-700 font-medium mb-2 block">
            Phường / Xã
          </Label>
          <Select
            value={form.ward || ""}
            onValueChange={handleWardChange}
            disabled={!form.province || loadingWards}
          >
            <SelectTrigger className="w-full h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <SelectValue
                placeholder={
                  loadingWards
                    ? "Đang tải phường..."
                    : form.province
                    ? "Chọn phường / xã"
                    : "Chọn tỉnh trước"
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {wards.map((w) => (
                <SelectItem key={w.code} value={w.name}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🏡 Địa chỉ chi tiết */}
        <div className="sm:col-span-2">
          <Label htmlFor="address" className="text-gray-700 font-medium mb-2 block">
            Số nhà, tên đường
          </Label>
          <Input
            id="address"
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="VD: 10 Nguyễn Thượng Hiền"
            className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          variant="outline"
          className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 px-6 py-2 rounded-lg transition"
          onClick={() => navigate("/")}
        >
          ← Quay lại giỏ hàng
        </Button>
      </div>
    </div>
  );
}
