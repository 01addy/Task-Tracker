import Head from "next/head";
import ProtectedRoute from "../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useTasks } from "../stores/useTasks";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const IST = "Asia/Kolkata";

export default function WeekPage() {
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

  // week range in IST (uses locale week start). If you prefer Monday-based weeks, tell me and I'll switch to isoWeek.
  const weekStart = dayjs().tz(IST).startOf("week");
  const weekEnd = dayjs().tz(IST).endOf("week");

  const thisWeek = (tasks || []).filter((t) => {
    if (!t.dueDate) return false;
    const d = dayjs(t.dueDate).tz(IST);
    return d.isBetween(weekStart, weekEnd, null, "[]");
  });

  return (
    <ProtectedRoute>
      <Head>
        <title>This Week — TaskTracker</title>
      </Head>

      <div className="max-w-4xl mx-auto mt-6 space-y-4 pb-36">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-700">This Week</h1>
          <div className="text-sm text-gray-500 mt-1">{thisWeek.length} task{thisWeek.length !== 1 ? "s" : ""} scheduled this week</div>
        </div>

        <div className="space-y-4">
          {thisWeek && thisWeek.length ? thisWeek.map((t) => (
            <TaskCard key={t._id} task={t} onToggle={handleToggle} onEdit={setSelected} />
          )) : <div className="text-gray-500">No tasks scheduled this week.</div>}
        </div>

        <TaskModal task={selected} onClose={() => setSelected(null)} />
      </div>
    </ProtectedRoute>
  );
}
