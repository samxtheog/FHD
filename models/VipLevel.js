import mongoose from 'mongoose';

const vipLevelSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true
  },
  wagered: {
    type: String,
    required: true
  },
  bonus: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    default: '#EDBE23'
  },
  locked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('VipLevel', vipLevelSchema);
