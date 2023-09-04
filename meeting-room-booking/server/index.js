const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const {MongoClient, ObjectId} = require('mongodb')
const fs = require('fs');
const { time } = require('console');
const app = express();
const port = 3001;


app.use(express.json());
app.use(cors());

const url = 'mongodb://127.0.0.1:27017'
const pool = new MongoClient(url);
const dbName = 'demodb1';

//Database connection
pool.connect()
.then(()=>{
console.log("Connected to database.");

})
.catch((error)=>{
  console.log("Error connecting to database.", error);
})

//APIs//

app.post('/api/login' , async(req,res)=>{
  try{
      const {username,password} = req.body;
      await pool.connect();
      const db = pool.db(dbName);
      const collection = db.collection('users');
      const user = await collection.findOne({username});
      console.log(user);

      if(!user){
         res.status(404).json({error: "User Not Found!"});
      }

      if(user.password === password){
             const token = jwt.sign({username},'ravi123',{expiresIn: '1h'});
             return res.json({token,user});
      }else{
        return res.status(401).json({error: "Invalid Password"});
      }
  }catch(error){
        console.error("Error During login:", error);
        res.status(500).json({error: "Internal Server Error"});
  }
});



app.get('/api/rooms',async(req,res)=>{
  try{
    await pool.connect();
    const db = pool.db(dbName);

    const roomCollection = db.collection('verlynk');
    const roomsData = await roomCollection.find({}).toArray();
    res.json({rooms: roomsData});
  }catch(error){
    console.error("Error Fetching Data: ",error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

app.put("/api/rooms/:roomId", async(req,res)=>{
  try{
    await pool.connect();
     const {roomId} = req.params;
     const {loggedInUser} = req.body;
     const db = pool.db(dbName);
     const bookingsCollection = db.collection('bookings');
     const {timeSlot} = req.body;
     const {purpose} = req.body;
     const {guestName} = req.body;
     

     const existingBooking = await bookingsCollection.findOne({
      roomId : new ObjectId(roomId),
      timeSlot: timeSlot,
     });
     console.log("Existing Booking: ", existingBooking);

     if(existingBooking){
      res.status(400).json({error: "This timeSlot is booked for this room"});
      return;
     }

     const roomCollection = db.collection("verlynk");
     const room = await roomCollection.findOne({
      _id: new ObjectId(roomId)
     });

     if(room.availableSlots.every(slot=>slot.disabled === true)){
     await roomCollection.updateOne(
        { _id: ObjectId("64f45b4af1e2cfaacf4093b3") },
        { $set: { isBooked: true } }
      );
     }

     const newBooking = {
      guestName: guestName,
      roomId : new ObjectId(roomId),
      userId : loggedInUser._id,
      timeSlot,
      purpose,
     }

     const bookingInsertResult = await bookingsCollection.insertOne(newBooking);
     console.log("Booking Insert Result: ", bookingInsertResult);


     if(bookingInsertResult.acknowledged === true){
      console.log("Room Booked Succesfully!");
      const roomCollection = db.collection("verlynk");
      await roomCollection.updateOne(
        { _id: new ObjectId(roomId), "availableSlots.timeSlot": timeSlot },
        { $set: { "availableSlots.$.disabled": true } }
      );
      res.status(200).json({messgae:"Room booking updated successfully!"});
     }else{
      res.status(404).json({error: "Room Not Found!"});
     }
  }catch(err){
   console.error("Error Updating Data: ",err);
   res.status(500).json({err: "Internal Server Error"});
  }

})

app.get("/api/bookings/:userId", async(req,res)=>{
  try{
    pool.connect();
    const {userId} = req.params;
    const db = pool.db(dbName);
    const bookingsCollection = db.collection("bookings");
    const userBookings = await bookingsCollection.find({ userId }).toArray();

    const roomNames = [];
    for(const booking of userBookings){
      const roomId = booking.roomId;
      const roomCollection = db.collection('verlynk');
      const room = await roomCollection.findOne({_id: roomId});
      if(room){
        roomNames.push(room.name);
      }
    }
    
    res.json({ bookings: userBookings, roomNames });
  }catch(error){
    console.error("Error fetching user bookings: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.delete("/api/delete/:userId",async(req,res)=>{
  console.log("Req PARAMS: ",req.params);
  try{
      const {userId} = req.params;
      const {roomId,timeSlot} = req.body;
      await pool.connect();
      const db = pool.db(dbName);
      const bookingsCollection = db.collection('bookings');
      const result = await bookingsCollection.deleteMany({
        $and: [
          { userId: userId },
          { roomId: new ObjectId(roomId) },
          { timeSlot: timeSlot }
        ]
      });
      if(result.deletedCount === 1){
        const roomCollection = db.collection("verlynk");
      await roomCollection.updateOne(
        { _id: new ObjectId(roomId), "availableSlots.timeSlot": timeSlot },
        { $set: { "availableSlots.$.disabled": false } }
      );
        res.status(200).json({message: "Booking Cancelled Successfully"});
      }else{
        res.status(400).json({message: "Booking Not Found"});
      }
  }catch(error){
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
