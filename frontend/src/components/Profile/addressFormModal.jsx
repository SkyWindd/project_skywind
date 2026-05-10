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

import {
  Home,
  Loader2,
} from "lucide-react";

import axiosClient from "@/api/axiosClient";

export default function AddressFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {

  // =========================
  // FORM
  // =========================
  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    is_default: false,
  });

  // =========================
  // DATA
  // =========================
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // =========================
  // LOADING
  // =========================
  const [loadingProvince, setLoadingProvince] =
    useState(false);

  const [loadingDistrict, setLoadingDistrict] =
    useState(false);

  const [loadingWard, setLoadingWard] =
    useState(false);

  // =========================
  // INIT FORM
  // =========================
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        province: initialData.province || "",
        district: initialData.district || "",
        ward: initialData.ward || "",
        street: initialData.street || "",
        is_default:
          initialData.is_default || false,
      });
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

      setDistricts([]);
      setWards([]);
    }
  }, [initialData, open]);

  // =========================
  // LOAD PROVINCES
  // =========================
  useEffect(() => {

    const fetchProvinces = async () => {
      try {

        setLoadingProvince(true);

        const res = await axiosClient.get(
          "/users/api/address/provinces"
        );

        setProvinces(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (error) {

        console.error(
          "❌ Load provinces error:",
          error
        );

        setProvinces([]);

      } finally {
        setLoadingProvince(false);
      }
    };

    fetchProvinces();

  }, []);

  // =========================
  // LOAD DISTRICTS
  // =========================
  const handleProvinceChange = async (
    province
  ) => {

    setForm((prev) => ({
      ...prev,
      province,
      district: "",
      ward: "",
    }));

    setDistricts([]);
    setWards([]);

    try {

      const selected = provinces.find(
        (p) => p.name === province
      );

      if (!selected) return;

      setLoadingDistrict(true);

      const res = await axiosClient.get(
        `/users/api/address/districts?province_code=${selected.code}`
      );

      setDistricts(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ Load districts error:",
        error
      );

      setDistricts([]);

    } finally {
      setLoadingDistrict(false);
    }
  };

  // =========================
  // LOAD WARDS
  // =========================
  const handleDistrictChange = async (
    district
  ) => {

    setForm((prev) => ({
      ...prev,
      district,
      ward: "",
    }));

    setWards([]);

    try {

      const selected = districts.find(
        (d) => d.name === district
      );

      if (!selected) return;

      setLoadingWard(true);

      const res = await axiosClient.get(
        `/users/api/address/wards?district_code=${selected.code}`
      );

      setWards(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ Load wards error:",
        error
      );

      setWards([]);

    } finally {
      setLoadingWard(false);
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = () => {

    if (
      !form.name ||
      !form.phone ||
      !form.province ||
      !form.district ||
      !form.ward ||
      !form.street
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    onSubmit(form);
    onClose();
  };

  // =========================
  // UI
  // =========================
  return (

    <Dialog
      open={open}
      onOpenChange={onClose}
    >

      <DialogContent className="max-w-xl">

        <DialogHeader>
          <DialogTitle>
            {
              initialData
                ? "Cập nhật địa chỉ"
                : "Thêm địa chỉ"
            }
          </DialogTitle>

          <DialogDescription>
            Điền đầy đủ thông tin bên dưới.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-3">

          {/* NAME */}
          <div>
            <Label>Họ và tên</Label>

            <Input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          {/* PHONE */}
          <div>
            <Label>Số điện thoại</Label>

            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </div>

          {/* PROVINCE */}
          <div>
            <Label>Tỉnh / Thành phố</Label>

            <Select
              value={form.province}
              onValueChange={
                handleProvinceChange
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tỉnh" />
              </SelectTrigger>

              <SelectContent>

                {loadingProvince ? (

                  <div className="p-3 flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tải...
                  </div>

                ) : (

                  provinces.map((p) => (
                    <SelectItem
                      key={p.code}
                      value={p.name}
                    >
                      {p.name}
                    </SelectItem>
                  ))

                )}

              </SelectContent>
            </Select>
          </div>

          {/* DISTRICT */}
          <div>
            <Label>Quận / Huyện</Label>

            <Select
              value={form.district}
              onValueChange={
                handleDistrictChange
              }
              disabled={
                !form.province ||
                loadingDistrict
              }
            >

              <SelectTrigger>
                <SelectValue placeholder="Chọn quận" />
              </SelectTrigger>

              <SelectContent>

                {loadingDistrict ? (

                  <div className="p-3 flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tải...
                  </div>

                ) : (

                  districts.map((d) => (
                    <SelectItem
                      key={d.code}
                      value={d.name}
                    >
                      {d.name}
                    </SelectItem>
                  ))

                )}

              </SelectContent>
            </Select>
          </div>

          {/* WARD */}
          <div>
            <Label>Phường / Xã</Label>

            <Select
              value={form.ward}
              onValueChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  ward: val,
                }))
              }
              disabled={
                !form.district ||
                loadingWard
              }
            >

              <SelectTrigger>
                <SelectValue placeholder="Chọn phường" />
              </SelectTrigger>

              <SelectContent>

                {loadingWard ? (

                  <div className="p-3 flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tải...
                  </div>

                ) : (

                  wards.map((w) => (
                    <SelectItem
                      key={w.code}
                      value={w.name}
                    >
                      {w.name}
                    </SelectItem>
                  ))

                )}

              </SelectContent>
            </Select>
          </div>

          {/* STREET */}
          <div>
            <Label>Số nhà, tên đường</Label>

            <div className="relative">

              <Home className="absolute left-3 top-3 text-gray-400 w-4 h-4" />

              <Input
                className="pl-10"
                value={form.street}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    street: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* DEFAULT */}
          <div className="flex items-center gap-2 mt-2">

            <Checkbox
              checked={form.is_default}
              onCheckedChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  is_default: v,
                }))
              }
            />

            <span>
              Đặt làm địa chỉ mặc định
            </span>

          </div>
        </div>

        <DialogFooter>

          <Button
            onClick={onClose}
            variant="outline"
          >
            Hủy
          </Button>

          <Button onClick={handleSubmit}>
            Lưu
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}
