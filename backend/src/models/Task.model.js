import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    status: { type: String, enum: ["todo", "inprogress", "done"], default: "todo" },
    completed: { type: Boolean, default: false },           
    tags: { type: [String], default: [] },                  
    project: { type: String, default: "" },                 
    reminderSent: { type: Boolean, default: false },
    reminderOffsetMinutes: { type: Number, default: 60 }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

TaskSchema.index({ userId: 1, dueDate: 1 });

export default mongoose.model("Task", TaskSchema);
