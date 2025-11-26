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
import { Home, MapPin, Loader2 } from "lucide-react";

export default function CheckoutDeliveryInfo({ form, onChange, setForm }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // ⭐ Load Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/address/provinces");
        setProvinces(await res.json());
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // ⭐ Khi province có sẵn → load districts
  useEffect(() => {
    const loadDistricts = async () => {
      if (!form.province) return;
      const selected = provinces.find((p) => p.name === form.province);
      if (!selected) return;

      setLoadingDistricts(true);
      const res = await fetch(
        `http://localhost:5000/api/address/districts?province_code=${selected.code}`
      );
      const data = await res.json();
      setDistricts(data);
      setLoadingDistricts(false);
    };

    loadDistricts();
  }, [form.province, provinces]);

  // ⭐ Khi district có sẵn → load wards
  useEffect(() => {
    const loadWards = async () => {
      if (!form.district) return;
      const selected = districts.find((d) => d.name === form.district);
      if (!selected) return;

      setLoadingWards(true);
      const res = await fetch(
        `http://localhost:5000/api/address/wards?district_code=${selected.code}`
      );
      const data = await res.json();
      setWards(data);
      setLoadingWards(false);
    };

    loadWards();
  }, [form.district, districts]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-blue-600" />
        <h2 className="font-semibold text-lg">Thông tin giao hàng</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Province */}
        <div>
          <Label>Tỉnh / Thành phố</Label>
          <Select
            value={form.province}
            onValueChange={(v) => {
              onChange({ target: { name: "province", value: v } });
              onChange({ target: { name: "district", value: "" } });
              onChange({ target: { name: "ward", value: "" } });
            }}
            disabled={loadingProvinces}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-300">
              <SelectValue placeholder="Chọn tỉnh" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.code} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        <div>
          <Label>Quận / Huyện</Label>
          <Select
            value={form.district}
            onValueChange={(v) => {
              onChange({ target: { name: "district", value: v } });
              onChange({ target: { name: "ward", value: "" } });
            }}
            disabled={!form.province || loadingDistricts}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-300">
              <SelectValue placeholder="Chọn quận / huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.code} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ward */}
        <div>
          <Label>Phường / Xã</Label>
          <Select
            value={form.ward}
            onValueChange={(v) => onChange({ target: { name: "ward", value: v } })}
            disabled={!form.district || loadingWards}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-300">
              <SelectValue placeholder="Chọn phường / xã" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((w) => (
                <SelectItem key={w.code} value={w.name}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {loadingWards && (
            <div className="flex items-center mt-1 text-blue-600 text-sm">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Đang tải phường...
            </div>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <Label>Địa chỉ chi tiết</Label>
          <div className="relative">
            <Home className="absolute left-3 top-3 text-gray-400" />
            <Input
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="VD: 10 Nguyễn Trãi"
              className="h-11 pl-10 rounded-lg border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
