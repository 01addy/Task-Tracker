// src/pages/index.js
import ProtectedRoute from "../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useTasks } from "../stores/useTasks";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";
import NewTaskButton from "../components/NewTaskButton";

export default function HomePage() {
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

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto mt-6 space-y-4 pb-36">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-500 dark:text-indigo-300">All Tasks</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">You have {tasks?.length || 0} tasks</div>

          </div>
        </div>

        <div className="space-y-4">
          {tasks && tasks.length ? tasks.map(t => (
            <TaskCard key={t._id} task={t} onToggle={handleToggle} onEdit={setSelected} />
          )) : <div className="text-gray-500">No tasks yet</div>}
        </div>

        <TaskModal task={selected} onClose={() => setSelected(null)} />
        <NewTaskButton />
      </div>
    </ProtectedRoute>
  );
}
