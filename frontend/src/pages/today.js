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

export default function TodayPage() {
  const { tasks, fetchTasks, updateTask } = useTasks();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchTasks(); // populate store
  }, [fetchTasks]);

  const handleToggle = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
    } catch (e) {
      console.error(e);
    }
  };

  // filter tasks due today in IST
  const todayStart = dayjs().tz(IST).startOf("day");
  const todayEnd = dayjs().tz(IST).endOf("day");

  const todays = (tasks || []).filter((t) => {
    if (!t.dueDate) return false;
    const d = dayjs(t.dueDate).tz(IST);
    // using dayjs isBetween plugin; inclusive of bounds
    return d.isBetween(todayStart, todayEnd, null, "[]");
  });

  return (
    <ProtectedRoute>
      <Head>
        <title>Today — TaskTracker</title>
      </Head>

      <div className="max-w-4xl mx-auto mt-6 space-y-4 pb-36">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-700">Today</h1>
          <div className="text-sm text-gray-500 mt-1">{todays.length} task{todays.length !== 1 ? "s" : ""} scheduled for today</div>
        </div>

        <div className="space-y-4">
          {todays && todays.length ? todays.map((t) => (
            <TaskCard key={t._id} task={t} onToggle={handleToggle} onEdit={setSelected} />
          )) : <div className="text-gray-500">No tasks scheduled for today.</div>}
        </div>

        <TaskModal task={selected} onClose={() => setSelected(null)} />
      </div>
    </ProtectedRoute>
  );
}
