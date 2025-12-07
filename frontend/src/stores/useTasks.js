// src/stores/useTasks.js
import { create } from "zustand";
import api from "../lib/api";

export const useTasks = create((set, get) => ({
  tasks: [],
  loading: false,

  // fetch list (expects server: { ok, total, page, limit, tasks })
  fetchTasks: async (opts = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get("/api/tasks", { params: opts });
      // normalize to array
      const tasks = data?.tasks ?? (Array.isArray(data) ? data : []);
      set({ tasks });
      return data;
    } catch (e) {
      console.error("[useTasks.fetchTasks] error:", e?.response ?? e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  // createTask: optimistic update, then reconcile using resp.data.task
  createTask: async (payload) => {
    if (!payload || !payload.title) {
      const err = new Error("Title is required");
      console.error("[useTasks.createTask] validation failed", payload);
      throw err;
    }

    const tempId = "temp-" + Math.random().toString(36).slice(2, 9);
    const optimistic = { ...payload, _id: tempId, createdAt: new Date().toISOString() };

    // optimistic add
    set((s) => ({ tasks: [optimistic, ...s.tasks] }));

    try {
      console.log("[useTasks.createTask] POST /api/tasks payload:", payload);
      const resp = await api.post("/api/tasks", payload);
      console.log("[useTasks.createTask] resp:", resp?.data);

      // server wraps task: { ok: true, task: {...} }
      const serverTask = resp?.data?.task ?? resp?.data;
      if (!serverTask) {
        // unexpected shape
        throw new Error("Invalid server response");
      }

      // replace optimistic item with real task
      set((s) => ({
        tasks: s.tasks.map((t) => (t._id === tempId ? serverTask : t)),
      }));

      return serverTask;
    } catch (err) {
      console.error("[useTasks.createTask] error:", err?.response ?? err);
      // rollback optimistic entry
      set((s) => ({ tasks: s.tasks.filter((t) => t._id !== tempId) }));

      // rethrow so UI can toast with server message
      const message = err?.response?.data?.error || err?.message || "Create failed";
      const e = new Error(message);
      e.original = err;
      throw e;
    }
  },

  updateTask: async (id, changes) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.map((t) => (t._id === id ? { ...t, ...changes } : t)) }));
    try {
      const { data } = await api.put(`/api/tasks/${id}`, changes);
      const serverTask = data?.task ?? data;
      set((s) => ({ tasks: s.tasks.map((t) => (t._id === id ? serverTask : t)) }));
      return serverTask;
    } catch (e) {
      set({ tasks: prev });
      console.error("[useTasks.updateTask] error:", e?.response ?? e);
      throw e;
    }
  },

  deleteTask: async (id) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) }));
    try {
      await api.delete(`/api/tasks/${id}`);
      return true;
    } catch (e) {
      set({ tasks: prev });
      console.error("[useTasks.deleteTask] error:", e?.response ?? e);
      throw e;
    }
  },
}));
