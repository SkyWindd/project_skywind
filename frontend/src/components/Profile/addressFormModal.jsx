// FRONTEND - AddressFormModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Home, Loader2 } from "lucide-react";

export default function AddressFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    is_default: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        street: "",
        is_default: false,
      });
    }
  }, [initialData]);

  // ============================
  // LOAD TỈNH
  // ============================
  useEffect(() => {
    fetch("http://localhost:5000/api/address/provinces")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // ============================
  // LOAD QUẬN
  // ============================
  const handleProvinceChange = async (province) => {
    setForm({ ...form, province, district: "", ward: "" });

    const selected = provinces.find((p) => p.name === province);
    if (!selected) return;

    const res = await fetch(
      `http://localhost:5000/api/address/districts?province_code=${selected.code}`
    );

    setDistricts(await res.json());
  };

  // ============================
  // LOAD PHƯỜNG
  // ============================
  const handleDistrictChange = async (district) => {
    setForm({ ...form, district, ward: "" });

    const selected = districts.find((d) => d.name === district);
    if (!selected) return;

    const res = await fetch(
      `http://localhost:5000/api/address/wards?district_code=${selected.code}`
    );

    setWards(await res.json());
  };

  // ============================
  // SUBMIT
  // ============================
  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}</DialogTitle>
          <DialogDescription>Điền đầy đủ thông tin bên dưới.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <Label>Họ và tên</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <Label>Số điện thoại</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          {/* Province */}
          <Label>Tỉnh / Thành phố</Label>
          <Select value={form.province} onValueChange={handleProvinceChange}>
            <SelectTrigger><SelectValue placeholder="Chọn tỉnh" /></SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* District */}
          <Label>Quận / Huyện</Label>
          <Select value={form.district} onValueChange={handleDistrictChange} disabled={!form.province}>
            <SelectTrigger><SelectValue placeholder="Chọn quận" /></SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.code} value={d.name}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ward */}
          <Label>Phường / Xã</Label>
          <Select value={form.ward} onValueChange={(val) => setForm({ ...form, ward: val })} disabled={!form.district}>
            <SelectTrigger><SelectValue placeholder="Chọn phường" /></SelectTrigger>
            <SelectContent>
              {wards.map((w) => (
                <SelectItem key={w.code} value={w.name}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Số nhà, tên đường</Label>
          <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />

          <div className="flex items-center gap-2 mt-2">
            <Checkbox checked={form.is_default} onCheckedChange={(v) => setForm({ ...form, is_default: v })} />
            <span>Đặt làm địa chỉ mặc định</span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">Hủy</Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
