const mongoose =  require("mongoose");
const postSchema = new mongoose.Schema( {
    title: String,
    content: String,
    author: String,
    name:String,
    email: String
    
  });
  
  const Post = mongoose.model("Post",postSchema);

  module.exports = mongoose.model('Post', postSchema);

