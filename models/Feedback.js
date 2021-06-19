const mongoose =  require("mongoose");
const feedbackSchema = new mongoose.Schema( {
    date:{
        type:Date,
        default:Date.now 
     },
    Email: {
        type:String,
        required:true 
    },
    username:{
        type:String,
        required:true 
    },
    Queries: {
        type:String,
        required:true 
    }
    
  });
  
  const Feedback = mongoose.model("Feedback",feedbackSchema);

  module.exports = mongoose.model('Feedback', feedbackSchema);

