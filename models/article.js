let mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  path:  {
    type: String
  },
  caption: {
    type: String
  },
});

let Article = module.exports = mongoose.model('Article', articleSchema);
