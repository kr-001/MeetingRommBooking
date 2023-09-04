import React, { useEffect, useState } from 'react';

import axios from 'axios';

export default function RoomList({ loggedInUser }) {
  const [rooms, setRooms] = useState( []);
  useEffect(()=>{
    axios.get('http://192.168.0.132:3001/api/rooms')
    .then((response)=>{
      setRooms(response.data.rooms);
    })
    .catch((error)=>{
      console.error("Error Fetching Data: ",error);
    })
  },[])
   
 
  
 

  const bookRoom = (roomId, timeSlot) => {
    console.log("RoomId: ", roomId);
    if (!loggedInUser) {
      alert('Please Log in to book a room.');
      window.location.href = '/';
      return;
    }

    // if (loggedInUser.bookings.some((booking) => booking.roomId === roomId && booking.timeSlot === timeSlot)) {
    //   alert("You have already booked this timeslot for this room.");
    //   return;
    // }



    const roomIndex = rooms.findIndex((room) => room._id === roomId);
    if (roomIndex === -1) {
      alert("Room Not Found!");
      return;
    }

    const room = rooms[roomIndex];

    if (room.isBooked === true) {
      
      alert('Room is not available for booking.');
      return;
    }

    const timeSlotIndex = room.availableSlots.findIndex((slot) => slot.timeSlot === timeSlot);
    if (timeSlotIndex === -1 || room.availableSlots[timeSlotIndex].disabled === true) {
      alert("Time slot for this room is not available for booking");
      return;
    }

    

    if (room.bookedSlots.includes(timeSlot)) {
      alert("This timeslot is already booked.");
      return;
    }

    const isTimeSlotBooked = rooms.some((room)=>room.bookedSlots.includes(timeSlot));
    if(isTimeSlotBooked===true){
      alert("This TimeSlot is already booked by another user!");
      return;
    }

    const guestName = prompt("Enter Your Name: ");
    if (!guestName) {
      alert("Please Enter Your Name: ");
      return;
    }
    const purpose = prompt("Enter purpose of the meeting:");
    if (!purpose) {
      alert("Please enter the purpose of the meeting.");
      return;
    }
    

    const updatedRooms = [...rooms];
    const updatedAvailableSlots = [...room.availableSlots];
    updatedAvailableSlots[timeSlotIndex].disabled = true;
    updatedRooms[roomIndex] = { ...room, availableSlots: updatedAvailableSlots};
    
    
    axios.put(`http://192.168.0.132:3001/api/rooms/${roomId}`,{guestName: guestName,loggedInUser , timeSlot: timeSlot, purpose:purpose , disabled: true})
    .then(()=>{
      alert("Booked Successfully!");
      window.location.reload();
    })
    .catch((error)=>{
      alert("Time Slot is already booked!");
    });
  };

  return (
    <>
      <div className='container'>
  <h2 className='my-3'>Available Rooms</h2>
  <ul className='list-group'>
    {rooms.map((room) => (
      <li key={room.id} className='list-group-item'>
        <h5 className='mb-1'>{room.name}</h5>
        {room.availableSlots.length > 0 && (
          <div>
            <p>Available Time Slots</p>
            <ul className='list-group'>
              {room.availableSlots.map((slot, index) => (
                <li key={index} className='list-group-item d-flex justify-content-between align-items-center'>
                  {slot.timeSlot}
                  <button
                    onClick={() => bookRoom(room._id, slot.timeSlot)}
                    disabled={slot.disabled === true}
                    className='btn btn-primary'
                  >
                    Book
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    ))}
  </ul>
</div>
    </>
  );
}
