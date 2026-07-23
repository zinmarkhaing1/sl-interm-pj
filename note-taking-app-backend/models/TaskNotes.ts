import mongoose, { Schema, Document } from 'mongoose';
import { ITask } from './Task';

export interface ITaskNote extends Document {
  task: mongoose.Types.ObjectId | ITask;
  content: string;
  createdBy: string;
}

const TaskNoteSchema = new Schema<ITaskNote>({
  task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ITaskNote>('TaskNote', TaskNoteSchema);