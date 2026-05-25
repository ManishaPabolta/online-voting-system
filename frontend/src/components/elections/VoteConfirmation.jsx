import {
  CheckCircle,
} from "lucide-react";

const VoteConfirmation = ({
  voteId,
}) => {

  return (

    <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-10 text-center shadow-2xl">

      {/* ================= ICON ================= */}
      <div className="flex justify-center mb-5">

        <div className="bg-green-600 p-5 rounded-full">

          <CheckCircle
            size={50}
            className="text-white"
          />

        </div>

      </div>

      {/* ================= TITLE ================= */}
      <h1 className="text-4xl font-bold text-green-400">

        Vote Successfully Cast

      </h1>

      {/* ================= MESSAGE ================= */}
      <p className="text-gray-300 mt-4">

        Your vote has been securely
        recorded in the system.

      </p>

      {/* ================= VOTE ID ================= */}
      <div className="mt-6 bg-white/10 rounded-2xl py-4 px-4">

        <p className="text-sm text-gray-400">

          Vote Tracking ID

        </p>

        <h2 className="text-xl font-bold mt-2 break-all">

          {voteId || "Generating..."}

        </h2>

      </div>

    </div>
  );
};

export default VoteConfirmation;