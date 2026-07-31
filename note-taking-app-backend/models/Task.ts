import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from './Project';
import { ICategory } from './Category'; 

export interface ITask extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId | IProject;
  category?: mongoose.Types.ObjectId | ICategory; 
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
  category: { type: Schema.Types.ObjectId, ref: 'Category' }, // 👈 category ထည့်
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