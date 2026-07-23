import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from './Project';

export interface ITask extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId | IProject;
  assignee: string;
  status: 'Todo' | 'In Progress' | 'Complete' | 'Not Started';
  priority: 'Low' | 'Medium' | 'High';
  startDate?: Date;
  dueDate?: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Todo', 'In Progress', 'Complete', 'Not Started'], 
    default: 'Todo' 
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  startDate: { type: Date },
  dueDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);