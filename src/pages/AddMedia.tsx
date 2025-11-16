import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const AddMedia: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    yearTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, (form as any)[key]);
      }
      // 🔍 Debug: Show all data being sent
      console.log(
        "📤 Sending form data:",
        Object.fromEntries(formData.entries())
      );

      const response = await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Uploading... ${percent}%`);
        },
      });

      console.log("✅ Response:", response.data);

      toast.success("Movie/TV Show added successfully");
      navigate("/");
    } catch (err: any) {
      console.error("Upload Error:", err);
      if (err.response) {
        console.error(" Server responded with:", err.response.data);
        console.error(" Status code:", err.response.status);
        setError(err.response.data?.message || "Failed to add entry");
      } else if (err.request) {
        console.error(" No response received:", err.request);
        setError("No response from server");
      } else {
        console.error(" Unexpected error:", err.message);
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Add Movie / TV Show
      </h2>

      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select</option>
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Director</label>
          <input
            name="director"
            value={form.director}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Budget</label>
          <input
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Duration</label>
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Year / Time</label>
          <input
            name="yearTime"
            value={form.yearTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <Button disabled={loading} className="mt-4">
          {loading ? "Saving..." : "Add Entry"}
        </Button>
      </form>
    </div>
  );
};

export default AddMedia;
