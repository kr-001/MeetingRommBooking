import React, { useState, useEffect } from 'react';
import RoomList from './RoomList';
import Navbar from './Navbar';
import axios from 'axios';

export default function UserDashboard() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [roomNames, setRoomNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    setLoggedInUser(user);

    if (user) {
      axios.get(`http://192.168.0.132:3001/api/bookings/${user._id}`)
        .then((response) => {
          const userBooking = response.data.bookings;
          const names = response.data.roomNames;
          setUserBookings(userBooking);
          setRoomNames(names);
          setLoading(false); 
        })
        .catch((error) => {
          console.error("Error Fetching data: ", error);
          setLoading(false); 
        });
    } else {
      setLoading(false); 
    }
  }, []);

  const logout = () =>{
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  const cancelBooking = (roomId , timeSlot) =>{
    if(!loggedInUser){
      alert("Please log in to delete booking ");
      return;
    }
   axios.delete(`http://192.168.0.132:3001/api/delete/${loggedInUser._id}`,{data:{roomId,timeSlot},headers: { 'Content-Type': 'application/json' }})
   .then(()=>{
    const updateBookings = userBookings.filter((booking)=>!(booking.roomId === roomId && booking.timeSlot === timeSlot));
    setUserBookings(updateBookings);
    window.location.reload();
    alert("Booking canceled!");
   })
   .catch((error)=>{
      console.error('Error Canceling Booking: ', error);
      alert('Error canceling booking. Please try again later.');
   });

  } 

  return (
    <>


<Navbar title="User Dashboard" />
<div className='container'>
  <div className='row'>
    <aside className='col-md-4 border-end'>
      <h2 className='my-3'>Welcome, {loggedInUser ? loggedInUser.username : 'Guest'}</h2>
      <button onClick={logout} className='btn btn-danger'>Logout</button>
      <hr />
    </aside>
    <main className='col-md-8'>
      <RoomList loggedInUser={loggedInUser} />
      <h2 className='my-3'>Your Bookings</h2>
      <ul className='list-group'>
        {loggedInUser && userBookings.length > 0 ? (
          userBookings.map((booking, index) => (
            <li key={index} className='list-group-item'>
              <h5 className='mb-1'>{roomNames[index]}</h5>
              <p className='mb-1'>Host: {booking.guestName}</p>
              <p className='mb-1'>Time Slot: {booking.timeSlot}</p>
              <p className='mb-1'>Purpose: {booking.purpose}</p>
              <button onClick={() => cancelBooking(booking.roomId, booking.timeSlot)} className='btn btn-danger'>
                Cancel Booking
              </button>
            </li>
          ))
        ) : (
          <li className='list-group-item'>No bookings yet.</li>
        )}
      </ul>
    </main>
  </div>
</div>
    </>
  );
}