// src/components/NewTaskButton.js
import Link from "next/link";
export default function NewTaskButton(){
  return (
    <div className="fixed right-6 bottom-8 z-40">
      <Link href="/tasks/create" className="inline-flex items-center gap-3 px-5 py-3 rounded-full text-white btn-gradient shadow-2xl">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="font-semibold">New Task</span>
      </Link>
    </div>
  );
}
