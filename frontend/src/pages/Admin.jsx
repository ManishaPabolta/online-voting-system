import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  getAllElections,
  createElection,
  deleteElection,
  updateElection,
  publishElection,
  cancelElection,
} from "../api/electionApi";

import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from "../api/candidateApi";

/* =========================================================
   CONSTANTS
========================================================= */

const INITIAL_ELECTION_FORM = {
  title: "",
  description: "",
  electionType: "OTHER",
  startDate: "",
  endDate: "",
  bannerImage: "",
  instructions: "",
  allowResultsBeforeEnd: false,
};

const INITIAL_CANDIDATE_FORM = {
  name: "",
  party: "",
  symbol: "",
  photo: "",
  manifesto: "",
  biography: "",
  experience: "",
  position: "",
  isActive: true,
};

const ELECTION_TYPES = [
  "PRESIDENTIAL",
  "PARLIAMENTARY",
  "ASSEMBLY",
  "LOCAL",
  "COLLEGE",
  "ORGANIZATION",
  "OTHER",
];

const STATUS_STYLES = {
  DRAFT: {
    label: "Draft",
    className:
      "border-slate-400/20 bg-slate-500/10 text-slate-300",
  },

  UPCOMING: {
    label: "Upcoming",
    className:
      "border-amber-400/20 bg-amber-500/10 text-amber-300",
  },

  LIVE: {
    label: "Live",
    className:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "border-teal-400/20 bg-teal-500/10 text-teal-300",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-red-400/20 bg-red-500/10 text-red-300",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

const getElectionsFromResponse = (response) => {
  const data = response?.data || response;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.elections)) {
    return data.elections;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const getCandidatesFromResponse = (response) => {
  const data = response?.data || response;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.candidates)) {
    return data.candidates;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const formatDate = (date) => {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTimeLocal = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const offset = parsedDate.getTimezoneOffset();

  const localDate = new Date(
    parsedDate.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
};

const getStatus = (election) => {
  const status = election?.status?.toUpperCase();

  return (
    STATUS_STYLES[status] ||
    STATUS_STYLES.DRAFT
  );
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const FieldLabel = ({ children, required = false }) => (
  <label className="mb-2 block text-sm font-semibold text-slate-300">
    {children}

    {required && (
      <span className="ml-1 text-red-400">*</span>
    )}
  </label>
);

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

const Textarea = ({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    rows={rows}
    placeholder={placeholder}
    className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
  />
);

/* =========================================================
   CANDIDATE FORM
========================================================= */

const CandidateForm = ({
  election,
  candidateForm,
  setCandidateForm,
  editingCandidateId,
  candidateSubmitting,
  onSubmit,
  onCancel,
}) => {
  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setCandidateForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.035] p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UserPlus
                size={18}
                className="text-emerald-400"
              />

              <h4 className="font-bold text-white">
                {editingCandidateId
                  ? "Edit Candidate"
                  : "Add Candidate / Option"}
              </h4>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Add as many candidates/options as required
              for this election.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={candidateSubmitting}
            className="rounded-xl border border-white/10 p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <form
          onSubmit={(event) =>
            onSubmit(event, election._id)
          }
          className="space-y-5"
        >
          {/* Name + Position */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel required>
                Name
              </FieldLabel>

              <Input
                name="name"
                value={candidateForm.name}
                onChange={handleChange}
                placeholder="Enter candidate name"
                disabled={candidateSubmitting}
              />
            </div>

            <div>
              <FieldLabel>
                Position
              </FieldLabel>

              <Input
                name="position"
                value={candidateForm.position}
                onChange={handleChange}
                placeholder="e.g. President"
                disabled={candidateSubmitting}
              />
            </div>
          </div>

          {/* Photo + Party */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel>
                Photo URL
              </FieldLabel>

              <div className="relative">
                <ImageIcon
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="url"
                  name="photo"
                  value={candidateForm.photo}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  disabled={candidateSubmitting}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <FieldLabel>
                Party
              </FieldLabel>

              <Input
                name="party"
                value={candidateForm.party}
                onChange={handleChange}
                placeholder="Optional"
                disabled={candidateSubmitting}
              />
            </div>
          </div>

          {/* Symbol */}
          <div>
            <FieldLabel>
              Symbol
            </FieldLabel>

            <Input
              name="symbol"
              value={candidateForm.symbol}
              onChange={handleChange}
              placeholder="Optional symbol or symbol URL"
              disabled={candidateSubmitting}
            />
          </div>

          {/* Manifesto */}
          <div>
            <FieldLabel>
              Manifesto
            </FieldLabel>

            <Textarea
              name="manifesto"
              value={candidateForm.manifesto}
              onChange={handleChange}
              placeholder="Candidate manifesto"
              rows={4}
            />
          </div>

          {/* Biography + Experience */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel>
                Biography
              </FieldLabel>

              <Textarea
                name="biography"
                value={candidateForm.biography}
                onChange={handleChange}
                placeholder="Candidate biography"
                rows={4}
              />
            </div>

            <div>
              <FieldLabel>
                Experience
              </FieldLabel>

              <Textarea
                name="experience"
                value={candidateForm.experience}
                onChange={handleChange}
                placeholder="Candidate experience"
                rows={4}
              />
            </div>
          </div>

          {/* Active */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <input
              type="checkbox"
              name="isActive"
              checked={candidateForm.isActive}
              onChange={handleChange}
              className="h-4 w-4 accent-emerald-500"
            />

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Active Candidate
              </p>

              <p className="text-xs text-slate-500">
                Active candidates are available for voting.
              </p>
            </div>
          </label>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={candidateSubmitting}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                candidateSubmitting ||
                !candidateForm.name.trim()
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {candidateSubmitting ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : editingCandidateId ? (
                <Save size={17} />
              ) : (
                <Plus size={17} />
              )}

              {candidateSubmitting
                ? "Saving..."
                : editingCandidateId
                ? "Update Candidate"
                : "Add Candidate"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

/* =========================================================
   CANDIDATE CARD
========================================================= */

const CandidateItem = ({
  candidate,
  onEdit,
  onDelete,
  actionId,
}) => {
  const isLoading =
    actionId === candidate?._id;

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
      }}
      className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {candidate?.photo ? (
            <img
              src={candidate.photo}
              alt={candidate.name || "Candidate"}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <Users size={22} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="truncate font-bold text-white">
              {candidate?.name || "Unnamed Candidate"}
            </h5>

            <span
              className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${
                candidate?.isActive
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-400/20 bg-slate-500/10 text-slate-500"
              }`}
            >
              {candidate?.isActive
                ? "Active"
                : "Inactive"}
            </span>
          </div>

          {candidate?.position && (
            <p className="mt-1 text-xs text-slate-500">
              {candidate.position}
            </p>
          )}

          {candidate?.party && (
            <p className="mt-1 text-xs font-medium text-teal-400">
              {candidate.party}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(candidate)}
            disabled={isLoading}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-emerald-400/20 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50"
            title="Edit candidate"
          >
            <Edit3 size={15} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(candidate)}
            disabled={isLoading}
            className="rounded-xl border border-red-400/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
            title="Delete candidate"
          >
            {isLoading ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      </div>

      {(candidate?.manifesto ||
        candidate?.biography ||
        candidate?.experience ||
        candidate?.symbol) && (
        <div className="mt-4 grid gap-2 border-t border-white/5 pt-4 sm:grid-cols-2">
          {candidate?.symbol && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Symbol
              </p>

              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {candidate.symbol}
              </p>
            </div>
          )}

          {candidate?.experience && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Experience
              </p>

              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {candidate.experience}
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ManageElections = () => {
  const [elections, setElections] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [actionId, setActionId] =
    useState(null);

  const [candidateActionId, setCandidateActionId] =
    useState(null);

  const [candidateSubmitting, setCandidateSubmitting] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [editingCandidateId, setEditingCandidateId] =
    useState(null);

  const [form, setForm] =
    useState(INITIAL_ELECTION_FORM);

  const [candidateForm, setCandidateForm] =
    useState(INITIAL_CANDIDATE_FORM);

  const [candidateLists, setCandidateLists] =
    useState({});

  const [expandedElection, setExpandedElection] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [showCandidateForm, setShowCandidateForm] =
    useState(null);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD ELECTIONS
  ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllElections();

      const electionData =
        getElectionsFromResponse(response);

      setElections(electionData);

      /*
       * Candidate data is loaded separately because
       * candidates are managed through /api/candidates.
       */
      const candidateResults =
        await Promise.all(
          electionData.map(async (election) => {
            try {
              const candidateResponse =
                await getCandidates({
                  election: election._id,
                });

              return {
                electionId: election._id,
                candidates:
                  getCandidatesFromResponse(
                    candidateResponse
                  ),
              };
            } catch (candidateError) {
              console.error(
                `Failed to load candidates for ${election._id}:`,
                candidateError
              );

              return {
                electionId: election._id,
                candidates: [],
              };
            }
          })
        );

      const candidateMap = {};

      candidateResults.forEach(
        ({ electionId, candidates }) => {
          candidateMap[electionId] =
            candidates;
        }
      );

      setCandidateLists(candidateMap);
    } catch (err) {
      console.error(
        "Failed to load elections:",
        err
      );

      setElections([]);
      setCandidateLists({});
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleElectionChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =======================================================
     RESET ELECTION FORM
  ======================================================= */

  const resetElectionForm = () => {
    setForm(INITIAL_ELECTION_FORM);
    setEditId(null);
    setShowForm(false);
  };

  /* =======================================================
     OPEN CREATE
  ======================================================= */

  const openCreateForm = () => {
    setEditId(null);
    setForm(INITIAL_ELECTION_FORM);
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     CREATE ELECTION
  ======================================================= */

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError(
        "Election title is required."
      );
      return;
    }

    if (!form.startDate) {
      setError(
        "Election start date is required."
      );
      return;
    }

    if (
      form.endDate &&
      new Date(form.endDate) <=
        new Date(form.startDate)
    ) {
      setError(
        "End date must be after the start date."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createElection({
        title: form.title.trim(),
        description:
          form.description.trim(),
        electionType:
          form.electionType,
        startDate:
          form.startDate,
        endDate:
          form.endDate || undefined,
        bannerImage:
          form.bannerImage.trim() ||
          undefined,
        instructions:
          form.instructions.trim() ||
          undefined,
        allowResultsBeforeEnd:
          Boolean(
            form.allowResultsBeforeEnd
          ),
      });

      toast.success(
        "Election created successfully."
      );

      resetElectionForm();
      await loadData();
    } catch (err) {
      console.error(
        "Create election error:",
        err
      );

      setError(getErrorMessage(err));
      toast.error(
        getErrorMessage(err)
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     EDIT ELECTION
  ======================================================= */

  const handleEdit = (election) => {
    const status =
      election?.status?.toUpperCase();

    if (
      [
        "LIVE",
        "COMPLETED",
        "CANCELLED",
      ].includes(status)
    ) {
      toast.error(
        "This election cannot be edited in its current state."
      );
      return;
    }

    setEditId(election._id);

    setForm({
      title: election.title || "",
      description:
        election.description || "",
      electionType:
        election.electionType ||
        "OTHER",
      startDate:
        formatDateTimeLocal(
          election.startDate
        ),
      endDate:
        formatDateTimeLocal(
          election.endDate
        ),
      bannerImage:
        election.bannerImage || "",
      instructions:
        election.instructions || "",
      allowResultsBeforeEnd:
        Boolean(
          election.allowResultsBeforeEnd
        ),
    });

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     UPDATE ELECTION
  ======================================================= */

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editId) return;

    if (!form.title.trim()) {
      setError(
        "Election title is required."
      );
      return;
    }

    if (!form.startDate) {
      setError(
        "Election start date is required."
      );
      return;
    }

    if (
      form.endDate &&
      new Date(form.endDate) <=
        new Date(form.startDate)
    ) {
      setError(
        "End date must be after the start date."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await updateElection(editId, {
        title: form.title.trim(),
        description:
          form.description.trim(),
        electionType:
          form.electionType,
        startDate:
          form.startDate,
        endDate:
          form.endDate || undefined,
        bannerImage:
          form.bannerImage.trim() ||
          undefined,
        instructions:
          form.instructions.trim() ||
          undefined,
        allowResultsBeforeEnd:
          Boolean(
            form.allowResultsBeforeEnd
          ),
      });

      toast.success(
        "Election updated successfully."
      );

      resetElectionForm();
      await loadData();
    } catch (err) {
      console.error(
        "Update election error:",
        err
      );

      setError(getErrorMessage(err));
      toast.error(
        getErrorMessage(err)
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     DELETE ELECTION
  ======================================================= */

  const handleDelete = async (election) => {
    const confirmed =
      window.confirm(
        `Delete "${election?.title || "this election"}"?`
      );

    if (!confirmed) return;

    try {
      setActionId(election._id);
      setError("");

      await deleteElection(
        election._id
      );

      toast.success(
        "Election deleted successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Delete election error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  /* =======================================================
     PUBLISH
  ======================================================= */

  const handlePublish = async (election) => {
    const confirmed =
      window.confirm(
        `Publish "${election?.title || "this election"}"?`
      );

    if (!confirmed) return;

    try {
      setActionId(election._id);
      setError("");

      await publishElection(
        election._id
      );

      toast.success(
        "Election published successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Publish election error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = async (election) => {
    const confirmed =
      window.confirm(
        `Cancel "${election?.title || "this election"}"?`
      );

    if (!confirmed) return;

    try {
      setActionId(election._id);
      setError("");

      await cancelElection(
        election._id
      );

      toast.success(
        "Election cancelled successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Cancel election error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  /* =======================================================
     OPEN CANDIDATE FORM
  ======================================================= */

  const openCandidateForm = (
    electionId,
    candidate = null
  ) => {
    setError("");

    if (candidate) {
      setEditingCandidateId(
        candidate._id
      );

      setCandidateForm({
        name: candidate.name || "",
        party: candidate.party || "",
        symbol: candidate.symbol || "",
        photo: candidate.photo || "",
        manifesto:
          candidate.manifesto || "",
        biography:
          candidate.biography || "",
        experience:
          candidate.experience || "",
        position:
          candidate.position || "",
        isActive:
          candidate.isActive !== false,
      });
    } else {
      setEditingCandidateId(null);
      setCandidateForm(
        INITIAL_CANDIDATE_FORM
      );
    }

    setShowCandidateForm(
      electionId
    );

    setExpandedElection(
      electionId
    );
  };

  /* =======================================================
     RESET CANDIDATE FORM
  ======================================================= */

  const resetCandidateForm = () => {
    setCandidateForm(
      INITIAL_CANDIDATE_FORM
    );
    setEditingCandidateId(null);
    setShowCandidateForm(null);
  };

  /* =======================================================
     CREATE / UPDATE CANDIDATE
  ======================================================= */

  const handleCandidateSubmit = async (
    event,
    electionId
  ) => {
    event.preventDefault();

    if (!candidateForm.name.trim()) {
      toast.error(
        "Candidate name is required."
      );
      return;
    }

    try {
      setCandidateSubmitting(true);

      const payload = {
        election: electionId,
        name:
          candidateForm.name.trim(),
        party:
          candidateForm.party.trim(),
        symbol:
          candidateForm.symbol.trim(),
        photo:
          candidateForm.photo.trim(),
        manifesto:
          candidateForm.manifesto.trim(),
        biography:
          candidateForm.biography.trim(),
        experience:
          candidateForm.experience.trim(),
        position:
          candidateForm.position.trim(),
        isActive:
          Boolean(
            candidateForm.isActive
          ),
      };

      if (editingCandidateId) {
        const updatePayload = {
          name: payload.name,
          party: payload.party,
          symbol: payload.symbol,
          photo: payload.photo,
          manifesto:
            payload.manifesto,
          biography:
            payload.biography,
          experience:
            payload.experience,
          position:
            payload.position,
          isActive:
            payload.isActive,
        };

        await updateCandidate(
          editingCandidateId,
          updatePayload
        );

        toast.success(
          "Candidate updated successfully."
        );
      } else {
        await createCandidate(
          payload
        );

        toast.success(
          "Candidate added successfully."
        );
      }

      resetCandidateForm();

      await loadData();
    } catch (err) {
      console.error(
        "Candidate save error:",
        err
      );

      toast.error(
        getErrorMessage(err)
      );
    } finally {
      setCandidateSubmitting(false);
    }
  };

  /* =======================================================
     DELETE CANDIDATE
  ======================================================= */

  const handleCandidateDelete = async (
    candidate
  ) => {
    const confirmed =
      window.confirm(
        `Delete candidate "${candidate?.name || "this candidate"}"?`
      );

    if (!confirmed) return;

    try {
      setCandidateActionId(
        candidate._id
      );

      await deleteCandidate(
        candidate._id
      );

      toast.success(
        "Candidate deleted successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Delete candidate error:",
        err
      );

      toast.error(
        getErrorMessage(err)
      );
    } finally {
      setCandidateActionId(null);
    }
  };

  /* =======================================================
     TOGGLE ELECTION CANDIDATES
  ======================================================= */

  const toggleCandidates = (
    electionId
  ) => {
    setExpandedElection(
      (previous) =>
        previous === electionId
          ? null
          : electionId
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck size={14} />
              Election Management
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Manage Elections
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Create elections and manage their
              candidates or voting options from one
              place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/20 hover:bg-white/[0.07] disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30"
            >
              <Plus size={18} />
              Create Election
            </button>
          </div>
        </motion.div>

        {/* =================================================
            ERROR
        ================================================== */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <span className="flex-1">
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="shrink-0 text-red-400 transition hover:text-red-200"
              >
                <X size={17} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            ELECTION FORM
        ================================================== */}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              className="mb-8 overflow-hidden"
            >
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-7">

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText
                        size={19}
                        className="text-emerald-400"
                      />

                      <h2 className="text-xl font-bold sm:text-2xl">
                        {editId
                          ? "Update Election"
                          : "Create New Election"}
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Configure the election before
                      adding candidates.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      resetElectionForm
                    }
                    className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <X size={19} />
                  </button>
                </div>

                <form
                  onSubmit={
                    editId
                      ? handleUpdate
                      : handleCreate
                  }
                  className="space-y-5"
                >
                  {/* Title */}
                  <div>
                    <FieldLabel required>
                      Election Title
                    </FieldLabel>

                    <Input
                      name="title"
                      value={form.title}
                      onChange={
                        handleElectionChange
                      }
                      placeholder="Enter election title"
                      disabled={
                        submitting
                      }
                    />
                  </div>

                  {/* Election type */}
                  <div>
                    <FieldLabel required>
                      Election Type
                    </FieldLabel>

                    <div className="relative">
                      <select
                        name="electionType"
                        value={
                          form.electionType
                        }
                        onChange={
                          handleElectionChange
                        }
                        disabled={
                          submitting
                        }
                        className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
                      >
                        {ELECTION_TYPES.map(
                          (type) => (
                            <option
                              key={type}
                              value={type}
                              className="bg-slate-900"
                            >
                              {type}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown
                        size={17}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <FieldLabel>
                      Description
                    </FieldLabel>

                    <Textarea
                      name="description"
                      value={
                        form.description
                      }
                      onChange={
                        handleElectionChange
                      }
                      placeholder="Describe this election"
                      rows={4}
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel required>
                        Start Date
                      </FieldLabel>

                      <div className="relative">
                        <CalendarDays
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="datetime-local"
                          name="startDate"
                          value={
                            form.startDate
                          }
                          onChange={
                            handleElectionChange
                          }
                          disabled={
                            submitting
                          }
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel>
                        End Date
                      </FieldLabel>

                      <div className="relative">
                        <Clock3
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="datetime-local"
                          name="endDate"
                          value={
                            form.endDate
                          }
                          onChange={
                            handleElectionChange
                          }
                          disabled={
                            submitting
                          }
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banner */}
                  <div>
                    <FieldLabel>
                      Banner Image URL
                    </FieldLabel>

                    <Input
                      type="url"
                      name="bannerImage"
                      value={
                        form.bannerImage
                      }
                      onChange={
                        handleElectionChange
                      }
                      placeholder="https://example.com/banner.jpg"
                      disabled={
                        submitting
                      }
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <FieldLabel>
                      Voting Instructions
                    </FieldLabel>

                    <Textarea
                      name="instructions"
                      value={
                        form.instructions
                      }
                      onChange={
                        handleElectionChange
                      }
                      placeholder="Instructions voters should follow"
                      rows={4}
                    />
                  </div>

                  {/* Results setting */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <input
                      type="checkbox"
                      name="allowResultsBeforeEnd"
                      checked={
                        form.allowResultsBeforeEnd
                      }
                      onChange={
                        handleElectionChange
                      }
                      disabled={
                        submitting
                      }
                      className="mt-1 h-4 w-4 accent-emerald-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Allow results before
                        election ends
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        This setting is controlled by
                        the election backend and can
                        be enabled when required.
                      </p>
                    </div>
                  </label>

                  {/* Info */}
                  <div className="flex gap-3 rounded-2xl border border-teal-400/15 bg-teal-500/[0.05] p-4">
                    <Info
                      size={18}
                      className="mt-0.5 shrink-0 text-teal-400"
                    />

                    <p className="text-xs leading-5 text-slate-400">
                      After creating the election, you
                      can add any number of candidates or
                      voting options.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={
                        resetElectionForm
                      }
                      disabled={
                        submitting
                      }
                      className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        submitting
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                      ) : editId ? (
                        <Save size={18} />
                      ) : (
                        <Plus size={18} />
                      )}

                      {submitting
                        ? "Saving..."
                        : editId
                        ? "Update Election"
                        : "Create Election"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            LIST HEADER
        ================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              All Elections
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {elections.length} election
              {elections.length !== 1
                ? "s"
                : ""} found
            </p>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="text-center">
              <Loader2
                size={34}
                className="mx-auto animate-spin text-emerald-400"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading elections...
              </p>
            </div>
          </div>
        ) : elections.length === 0 ? (
          /* =================================================
             EMPTY
          ================================================== */

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400">
              <FileText size={28} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              No elections found
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Create your first election to start
              managing the voting process.
            </p>

            <button
              type="button"
              onClick={
                openCreateForm
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white"
            >
              <Plus size={17} />
              Create Election
            </button>
          </motion.div>
        ) : (
          /* =================================================
             ELECTION GRID
          ================================================== */

          <div className="grid gap-5">
            {elections.map(
              (election, index) => {
                const status =
                  getStatus(election);

                const isActionLoading =
                  actionId ===
                  election._id;

                const candidates =
                  candidateLists[
                    election._id
                  ] || [];

                const isExpanded =
                  expandedElection ===
                  election._id;

                const isLocked =
                  [
                    "LIVE",
                    "COMPLETED",
                    "CANCELLED",
                  ].includes(
                    election?.status?.toUpperCase()
                  );

                return (
                  <motion.div
                    key={election._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur-xl transition hover:border-emerald-400/20"
                  >
                    {/* ==============================
                        ELECTION CARD
                    =============================== */}

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-lg font-bold text-white sm:text-xl">
                              {election.title ||
                                "Untitled Election"}
                            </h3>

                            <span
                              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {election.description ||
                              "No description provided."}
                          </p>

                          {/* Type */}
                          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.025] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <FileText size={13} />
                            {election.electionType ||
                              "OTHER"}
                          </div>
                        </div>

                        {/* Publish state */}
                        <div className="shrink-0">
                          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-950/30 px-3 py-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                election.isPublished
                                  ? "bg-emerald-400"
                                  : "bg-slate-600"
                              }`}
                            />

                            <span className="text-xs font-semibold text-slate-400">
                              {election.isPublished
                                ? "Published"
                                : "Not published"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <CalendarDays
                              size={14}
                            />
                            Start
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-200">
                            {formatDate(
                              election.startDate
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <Clock3
                              size={14}
                            />
                            End
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-200">
                            {formatDate(
                              election.endDate
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Candidate summary */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-500/[0.05] px-3 py-2">
                          <Users
                            size={15}
                            className="text-emerald-400"
                          />

                          <span className="text-xs font-semibold text-slate-300">
                            {candidates.length}{" "}
                            candidate
                            {candidates.length !==
                            1
                              ? "s"
                              : ""}
                          </span>
                        </div>

                        {election.allowResultsBeforeEnd && (
                          <div className="inline-flex items-center gap-2 rounded-xl border border-teal-400/10 bg-teal-500/[0.05] px-3 py-2">
                            <Check
                              size={14}
                              className="text-teal-400"
                            />

                            <span className="text-xs font-semibold text-slate-400">
                              Early results allowed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* =================================================
                        CANDIDATE MANAGEMENT
                    ================================================== */}

                    <div className="border-t border-white/10 bg-slate-950/20">
                      <button
                        type="button"
                        onClick={() =>
                          toggleCandidates(
                            election._id
                          )
                        }
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.025] sm:px-6"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <Users
                              size={17}
                            />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-200">
                              Candidates / Voting Options
                            </p>

                            <p className="text-xs text-slate-600">
                              Manage candidates for this election
                            </p>
                          </div>
                        </div>

                        <motion.div
                          animate={{
                            rotate:
                              isExpanded
                                ? 180
                                : 0,
                          }}
                        >
                          <ChevronDown
                            size={18}
                            className="text-slate-500"
                          />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/5 p-5 sm:p-6">

                              {/* Candidate header */}
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <h4 className="font-bold text-white">
                                    {candidates.length}{" "}
                                    Candidate
                                    {candidates.length !==
                                    1
                                      ? "s"
                                      : ""}
                                  </h4>

                                  <p className="mt-1 text-xs text-slate-600">
                                    Add any number of voting
                                    options for this election.
                                  </p>
                                </div>

                                {!isLocked && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openCandidateForm(
                                        election._id
                                      )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                                  >
                                    <Plus
                                      size={15}
                                    />
                                    Add Candidate
                                  </button>
                                )}
                              </div>

                              {/* Candidate form */}
                              <AnimatePresence>
                                {showCandidateForm ===
                                  election._id && (
                                  <CandidateForm
                                    election={
                                      election
                                    }
                                    candidateForm={
                                      candidateForm
                                    }
                                    setCandidateForm={
                                      setCandidateForm
                                    }
                                    editingCandidateId={
                                      editingCandidateId
                                    }
                                    candidateSubmitting={
                                      candidateSubmitting
                                    }
                                    onSubmit={
                                      handleCandidateSubmit
                                    }
                                    onCancel={
                                      resetCandidateForm
                                    }
                                  />
                                )}
                              </AnimatePresence>

                              {/* Candidate list */}
                              {candidates.length ===
                              0 ? (
                                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
                                  <Users
                                    size={30}
                                    className="mx-auto text-slate-700"
                                  />

                                  <p className="mt-3 text-sm font-semibold text-slate-500">
                                    No candidates added yet
                                  </p>

                                  {!isLocked && (
                                    <p className="mt-1 text-xs text-slate-700">
                                      Add candidates before
                                      publishing the election.
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <motion.div
                                  layout
                                  className="mt-5 grid gap-3 md:grid-cols-2"
                                >
                                  <AnimatePresence>
                                    {candidates.map(
                                      (
                                        candidate
                                      ) => (
                                        <CandidateItem
                                          key={
                                            candidate._id
                                          }
                                          candidate={
                                            candidate
                                          }
                                          actionId={
                                            candidateActionId
                                          }
                                          onEdit={() =>
                                            openCandidateForm(
                                              election._id,
                                              candidate
                                            )
                                          }
                                          onDelete={
                                            handleCandidateDelete
                                          }
                                        />
                                      )
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* =================================================
                        ELECTION ACTIONS
                    ================================================== */}

                    <div className="border-t border-white/10 bg-slate-950/30 p-4">
                      <div className="flex flex-wrap gap-2">

                        {/* Edit */}
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                election
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-emerald-400/20 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50"
                          >
                            <Edit3
                              size={15}
                            />
                            Edit
                          </button>
                        )}

                        {/* Publish */}
                        {election.status ===
                          "DRAFT" && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePublish(
                                election
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
                          >
                            {isActionLoading ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2
                                size={15}
                              />
                            )}

                            Publish
                          </button>
                        )}

                        {/* Cancel */}
                        {[
                          "DRAFT",
                          "UPCOMING",
                          "LIVE",
                        ].includes(
                          election.status
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancel(
                                election
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
                          >
                            <XCircle
                              size={15}
                            />
                            Cancel
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              election
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={15}
                            />
                          )}

                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageElections;