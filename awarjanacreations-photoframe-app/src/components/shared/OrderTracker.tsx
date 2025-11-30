type Props = {
  status: string;
};

const OrderTracker: React.FC<Props> = ({ status }) => (
  <div className="my-4">
    <div className="flex items-center gap-3">
      <span className="font-bold">Order Status:</span>
      <span className="px-2 py-1 rounded bg-yellow-300 text-black">{status}</span>
    </div>
  </div>
);

export default OrderTracker;