// src/pages/public/Home.tsx
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <section className="grid gap-8 md:grid-cols-2 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 leading-tight">
          Handcrafted Photo Frames &amp; Prints
        </h1>
        <p className="mt-4 text-neutral-300 max-w-xl">
          Premium frames, quick turnaround, and custom sizes. Design your perfect frame and get a fast quote.
        </p>

        <div className="mt-6 flex gap-3">
          <Link to="/pricing" className="px-5 py-3 bg-yellow-400 text-black rounded-md font-semibold">
            Calculate Price
          </Link>
          <Link to="/customer/order/new" className="px-5 py-3 border border-neutral-700 rounded-md text-neutral-200">
            Create Order
          </Link>
        </div>
      </div>

      <div className="rounded-lg bg-linear-to-br from-neutral-800 to-neutral-700 p-6">
        {/* placeholder: small product gallery */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-40 bg-neutral-600 rounded" />
          <div className="h-40 bg-neutral-600 rounded" />
          <div className="h-40 bg-neutral-600 rounded" />
          <div className="h-40 bg-neutral-600 rounded" />
        </div>
      </div>
    </section>
  );
};

export default Home;
