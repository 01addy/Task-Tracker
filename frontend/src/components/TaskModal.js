import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useTasks } from "../stores/useTasks";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import toast from "react-hot-toast";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function TaskModal({ task, onClose }) {
  const [open, setOpen] = useState(!!task);
  const updateTask = useTasks((s) => s.updateTask);
  const deleteTask = useTasks((s) => s.deleteTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [project, setProject] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (task) {
      setOpen(true);
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.dueDate ? dayjs(task.dueDate).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm") : "");
      setPriority(task.priority || "medium");
      setStatus(task.status || "todo");
      setProject(task.project || "");
      setTags(task.tags ? [...task.tags] : []);
    } else {
      setOpen(false);
    }
  }, [task]);

  const addTagFromInput = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.includes(t)) { setTagInput(""); return; }
    setTags((s) => [...s, t].slice(0, 10));
    setTagInput("");
  };
  const removeTag = (t) => setTags((s) => s.filter((x) => x !== t));
  const onTagKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addTagFromInput(); }
  };

  const onSave = async () => {
    try {
      const payload = {
        title,
        description,
        dueDate: dueDate ? dayjs(dueDate).tz("Asia/Kolkata").toISOString() : null,
        priority,
        status,
        project,
        tags,
      };
      await updateTask(task._id, payload);
      toast.success("Saved");
      setOpen(false);
      onClose();
    } catch (e) {
      toast.error("Failed to save");
      console.error("TaskModal save error:", e);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(task._id);
      toast.success("Deleted");
      setOpen(false);
      onClose();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => { setOpen(false); onClose(); }}>
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md rounded bg-white dark:bg-gray-800 p-6 ring-1 ring-black/5 dark:ring-white/5">
                <Dialog.Title className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Edit Task</Dialog.Title>
                <div className="space-y-3">
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-700 text-gray-900 dark:text-gray-100" />

                  <label className="text-sm text-gray-700 dark:text-gray-300">Due (IST)</label>
                  <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-700 text-gray-900 dark:text-gray-100" />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300">Priority</label>
                      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300">Project / Category</label>
                    <input value={project} onChange={(e) => setProject(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300">Tags</label>
                    <div className="flex gap-2 items-center flex-wrap mt-2">
                      {tags.map((t) => (
                        <div key={t} className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1 rounded-full border">
                          <span className="text-sm text-indigo-700 dark:text-indigo-200">{t}</span>
                          <button type="button" onClick={() => removeTag(t)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">×</button>
                        </div>
                      ))}
                    </div>
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onTagKeyDown} placeholder="Type tag and press Enter" className="w-full p-2 mt-2 border rounded dark:bg-gray-700 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>

                  <div className="flex justify-between mt-3">
                    <div className="flex gap-2">
                      <button onClick={onSave} className="px-3 py-1 rounded bg-green-600 text-white">Save</button>
                      <button onClick={() => { setOpen(false); onClose(); }} className="px-3 py-1 rounded border text-gray-700 dark:text-gray-200">Cancel</button>
                    </div>
                    <button onClick={onDelete} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
