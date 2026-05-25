const CandidateCard = ({
  candidate,
  selected,
  onSelect,
}) => {

  return (

    <div
      onClick={() =>
        onSelect(candidate)
      }
      className={`
        cursor-pointer
        rounded-3xl
        p-8
        border
        transition-all
        duration-300
        ${
          selected
            ? "border-green-500 bg-green-500/20"
            : "border-white/10 bg-white/5 hover:border-green-400"
        }
      `}
    >

      {/* IMAGE */}
      <div className="flex justify-center">

        <img
          src={
            candidate?.image ||
            "https://via.placeholder.com/150"
          }
          alt={candidate?.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-white/10"
        />

      </div>

      {/* INFO */}
      <div className="text-center mt-6">

        <h2 className="text-3xl font-bold">

          {candidate?.name}

        </h2>

        <p className="text-gray-400 mt-2 text-lg">

          {candidate?.party}

        </p>

      </div>

      {/* SELECTED BADGE */}
      {selected && (

        <div className="mt-6 text-center">

          <span className="bg-green-600 px-5 py-2 rounded-xl text-sm font-bold">

            Selected

          </span>

        </div>

      )}

    </div>
  );
};

export default CandidateCard;