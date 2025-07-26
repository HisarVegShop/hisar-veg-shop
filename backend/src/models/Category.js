// models/Category.ts
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  img: { type: String  },
});

export default mongoose.model('Category', categorySchema);
