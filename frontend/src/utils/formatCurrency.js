export function formatCurrency(value) {
  if (!value) return "0đ";

  const number = Number(value);
  if (isNaN(number)) return "0đ";

  return number.toLocaleString("vi-VN") + "đ";
}
