import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  values: [{
    title: String,
    description: String
  }],
  features: [{
    title: String,
    description: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('About', aboutSchema);
