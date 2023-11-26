"use client"
import axios from 'axios';
import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useStateContext } from '@/context/context';

export default function Checkout({ subTotal }) {
  const { cart } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showEmptyCartMsg, setShowEmptyCartMsg] = useState(false);

  const tokenHandler = async (token) => {
    try {
      setLoading(true);
      setShowSuccessMessage(false);

      if(cart.length === 0){
        setLoading(false);
        setShowEmptyCartMsg(true)
        setTimeout(() => {
          setShowEmptyCartMsg(false)
        }, 3000);
      }

      const response = await axios.post("https://foodorder-backend.onrender.com/api/order/orderRoute", { token, subTotal, cart });
      const data = response.data;
      setLoading(false);
      console.log("orderData:", data);

      if (response.status === 200) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
       else {
        console.log("Payment failed");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <StripeCheckout
        amount={subTotal * 100}
        shippingAddress
        stripeKey='pk_test_51O6bQ9GaFip5Wq2G5iswiMNb4mXHI4dPCEjaHDI55WYcFsvMXAp0FyswpQ5u6qSr3tvTDjsFPlXZ8Giu6qOaXGCU00rXVtAm3p'
        currency='INR'
        token={tokenHandler}
      >
        <button className="PAY-NOW">PAY NOW</button>
      </StripeCheckout>

      {loading && (
        <div className='loading'>
          <p>Loading...</p>
        </div>
      )}

      {showSuccessMessage && (
        <div className='PaymentSuccess'>
          <p>Payment Successfully</p>
        </div>
      )}

      {showEmptyCartMsg ? 
      <div className='PaymentSuccess'>
        <p>Cart Is Empty</p>
      </div>
      : ""  
    }
    </div>
  );
}
