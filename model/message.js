import mongoose from 'mongoose';
const { Schema, model } = mongoose; 

const messageSchema = new mongoose.Schema({
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

export default model('Message', messageSchema);