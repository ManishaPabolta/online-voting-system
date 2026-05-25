import Navbar from "../components/common/Navbar";

import Footer from "../components/common/Footer";

const MainLayout = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;