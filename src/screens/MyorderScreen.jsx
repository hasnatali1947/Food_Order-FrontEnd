"use client"

import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import { leftArrow } from '@/utility/imports'
import "../app/styles/myOrder.css"
import Link from 'next/link'
import Image from 'next/image'

const MyorderScreen = () => {

  const [myOrder, setMyOrder] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://foodorder-backend.onrender.com/api/myorder/myOrderRoute")
        const data = response.data
        setMyOrder(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [])

  if (loading) {
    return (
      <div className='loadingDiv'>
        <p>Loading...</p>
      </div>
    )
  }

  if (!myOrder || myOrder.length === 0) {
    return (
      <div className="NoOrderDiv">
        <h1>No Orders</h1>
      </div>
    )
  }

  return (
    <div className='MyOrderContainer'>

      <Link href="HomeScreen" ><Image className="backArrow" height={36} width={36} src={leftArrow.src} alt="leftArrow" /> </Link>
      <h1>My Orders</h1>
      {myOrder.map((item, index) => (
        <div key={index} className="orderMainDiv">
          <div className='ItemDiv'>
            <h2>Items</h2>
            <ul>
              {item.orderItems.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <p> <b>Name:</b> {item.name}</p>
                  <p> <b>Size:</b> {item.size}</p>
                  <p> <b>Price:</b>  {item.price}</p>
                </li>
              ))}
            </ul>
          </div>
          <div >
            <h2>Address</h2>
            <div className='fullAddress'>
              <span> <b>Person Name:</b> {item.name}</span>
              <span> <b>Street:</b> {item.fullAddress.street}</span>
              <span><b>City:</b> {item.fullAddress.City}</span>
              <span> <b>Country:</b> {item.fullAddress.Country}</span>
              <span> <b>PinCode:</b> {item.fullAddress.pinCode}</span>
            </div>
          </div>
          <div>
            <h2>Order Info</h2>
            <div className='OrderInfo'>
              <span><b>Total Amount:</b> {item.orderAmount}</span>
              <span><b>Date:</b> {item.updatedAt.substring(0, 10)}</span>
              <span><b>Delivery:</b> {item.isDelivered ?
                <span className='delivered'>Delivered</span>
                :
                <span className='preparing'>Preparing...</span>}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyorderScreen;