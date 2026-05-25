import React, { useEffect, useState } from "react";

import {
  getAllElections,
  createElection,
  deleteElection,
  updateElection,
} from "../api/electionApi";

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    candidates: [],
  });

  // ================= FETCH =================
  const loadData = async () => {
    try {
      const res = await getAllElections();
      const data = res?.data || res;

      setElections(data?.elections || []);
    } catch (error) {
      console.log(error);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= CANDIDATES =================
  const addCandidate = () => {
    setForm({
      ...form,
      candidates: [
        ...form.candidates,
        { name: "", image: "", party: "" },
      ],
    });
  };

  const updateCandidate = (index, field, value) => {
    const updated = [...form.candidates];
    updated[index][field] = value;
    setForm({ ...form, candidates: updated });
  };

  const removeCandidate = (index) => {
    const updated = form.candidates.filter((_, i) => i !== index);
    setForm({ ...form, candidates: updated });
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      candidates: [],
    });
    setEditId(null);
  };

  // ================= CREATE =================
  const handleSubmit = async () => {
    try {
      await createElection(form);
      resetForm();
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      await updateElection(editId, form);
      resetForm();
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await deleteElection(id);
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= EDIT =================
  const handleEdit = (e) => {
    setEditId(e._id);

    setForm({
      title: e.title || "",
      description: e.description || "",
      startDate: e.startDate?.split("T")[0] || "",
      endDate: e.endDate?.split("T")[0] || "",
      candidates: e.candidates || [],
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* ================= HEADER (same vibe as UserDashboard) ================= */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Admin Panel
        </h1>

        <p className="text-gray-400 mt-2">
          Manage elections, candidates & voting system
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-lg mb-10">

        <h2 className="text-2xl font-semibold mb-6">
          {editId ? "Update Election" : "Create Election"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none focus:border-blue-500"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            className="bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none focus:border-blue-500"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="date"
            className="bg-gray-900 border border-gray-700 p-3 rounded-xl"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
          />

          <input
            type="date"
            className="bg-gray-900 border border-gray-700 p-3 rounded-xl"
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
          />
        </div>

        {/* ================= CANDIDATES ================= */}
        <h3 className="mt-6 text-lg font-semibold">
          Candidates
        </h3>

        <div className="space-y-3 mt-3">
          {form.candidates.map((c, i) => (
            <div
              key={i}
              className="grid md:grid-cols-4 gap-2"
            >
              <input
                className="bg-gray-900 border border-gray-700 p-2 rounded-lg"
                placeholder="Name"
                value={c.name}
                onChange={(e) =>
                  updateCandidate(i, "name", e.target.value)
                }
              />

              <input
                className="bg-gray-900 border border-gray-700 p-2 rounded-lg"
                placeholder="Image"
                value={c.image}
                onChange={(e) =>
                  updateCandidate(i, "image", e.target.value)
                }
              />

              <input
                className="bg-gray-900 border border-gray-700 p-2 rounded-lg"
                placeholder="Party"
                value={c.party}
                onChange={(e) =>
                  updateCandidate(i, "party", e.target.value)
                }
              />

              <button
                onClick={() => removeCandidate(i)}
                className="bg-red-600 hover:bg-red-700 transition px-3 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={addCandidate}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
          >
            + Add Candidate
          </button>

          {editId ? (
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl"
            >
              Update Election
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl"
            >
              Create Election
            </button>
          )}
        </div>
      </div>

      {/* ================= LIST ================= */}
      <h2 className="text-2xl font-semibold mb-4">
        All Elections
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : elections.length === 0 ? (
        <p className="text-gray-400">No elections found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">

          {elections.map((e) => (
            <div
              key={e._id}
              className="bg-gray-800/60 border border-gray-700 p-5 rounded-2xl shadow hover:shadow-xl transition"
            >

              <h3 className="text-xl font-bold">
                {e.title}
              </h3>

              <p className="text-gray-400 mt-1">
                {e.description}
              </p>

              <div className="flex justify-between mt-5">

                <button
                  onClick={() => handleEdit(e)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded-lg text-black font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(e._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default ManageElections;