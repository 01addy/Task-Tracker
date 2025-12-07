import ProtectedRoute from "../../components/ProtectedRoute";
import { useState } from "react";
import { useTasks } from "../../stores/useTasks";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [project, setProject] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const createTask = useTasks((s) => s.createTask);
  const router = useRouter();

  const addTagFromInput = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setTagInput("");
      return;
    }
    setTags((s) => [...s, t].slice(0, 10)); // limit to 10 tags
    setTagInput("");
  };

  const removeTag = (t) => setTags((s) => s.filter((x) => x !== t));

  const onTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTagFromInput();
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      // remove last tag when backspace on empty input
      setTags((s) => s.slice(0, -1));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        description: description.trim() || "",
        dueDate: dueDate ? dayjs(dueDate).tz("Asia/Kolkata").toISOString() : null,
        priority: priority || "low",
        project: project.trim() || "",
        tags,
      };

      await createTask(payload);
      toast.success("Task created");
      router.push("/");
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || "Failed to create task";
      toast.error(message);
      console.error("Create task error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Create Task
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={loading}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={4}
            disabled={loading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Due (IST)</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Project / Category</label>
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g., Website Redesign"
              className="w-full p-3 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Tags</label>
            <div className="flex gap-2 items-center flex-wrap">
              {tags.map((t) => (
                <div key={t} className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1 rounded-full border">
                  <span className="text-sm text-indigo-700 dark:text-indigo-200">{t}</span>
                  <button type="button" onClick={() => removeTag(t)} className="text-gray-400 hover:text-gray-700">×</button>
                </div>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              placeholder="Type tag and press Enter"
              className="w-full p-3 mt-2 border rounded dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${loading ? "bg-blue-500 opacity-80 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              disabled={loading}
              aria-busy={loading}
              aria-disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>

            <Link
                href="/"
                className="px-4 py-2 border rounded inline-flex items-center justify-center text-sm text-gray-700 dark:text-gray-200"
            >
                Cancel
                </Link>

          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
