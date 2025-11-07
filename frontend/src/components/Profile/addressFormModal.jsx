import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Loader2 } from "lucide-react";

export default function AddressFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    ward: "",
    address: "",
    isDefault: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);

  // Khi mở modal, gán dữ liệu cũ hoặc reset
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        province: initialData.province || "",
        ward: initialData.ward || "",
        address: initialData.address || "",
        isDefault: initialData.isDefault || false,
      });
    } else {
      setForm({
        name: "",
        phone: "",
        province: "",
        ward: "",
        address: "",
        isDefault: false,
      });
    }
  }, [initialData, open]);

  // Lấy danh sách tỉnh/thành
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/provinces");
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("❌ Lỗi tải tỉnh/thành:", err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinceName) => {
    setForm({ ...form, province: provinceName, ward: "" });
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

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.address) return;
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95vw] sm:max-w-xl rounded-2xl border border-gray-100 
          bg-white p-5 sm:p-8 max-h-[90vh] overflow-y-auto shadow-lg
        "
      >
        {/* Header */}
        <DialogHeader className=" bg-white z-10 border-b border-gray-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-semibold text-gray-800">
              {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            {initialData
              ? "Cập nhật thông tin địa chỉ giao hàng của bạn."
              : "Điền đầy đủ thông tin bên dưới để thêm địa chỉ giao hàng mới."}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4">
          {/* Họ tên */}
          <div>
            <Label className="text-gray-700 text-sm">Họ và tên</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Nguyễn Văn A"
              className="h-10 mt-1 rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SĐT */}
          <div>
            <Label className="text-gray-700 text-sm">Số điện thoại</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="VD: 0912345678"
              className="h-10 mt-1 rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tỉnh + Phường */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-700 text-sm">
                Tỉnh / Thành phố
              </Label>
              <Select
                value={form.province}
                onValueChange={handleProvinceChange}
                disabled={loadingProvinces}
              >
                <SelectTrigger className="h-10 mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm">
                  <SelectValue
                    placeholder={
                      loadingProvinces
                        ? "Đang tải..."
                        : "Chọn tỉnh / thành phố"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto text-sm">
                  {provinces.map((p) => (
                    <SelectItem key={p.code} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 text-sm">Phường / Xã</Label>
              <Select
                value={form.ward}
                onValueChange={(val) => setForm({ ...form, ward: val })}
                disabled={!form.province || loadingWards}
              >
                <SelectTrigger className="h-10 mt-1 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm">
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
                <SelectContent className="max-h-60 overflow-y-auto text-sm">
                  {wards.map((w) => (
                    <SelectItem key={w.code} value={w.name}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <Label className="text-gray-700 text-sm">Số nhà, tên đường</Label>
            <div className="relative mt-1">
              <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="VD: 10 Nguyễn Thượng Hiền"
                className="h-10 pl-9 rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Địa chỉ mặc định */}
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              checked={form.isDefault}
              onCheckedChange={(checked) =>
                setForm({ ...form, isDefault: checked })
              }
            />
            <Label className="text-gray-700 text-sm">
              Đặt làm địa chỉ mặc định
            </Label>
          </div>

          {loadingWards && (
            <div className="flex items-center justify-center text-blue-600 mt-3">
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              <span className="text-sm">Đang tải danh sách phường...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto border-gray-300 hover:bg-gray-100"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {initialData ? "Cập nhật" : "Lưu địa chỉ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
