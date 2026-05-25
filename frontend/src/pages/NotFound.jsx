import {
  Link,
} from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center text-white px-6">

      <h1 className="text-[120px] font-black text-blue-500">
        404
      </h1>

      <h2 className="text-4xl font-bold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-400 mt-4 text-center max-w-lg">
        The page you are looking
        for does not exist or has
        been removed.
      </p>

      <Link
        to="/"
        className="mt-10 bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-8 py-4 rounded-2xl font-bold"
      >
        Back To Home
      </Link>

    </div>
  );
};

export default NotFound;