import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  isPrivate: boolean;
  members: string[];
  owners: string[];
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  isPrivate: { type: Boolean, default: false },
  members: [{ type: String }],
  owners: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);