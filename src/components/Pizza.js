import React, { useState } from "react";
import { useStateContext } from "@/context/context";
import Image from "next/image";

const Pizza = ({ pizza }) => {
    const [selectedSize, setSelectedSize] = useState("small");
    const [selectedCategory, setSelectedCategory] = useState("spicy");
    const [Quantity, setQuantity] = useState(1);
    const [PopupPizza, setPopupPizza] = useState("none")
    const { cart, setCart } = useStateContext()

    const ClickPizza = () => {
        setPopupPizza('flex')
    }

    const popupClose = () => {
        setPopupPizza('none')
    }

    const AddToCart = () => {
        const duplicateName = cart.some((addItem) => (addItem._id === pizza._id))
        if (!duplicateName) {
            const selectedPizza = {
                _id: pizza._id,
                name: pizza.name,
                size: selectedSize,
                category: selectedCategory,
                prices: pizza.prices,
                price: pizza.prices[0][selectedSize] * Quantity,
                image: pizza.image,
                Quantity: Quantity,
            };
            setCart([...cart, selectedPizza]);
            localStorage.setItem('cartData', JSON.stringify([...cart, selectedPizza]));
        }
    }

    return (
        <>
            <div className="pizzaDiv">
                <div className="pizzaDiv2">
                    <h3>{pizza.name}</h3>
                    <Image onClick={ClickPizza} className="pizzaImg" width={200} height={200} src={pizza.image} alt="pizza image" />
                    <div className="sizesQuantityDiv">
                        <div className="SizesCategory">
                            <div className="sizes">
                                <span> <b>Sizes</b></span>
                                <select onChange={(e) => setSelectedSize(e.target.value)}
                                    className="small-options"
                                >
                                    {pizza.sizes.map((size, sizeIndex) => (
                                        <option value={size} key={sizeIndex}>
                                            {size}
                                        </option>
                                    ))}
                                </select>

                                <span> <b>Category</b> </span>
                                <select onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="small-options"
                                >
                                    {pizza.category.map((size, sizeIndex) => (
                                        <option value={size} key={sizeIndex}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="quantity">
                            <span> <b>Quantity</b></span>
                            <select onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="small-options"
                            >
                                {[...Array(10).keys()].map((i) => (
                                    <option value={i + 1} key={i}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="priceBtnDiv">
                        <span><b>Price: {pizza.prices[0][selectedSize] * Quantity} ./Rs</b></span>
                        <button onClick={() => AddToCart(pizza)} >Add To Cart</button>
                    </div>
                </div>

            </div>
            <div className={`popup-pizza ${PopupPizza !== 'none' ? 'active' : ''}`}>
                <div className="popup-pizza-div">
                    <h1>{pizza.name}</h1>
                    <Image className="Popup-pizzaImg" width={200} height={200} src={pizza.image} alt="Pizza image" />
                    <p>{pizza.description}</p>
                    <button className="popupClose" onClick={popupClose}>close</button>
                </div>
            </div>
        </>
    );
};

export default Pizza;
