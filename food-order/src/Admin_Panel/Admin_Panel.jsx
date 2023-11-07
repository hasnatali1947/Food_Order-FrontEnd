import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import "../app/styles/admin_Panel.css"
import { dustban } from '@/utility/imports'
import { useStateContext } from '@/context/context'

export default function Admin_Page() {

  const [name, setName] = useState('')
  const [smallPrice, setSmallPrice] = useState('')
  const [mediumPrice, setMediumPrice] = useState('')
  const [largePrice, setLargePrice] = useState('')
  const [category, setCategory] = useState(['Spicy', 'Mild'])
  const [sizes, setsizes] = useState(['small', 'medium', 'large'])
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [addPizza, setAddPizza] = useState(false)
  const [pizzaList, setPizzaList] = useState(false)
  const [displayOrdersList, setDisplayOrdersList] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const { pizzaData, setPizzaData } = useStateContext();

  useEffect(() => {
    const getLogin = localStorage.getItem("adminLogin")
    if (getLogin === 'true') {
      setIsAdmin(true)
    }
  })

  const AdminLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/AdminLogin/admin_panel", { email, password });

      if (response.status === 200) {
        setIsAdmin(true);
        localStorage.setItem('adminLogin', 'true')
      } else {
        window.alert('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      window.alert('Invalid email or password');
    }
  };

  useEffect(() => {
    const OrderList = async () => {
      const response = await axios.get("http://localhost:5000/api/myorder/myOrderRoute")
      const data = response.data
      setOrderList(data)
    }
    OrderList();
  }, [])

  const HandleAdding = async () => {
    const pizzaData = {
      name,
      smallPrice,
      mediumPrice,
      largePrice,
      prices: sizes.map((size) => ({
        [size]: size === "small" ? smallPrice : size === "medium" ? mediumPrice : largePrice,
      })),
      category,
      sizes,
      description,
      image,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/pizzaApiRoute/apiPizzasRoute", {
        data: pizzaData,
      });
      setName('');
      setSmallPrice('');
      setMediumPrice('');
      setLargePrice('');
      setCategory(['Spicy', 'Mild']);
      setsizes(['small', 'medium', 'large']);
      setDescription('');
      setImage('');
    } catch (error) {
      console.error("Error adding pizza:", error);
    };
  };

  const handleDeliver = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/markDelivered/markDelivered/${orderId}`);
      const updatedOrderList = orderList.map((order) => {
        if (order._id === orderId) {
          return { ...order, isDelivered: true };
        } else {
          return order;
        }
      });
      setOrderList(updatedOrderList);
    } catch (error) {
      console.error("Error marking order as delivered: ", error);
    }
  };

  const DeleteItems = async (index, pizzaId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/deletePizza/${pizzaId}`)
      if (response.status === 200) {
        const updatePizzas = [...pizzaData]
        updatePizzas.splice(index, 1)
        setPizzaData(updatePizzas)
        console.log("update",updatePizzas);
      } else {
        console.error("someThing went wrong in delete Api", error);
      }
    } catch (error) {
      console.error("someThing went wrong in delete Api", error);
    }
  }

  const ClickAddPizza = () => {
    setDisplayOrdersList(false);
    setAddPizza(true);
    setPizzaList(false)
  }

  const DisplayOrdersList = () => {
    setAddPizza(false);
    setDisplayOrdersList(true);
    setPizzaList(false)
  }

  const ClickpizzaList = () => {
    setAddPizza(false);
    setDisplayOrdersList(false);
    setPizzaList(true)
  }

  const logOut = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (confirmLogout) {
      localStorage.removeItem("adminLogin");
      window.location.href = "/Admin_Panel";
    }
  };

  const ClientsDBD = () => {
    const confirm = window.confirm('Are you sure you want to go clients Dishboard')
    if (confirm) {
      window.location.href = "/HomeScreen"
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <>
      {isAdmin ? (
        <div className='container'>
          <header>
            <nav>
              <h2>Pizza_House</h2>
              <ul className='logOut'>
                <li onClick={logOut}>LogOut</li>
                <li onClick={ClientsDBD}>Clients Dishboard</li>
              </ul>
            </nav>
          </header>

          <h1 className='headingAdminPanel'>Admin_Panel</h1>
          <div className='AdminPanelDiv'>
            <ul className='adminPanel_header'>
              <li onClick={ClickpizzaList}>Pizzas List</li>
              <li onClick={ClickAddPizza}>Add Pizza</li>
              <li onClick={DisplayOrdersList}>Orders List</li>
            </ul>
            {pizzaList ?
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Prices</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {pizzaData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>
                          Small: {item.prices[0].small}, Medium: {item.prices[0].medium}, Large: {item.prices[0].large}
                        </td>
                        <td className='td'>
                          <img onClick={() => DeleteItems(index, item._id)} className='dustban' src={dustban.src} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              :
              ''
            }
            {addPizza ?
              <div className='inputs'>
                <input required value={name} onChange={(e) => { setName(e.target.value) }} placeholder='name' type="text" />
                <input required value={smallPrice} onChange={(e) => { setSmallPrice(e.target.value) }} placeholder='small variant price' type="number" />
                <input required value={mediumPrice} onChange={(e) => { setMediumPrice(e.target.value) }} placeholder='medium variant price' type="number" />
                <input required value={largePrice} onChange={(e) => { setLargePrice(e.target.value) }} placeholder='large variant price' type="number" />
                <input required value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder='description' type="text" />
                <input required value={image} onChange={(e) => { setImage(e.target.value) }} placeholder='image' type="text" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                />
                {image && <img src={image} alt="Uploaded" />}
                <button onClick={HandleAdding}>Add</button>
              </div>
              :
              ""
            }

            {displayOrdersList ?
              <table>
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Email</th>
                    <th>User Id</th>
                    <th>Amount</th>
                    <th>Data</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map((item, index) => (
                    <tr key={index}>
                      <td>{item.transactionId}</td>
                      <td>{item.email}</td>
                      <td>{item._id}</td>
                      <td>{item.orderAmount}</td>
                      <td>{item.updatedAt.substring(0, 10)}</td>
                      <td>{item.isDelivered ? (
                        <b style={{ color: ' rgba(3, 7, 72, 0.798)' }}>Delivered</b>
                      ) : (
                        <button className='deliverBtn' onClick={() => handleDeliver(item._id)}>Deliver</button>
                      )}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              :
              ''
            }
          </div>
        </div>
      ) :
        <div className='AdminLoginPage'>
          <div>
            <h1 className='loginHeading'>Login Admin</h1>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
            <button onClick={AdminLogin}>Login</button>
          </div>
        </div>
      }
    </>
  );
}
