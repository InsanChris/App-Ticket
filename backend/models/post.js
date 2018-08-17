const mongoose = require('mongoose');

// Modèle du ticket dans la BDD

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  response: {type: String, required: false },
  date: { type: Date, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true }
});

module.exports = mongoose.model('Post', postSchema);
