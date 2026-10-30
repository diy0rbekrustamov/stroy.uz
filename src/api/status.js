export const statusLabel = (value) =>
  ({
    new: "Новый заказ",
    accepted: "Принят",
    shipped: "Отправлен",
    completed: "Завершён",
    cancelled: "Отменён",
  })[value] || value;
export const statusAction = (value) =>
  ({
    accepted: "Принять",
    shipped: "Отметить отправку",
    completed: "Завершить",
    cancelled: "Отменить",
  })[value] || value;
