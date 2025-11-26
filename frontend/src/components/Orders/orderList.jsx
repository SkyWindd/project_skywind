import OrderCard from "./OrderCard"

export default function OrderList({ orders }) {
  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
