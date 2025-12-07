import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const IST = "Asia/Kolkata";

function priorityClass(p) {
  if (p === "high") return "text-white bg-red-500";
  if (p === "medium") return "text-amber-700 bg-amber-100 border border-amber-200";
  return "text-gray-700 bg-gray-100";
}

export default function TaskCard({ task, onToggle, onEdit }) {
  const due = task.dueDate ? dayjs(task.dueDate).tz(IST) : null;
  const now = dayjs().tz(IST);
  const isPast = due ? due.isBefore(now) : false;
  const dotColor = task.completed ? "bg-gray-400" : isPast ? "bg-red-500" : "bg-emerald-500";

  return (
    <div className="card-soft p-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-4 w-full">
        <button
          onClick={() => onToggle(task)}
          aria-label="toggle complete"
          className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700'}`}
        >
          {task.completed ? (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : null}
        </button>

        <div className="flex-1">
          <div className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>{task.title}</div>

          {task.project ? <div className="text-sm text-indigo-600 dark:text-indigo-300 mt-1 font-medium">{task.project}</div> : null}

          {task.description ? <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">{task.description}</div> : null}

          <div className="flex items-center gap-3 text-sm mt-3 flex-wrap">
            {due ? (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                <span className={`status-dot ${dotColor}`}></span>
                <span>{due.format('DD MMM, YYYY, h:mm A')}</span>
              </div>
            ) : null}

            <div>
              <span className={`px-2 py-1 rounded-full text-xs ${priorityClass(task.priority)}`}>{(task.priority || "low").toUpperCase()}</span>
            </div>

            <div className="flex gap-2">
              {(task.tags || []).slice(0, 5).map((t, idx) => (
                <span key={idx} className="text-xs px-2 py-1 border rounded-full bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(task)} className="px-3 py-1 border rounded text-sm text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800">Edit</button>
      </div>
    </div>
  );
}
