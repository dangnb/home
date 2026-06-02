export function parseVndPrice(price: string) {
  return Number(price.replace(/\D/g, "")) || 0;
}

export function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
