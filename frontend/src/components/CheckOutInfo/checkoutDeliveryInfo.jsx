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

import {
  Home,
  MapPin,
  Loader2,
} from "lucide-react";

import axiosClient from "@/api/axiosClient";

export default function CheckoutDeliveryInfo({
  form,
  onChange,
}) {

  // =========================
  // 🔹 STATES
  // =========================
  const [provinces, setProvinces] =
    useState([]);

  const [districts, setDistricts] =
    useState([]);

  const [wards, setWards] =
    useState([]);

  const [loadingProvinces, setLoadingProvinces] =
    useState(false);

  const [loadingDistricts, setLoadingDistricts] =
    useState(false);

  const [loadingWards, setLoadingWards] =
    useState(false);

  // =========================
  // 🔹 LOAD PROVINCES
  // =========================
  useEffect(() => {

    const fetchProvinces = async () => {

      try {

        setLoadingProvinces(true);

        const res = await axiosClient.get(
          "/users/api/address/provinces"
        );

        console.log(
          "✅ Provinces:",
          res.data
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setProvinces(data);

      } catch (error) {

        console.error(
          "❌ Load provinces error:",
          error
        );

        setProvinces([]);

      } finally {

        setLoadingProvinces(false);
      }
    };

    fetchProvinces();

  }, []);

  // =========================
  // 🔹 LOAD DISTRICTS
  // =========================
  useEffect(() => {

    const loadDistricts = async () => {

      try {

        // reset
        setDistricts([]);
        setWards([]);

        if (!form.province) return;

        const selectedProvince =
          provinces.find(
            (p) => p.name === form.province
          );

        if (!selectedProvince) return;

        setLoadingDistricts(true);

        const res = await axiosClient.get(
          `/users/api/address/districts?province_code=${selectedProvince.code}`
        );

        console.log(
          "✅ Districts:",
          res.data
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setDistricts(data);

      } catch (error) {

        console.error(
          "❌ Load districts error:",
          error
        );

        setDistricts([]);

      } finally {

        setLoadingDistricts(false);
      }
    };

    loadDistricts();

  }, [form.province, provinces]);

  // =========================
  // 🔹 LOAD WARDS
  // =========================
  useEffect(() => {

    const loadWards = async () => {

      try {

        setWards([]);

        if (!form.district) return;

        const selectedDistrict =
          districts.find(
            (d) => d.name === form.district
          );

        if (!selectedDistrict) return;

        setLoadingWards(true);

        const res = await axiosClient.get(
          `/users/api/address/wards?district_code=${selectedDistrict.code}`
        );

        console.log(
          "✅ Wards:",
          res.data
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setWards(data);

      } catch (error) {

        console.error(
          "❌ Load wards error:",
          error
        );

        setWards([]);

      } finally {

        setLoadingWards(false);
      }
    };

    loadWards();

  }, [form.district, districts]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

      {/* TITLE */}
      <div className="flex items-center gap-2 mb-5">

        <MapPin className="text-blue-600" />

        <h2 className="font-semibold text-lg">
          Thông tin giao hàng
        </h2>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* ========================= */}
        {/* PROVINCE */}
        {/* ========================= */}
        <div>

          <Label className="mb-2 block">
            Tỉnh / Thành phố
          </Label>

          <Select
            value={form.province || ""}
            onValueChange={(value) => {

              onChange({
                target: {
                  name: "province",
                  value,
                },
              });

              // reset district
              onChange({
                target: {
                  name: "district",
                  value: "",
                },
              });

              // reset ward
              onChange({
                target: {
                  name: "ward",
                  value: "",
                },
              });
            }}
            disabled={loadingProvinces}
          >

            <SelectTrigger className="h-11 rounded-lg border-gray-300">

              <SelectValue
                placeholder={
                  loadingProvinces
                    ? "Đang tải..."
                    : "Chọn tỉnh / thành"
                }
              />

            </SelectTrigger>

            <SelectContent>

              {Array.isArray(provinces) &&
                provinces.map((province) => (

                  <SelectItem
                    key={province.code}
                    value={province.name}
                  >
                    {province.name}
                  </SelectItem>
                ))}

            </SelectContent>

          </Select>
        </div>

        {/* ========================= */}
        {/* DISTRICT */}
        {/* ========================= */}
        <div>

          <Label className="mb-2 block">
            Quận / Huyện
          </Label>

          <Select
            value={form.district || ""}
            onValueChange={(value) => {

              onChange({
                target: {
                  name: "district",
                  value,
                },
              });

              // reset ward
              onChange({
                target: {
                  name: "ward",
                  value: "",
                },
              });
            }}
            disabled={
              !form.province ||
              loadingDistricts
            }
          >

            <SelectTrigger className="h-11 rounded-lg border-gray-300">

              <SelectValue
                placeholder={
                  loadingDistricts
                    ? "Đang tải..."
                    : "Chọn quận / huyện"
                }
              />

            </SelectTrigger>

            <SelectContent>

              {Array.isArray(districts) &&
                districts.map((district) => (

                  <SelectItem
                    key={district.code}
                    value={district.name}
                  >
                    {district.name}
                  </SelectItem>
                ))}

            </SelectContent>

          </Select>
        </div>

        {/* ========================= */}
        {/* WARD */}
        {/* ========================= */}
        <div>

          <Label className="mb-2 block">
            Phường / Xã
          </Label>

          <Select
            value={form.ward || ""}
            onValueChange={(value) => {

              onChange({
                target: {
                  name: "ward",
                  value,
                },
              });
            }}
            disabled={
              !form.district ||
              loadingWards
            }
          >

            <SelectTrigger className="h-11 rounded-lg border-gray-300">

              <SelectValue
                placeholder={
                  loadingWards
                    ? "Đang tải..."
                    : "Chọn phường / xã"
                }
              />

            </SelectTrigger>

            <SelectContent>

              {Array.isArray(wards) &&
                wards.map((ward) => (

                  <SelectItem
                    key={ward.code}
                    value={ward.name}
                  >
                    {ward.name}
                  </SelectItem>
                ))}

            </SelectContent>

          </Select>

          {loadingWards && (
            <div className="flex items-center gap-2 text-blue-600 text-sm mt-2">

              <Loader2 className="w-4 h-4 animate-spin" />

              <span>
                Đang tải phường / xã...
              </span>

            </div>
          )}
        </div>

        {/* ========================= */}
        {/* ADDRESS */}
        {/* ========================= */}
        <div className="sm:col-span-2">

          <Label className="mb-2 block">
            Địa chỉ chi tiết
          </Label>

          <div className="relative">

            <Home className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

            <Input
              name="address"
              value={form.address || ""}
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
