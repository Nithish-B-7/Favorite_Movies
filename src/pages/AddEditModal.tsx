import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";


interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any | null;
}

const AddEditModal: React.FC<Props> = ({ open, onClose, onSuccess, editData }) => {
  const [form, setForm] = useState({
    title: "",
    type: "Movie",
    director: "",
    budget: "",
    location: "",
    duration: "",
    yearTime: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        type: editData.type || "Movie",
        director: editData.director || "",
        budget: editData.budget || "",
        location: editData.location || "",
        duration: editData.duration || "",
        yearTime: editData.yearTime || "",
      });
    } else {
      setForm({
        title: "",
        type: "Movie",
        director: "",
        budget: "",
        location: "",
        duration: "",
        yearTime: "",
      });
    }
  }, [editData]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string | Blob);
    });

    setLoading(true);
    try {
      if (editData) {
        await api.put(`/media/${editData.id}`, formData);
      } else {
        await api.post("/media", formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error saving entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="relative bg-gray-900 p-8 rounded-2xl w-[450px] shadow-xl border border-purple-600/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl text-purple-400 font-bold mb-6 text-center">
          {editData ? "Edit Entry" : "Add New Entry"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 outline-none"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 outline-none"
          >
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
          <input
            type="text"
            placeholder="Director"
            value={form.director}
            onChange={(e) => setForm({ ...form, director: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 outline-none"
          />
          <input
            type="text"
            placeholder="Budget"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 outline-none"
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 outline-none"
          />
          <input
            type="text"
            placeholder="Duration"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 outline-none"
          />
          <input
            type="text"
            placeholder="Year / Time"
            value={form.yearTime}
            onChange={(e) => setForm({ ...form, yearTime: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 outline-none"
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 mt-2"
          >
            {loading
              ? "Saving..."
              : editData
              ? "Save Changes"
              : "Add Entry"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
