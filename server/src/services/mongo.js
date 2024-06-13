const mongoose = require('mongoose');


const MONGO_URL = process.env.MONGO_URL;




mongoose.connection.once("open", () => {
    console.log("MongoDB Connection ready!");
  });
  
  mongoose.connection.on("error", (err) => {
    console.error(err);
  });


async function mongoConnect(){
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
}


async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports ={
    mongoConnect,
    mongoDisconnect,
}