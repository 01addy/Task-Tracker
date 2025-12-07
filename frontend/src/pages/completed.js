import Head from "next/head";
import ProtectedRoute from "../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useTasks } from "../stores/useTasks";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

export default function CompletedPage() {
  const { tasks, fetchTasks, updateTask } = useTasks();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggle = async (task) => {
    try {
      
      await updateTask(task._id, { completed: !task.completed });
    } catch (e) {
      console.error(e);
    }
  };

  
  const completed = (tasks || []).filter((t) => t.completed || t.status === "done");

  return (
    <ProtectedRoute>
      <Head>
        <title>Completed — TaskTracker</title>
      </Head>

      <div className="max-w-4xl mx-auto mt-6 space-y-4 pb-36">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-700">Completed</h1>
          <div className="text-sm text-gray-500 mt-1">{completed.length} completed task{completed.length !== 1 ? "s" : ""}</div>
        </div>

        <div className="space-y-4">
          {completed && completed.length ? completed.map((t) => (
            <TaskCard key={t._id} task={t} onToggle={handleToggle} onEdit={setSelected} />
          )) : <div className="text-gray-500">No completed tasks yet.</div>}
        </div>

        <TaskModal task={selected} onClose={() => setSelected(null)} />
      </div>
    </ProtectedRoute>
  );
}
