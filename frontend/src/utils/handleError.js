// Hàm tiện ích xử lý lỗi API thống nhất
export function handleApiError(response) {
  if (!response.success) {
    return response.message || "Có lỗi xảy ra";
  }
  return null;
}
