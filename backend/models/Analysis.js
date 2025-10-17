// structure of data (uses mongodb to create a schema for analysis data)
//tells mongoDB what kind data to excpect for each analysis

import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: String,
  emotion: String,
  lightLevel: String
});

export default mongoose.model('Analysis', analysisSchema);