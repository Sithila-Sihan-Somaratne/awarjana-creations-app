// src/components/layout/BaseLayout.tsx
import Navbar from "../shared/Navbar";

type Props = { children: React.ReactNode };

export default function BaseLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
