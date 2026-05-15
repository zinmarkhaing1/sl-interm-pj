import mongoose from "mongoose";


export interface NoteCategoryDocument extends Document {
  input: string;
  notetypes: string;
  user: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const NoteCategorySchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },

    

    notetypes: {
      type: String,
      enum: ["Todo", "Important"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NoteCategory = mongoose.model<NoteCategoryDocument>("NoteCategory", NoteCategorySchema);

export default NoteCategory;