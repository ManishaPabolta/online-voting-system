const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-6 mt-10">

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

        <div>
          <h2 className="text-lg font-bold">
            VoteSecure
          </h2>

          <p className="text-gray-400 text-sm">
            Secure & Transparent
            Digital Elections
          </p>
        </div>

        <p className="text-gray-500 text-sm">
          © 2026 All Rights
          Reserved
        </p>

      </div>

    </footer>
  );
};

export default Footer;