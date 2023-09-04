import React from 'react'
import Navbar from './Navbar'
import '../css/Homepage.css'
import { useNavigate } from 'react-router-dom'

export default function Homepage() {
    const navigate = useNavigate();
        const buttonClick = ()=>{
              navigate("/login");
        };
  return (
    <>
     <Navbar title="BMR - HomePage"/>
     <div className='homepageContainer'>
        <div className='row'>
        <h1 id='homepageHeading0'>BMR-BOOK MEETING ROOMS</h1>
        <button id='homepageClick' onClick={buttonClick} className='btn btn-primary'>Start Booking</button>
        </div>
     </div>
    </>
  )
}
