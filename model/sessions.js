import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const sessionsSchema = new mongoose.Schema({
    clientID: {
        type: String,
        required: true,
      },
      coachID: {
        type: String,
        required: true,
      },
  sessiondate: {
    type: String,
    required: true,
  },
 Transfered: {
    type: String,
    required: true,
  },

  
 
});




export default model('Session', sessionsSchema);