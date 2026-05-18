import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import CheckoutProgress from "@/components/CheckOutInfo/checkoutProgress";
import CheckoutProductList from "@/components/CheckOutInfo/checkoutProductList";
import CheckoutCustomerInfo from "@/components/CheckOutInfo/checkoutCustomerInfo";
import CheckoutDeliveryInfo from "@/components/CheckOutInfo/checkoutDeliveryInfo";

import { Toaster, toast } from "sonner";

import axiosClient from "@/api/axiosClient";

export default function CheckoutInfo() {

  // ============================
  // 🔹 CONTEXT
  // ============================
  const { total } = useCart();

  const { user } = useAuth();

  const navigate = useNavigate();

  const userId =
    user?.user_id || user?.id;

  // ============================
  // 🔹 STATE
  // ============================
  const [deliveryType, setDeliveryType] =
    useState("delivery");

  const [form, setForm] =
    useState({

      name: "",
      phone: "",
      email: "",

      province: "",
      district: "",
      ward: "",

      address: "",
    });

  // ============================
  // 🚀 LOAD DEFAULT ADDRESS
  // ============================
  useEffect(() => {

    if (!userId) return;

    const loadDefaultAddress =
      async () => {

        try {

          const res =
            await axiosClient.get(
              `/users/api/address/user/${userId}`
            );

          console.log(
            "📦 Address Response:",
            res.data
          );

          // ============================
          // 🔹 Normalize data
          // ============================
          let data = [];

          if (
            Array.isArray(res.data)
          ) {

            data = res.data;

          } else if (
            Array.isArray(
              res.data?.data
            )
          ) {

            data = res.data.data;
          }

          // ============================
          // ❌ Không có địa chỉ
          // ============================
          if (data.length === 0) {

            const saved =
              localStorage.getItem(
                "checkout_delivery_form"
              );

            if (saved) {

              setForm(
                JSON.parse(saved)
              );
            }

            return;
          }

          // ============================
          // 🔹 Lấy địa chỉ đầu tiên
          // ============================
          const addr = data[0];

          console.log(
            "✅ Default Address:",
            addr
          );

          // ============================
          // 🔹 SET FORM
          // ============================
          setForm((prev) => ({

            ...prev,

            // CUSTOMER INFO
            name:
              addr.name ||
              user?.name ||
              "",

            phone:
              addr.phone ||
              user?.phone ||
              "",

            email:
              user?.email ||
              "",

            // DELIVERY INFO
            province:
              addr.province ||
              "",

            district:
              addr.district ||
              "",

            ward:
              addr.ward ||
              "",

            address:
              addr.street ||
              "",
          }));

        } catch (error) {

          console.error(
            "❌ Load address error:",
            error
          );

          const saved =
            localStorage.getItem(
              "checkout_delivery_form"
            );

          if (saved) {

            setForm(
              JSON.parse(saved)
            );
          }
        }
      };

    loadDefaultAddress();

  }, [userId, user]);

  // ============================
  // 💾 SAVE FORM LOCALSTORAGE
  // ============================
  useEffect(() => {

    localStorage.setItem(
      "checkout_delivery_form",
      JSON.stringify(form)
    );

  }, [form]);

  // ============================
  // 🔹 HANDLE INPUT CHANGE
  // ============================
  const handleChange = (e) => {

    setForm((prev) => ({

      ...prev,

      [e.target.name]:
        e.target.value,
    }));
  };

  // ============================
  // 🔹 NEXT STEP
  // ============================
  const handleNext = () => {

    const requiredFields = [

      "name",
      "phone",

      "province",
      "district",
      "ward",

      "address",
    ];

    const missingFields =
      requiredFields.filter(
        (field) =>
          !form[field]?.trim()
      );

    // ============================
    // ❌ VALIDATE
    // ============================
    if (
      missingFields.length > 0
    ) {

      toast.error(
        "Vui lòng điền đầy đủ thông tin giao hàng",
        {
          position:
            "top-center",
        }
      );

      return;
    }

    // ============================
    // 💾 SAVE CHECKOUT DATA
    // ============================
    localStorage.setItem(
      "checkout_delivery_form",
      JSON.stringify(form)
    );

    localStorage.setItem(
      "checkout_total_price",
      total.toString()
    );

    toast.success(
      "Thông tin hợp lệ",
      {
        position:
          "top-center",
      }
    );

    // ============================
    // 🚀 NAVIGATE
    // ============================
    setTimeout(() => {

      navigate(
        "/checkoutPayment"
      );

    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">

      <Toaster
        richColors
        position="top-center"
        expand
      />

      {/* ============================
          🔹 PROGRESS
      ============================ */}
      <div className="mb-8">

        <CheckoutProgress
          step={1}
        />

      </div>

      {/* ============================
          🔹 PRODUCT LIST
      ============================ */}
      <CheckoutProductList />

      {/* ============================
          🔹 CUSTOMER INFO
      ============================ */}
      <CheckoutCustomerInfo
        form={form}
        onChange={handleChange}
      />

      {/* ============================
          🔹 DELIVERY INFO
      ============================ */}
      <CheckoutDeliveryInfo
        form={form}
        onChange={handleChange}
        deliveryType={
          deliveryType
        }
        setDeliveryType={
          setDeliveryType
        }
      />

      {/* ============================
          🔹 TOTAL
      ============================ */}
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mt-6">

        <div className="flex justify-between items-center text-base font-semibold">

          <span>
            Tổng tiền tạm tính
          </span>

          <span className="text-blue-600 text-lg">

            {total.toLocaleString()}₫

          </span>
        </div>
      </div>

      {/* ============================
          🔹 BUTTON
      ============================ */}
      <Button
        onClick={handleNext}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl shadow-lg"
      >
        Tiếp tục thanh toán
      </Button>
    </div>
  );
}