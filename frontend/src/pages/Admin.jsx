import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
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

const INITIAL_FORM = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
};

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

const formatDate = (date) => {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

const formatDateTimeLocal = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const offset =
    parsedDate.getTimezoneOffset();

  const localDate = new Date(
    parsedDate.getTime() -
      offset * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
};

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

const ManageElections = () => {
  const [elections, setElections] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [actionId, setActionId] =
    useState(null);

  const [editId, setEditId] =
    useState(null);

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  // =========================================================
  // FETCH ELECTIONS
  // =========================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllElections();

      setElections(
        getElectionsFromResponse(response)
      );
    } catch (err) {
      console.error(
        "Failed to load elections:",
        err
      );

      setElections([]);
      setError(
        getErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // RESET
  // =========================================================

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditId(null);
    setShowForm(false);
  };

  // =========================================================
  // CREATE
  // =========================================================

  const handleSubmit = async (event) => {
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
      setSuccess("");

      await createElection({
        title: form.title.trim(),
        description:
          form.description.trim(),
        startDate: form.startDate,
        endDate: form.endDate || undefined,
      });

      setSuccess(
        "Election created successfully."
      );

      resetForm();
      await loadData();
    } catch (err) {
      console.error(
        "Create election error:",
        err
      );

      setError(
        getErrorMessage(err)
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (election) => {
    setEditId(election._id);

    setForm({
      title: election.title || "",
      description:
        election.description || "",
      startDate:
        formatDateTimeLocal(
          election.startDate
        ),
      endDate:
        formatDateTimeLocal(
          election.endDate
        ),
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // UPDATE
  // =========================================================

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
      setSuccess("");

      await updateElection(editId, {
        title: form.title.trim(),
        description:
          form.description.trim(),
        startDate: form.startDate,
        endDate: form.endDate || undefined,
      });

      setSuccess(
        "Election updated successfully."
      );

      resetForm();
      await loadData();
    } catch (err) {
      console.error(
        "Update election error:",
        err
      );

      setError(
        getErrorMessage(err)
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this election?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      await deleteElection(id);

      setSuccess(
        "Election deleted successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Delete election error:",
        err
      );

      setError(
        getErrorMessage(err)
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================================
  // PUBLISH
  // =========================================================

  const handlePublish = async (id) => {
    const confirmed = window.confirm(
      "Publish this election?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      await publishElection(id);

      setSuccess(
        "Election published successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Publish election error:",
        err
      );

      setError(
        getErrorMessage(err)
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this election?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      await cancelElection(id);

      setSuccess(
        "Election cancelled successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Cancel election error:",
        err
      );

      setError(
        getErrorMessage(err)
      );
    } finally {
      setActionId(null);
    }
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getStatus = (election) => {
    const status =
      election?.status?.toUpperCase();

    return (
      STATUS_STYLES[status] ||
      STATUS_STYLES.DRAFT
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

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
              <CheckCircle2 size={14} />
              Election Management
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Manage Elections
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Create, update, publish and
              manage elections from one place.
            </p>
          </div>

          <div className="flex gap-3">
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
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setForm(INITIAL_FORM);
                setError("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30"
            >
              <Plus size={18} />
              Create Election
            </button>
          </div>
        </motion.div>

        {/* =================================================
            ALERTS
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
              >
                <X size={17} />
              </button>
            </motion.div>
          )}

          {success && (
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
              className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
            >
              <CheckCircle2
                size={19}
              />

              <span>
                {success}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            CREATE / UPDATE FORM
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

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">
                      {editId
                        ? "Update Election"
                        : "Create New Election"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Enter the election details
                      below.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <X size={19} />
                  </button>
                </div>

                <form
                  onSubmit={
                    editId
                      ? handleUpdate
                      : handleSubmit
                  }
                  className="space-y-5"
                >
                  {/* Title */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Election Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter election title"
                      className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Description
                    </label>

                    <textarea
                      name="description"
                      rows={4}
                      value={
                        form.description
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter election description"
                      className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">
                        Start Date
                      </label>

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
                            handleChange
                          }
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">
                        End Date
                      </label>

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
                            handleChange
                          }
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                      ) : editId ? (
                        <Edit3
                          size={18}
                        />
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
            ELECTION LIST
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

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-emerald-400"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading elections...
              </p>
            </div>
          </div>
        ) : elections.length === 0 ? (
          /* Empty */
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
              Create your first election to
              start managing the voting
              process.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setForm(INITIAL_FORM);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white"
            >
              <Plus size={17} />
              Create Election
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {elections.map(
              (election, index) => {
                const status =
                  getStatus(election);

                const isActionLoading =
                  actionId ===
                  election._id;

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
                        index * 0.05,
                    }}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-400/20"
                  >
                    {/* Card top */}
                    <div className="p-5 sm:p-6">

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="break-words text-lg font-bold text-white sm:text-xl">
                            {election.title ||
                              "Untitled Election"}
                          </h3>

                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                            {election.description ||
                              "No description provided."}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${status.className}`}
                        >
                          {status.label}
                        </span>
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

                      {/* Published */}
                      {typeof election.isPublished ===
                        "boolean" && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              election.isPublished
                                ? "bg-emerald-400"
                                : "bg-slate-600"
                            }`}
                          />

                          {election.isPublished
                            ? "Published"
                            : "Not published"}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="border-t border-white/10 bg-slate-950/30 p-4">
                      <div className="flex flex-wrap gap-2">

                        {/* Edit */}
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

                        {/* Publish */}
                        {election.status ===
                          "DRAFT" && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePublish(
                                election._id
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
                                election._id
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
                              election._id
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