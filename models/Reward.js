import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  upTo: { 
    type: String, 
    required: true 
  },
  label: { 
    type: String, 
    required: true 
  },
  whatYouGet: [{
    text: { type: String, required: true }
  }],
  requirements: [{
    text: { type: String, required: true }
  }],
  specialBadge: {
    type: String,
    default: ''
  },
  priority: {
    type: Number,
    default: 0
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Reward', rewardSchema);
