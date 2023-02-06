import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  let [Data, setData] = useState([]);
  let [currencyFormat, setCurrencyFormat] = useState("₹");
  let [pp, setpp] = useState(0);
  let [prices, setPrices] = useState();
  let [Qunatity, setQunatity] = useState(1);
  let [cart, setCart] = useState([]);

  const click = (name, category) => {
    axios
      .get(`http://localhost:3001/getItems?name=${name}&category=${category}`)
      .then((res) => {
        setData(res.data.data);
        setPrices(res.data.data.price);
      })
      .catch((err) => console.log(err));
    console.log(Data);
  };
  const change = (from, to, price) => {
    if (from == "USD") {
      setpp(0);
    } else {
      var myHeaders = new Headers();
      myHeaders.append("apikey", "DcYpFR8WprbfLxDQmNOS1BAKTEuyKNdz");

      var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      fetch(
        `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${prices}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => setpp(result.result))
        .catch((error) => console.log("error", error));
    }
  };
  const remove = (Id) => {
    console.log(Id);
    axios({
      method: "delete",
      url: "http://localhost:3001/RemoveCart",
      data: { _id: Id },
    })
      .then(function (response) {
        console.log(response);
        cartGet();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const uupdate = () => {
    var body = {
      name: Data.name,
      category: Data.category,
      image: Data.image,
      price: pp == 0 ? prices : pp,
      currencyFormat: currencyFormat,
      totalPrice: pp == 0 ? prices * Qunatity : pp * Qunatity,
      totalQuantity: Qunatity,
    };

    axios({
      method: "post",
      url: "http://localhost:3001/CreateCart",
      data: body,
    })
      .then(function (response) {
        console.log(response);
        alert("add successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const cartGet = (name, category) => {
    axios
      .get(`http://localhost:3001/getCart?name=${name}&category=${category}`)
      .then((res) => {
        setCart(res.data.data);
        // setPrices(res.data.data.price);
      })
      .catch((err) => console.log(err));
    console.log(cart);
  };

  return (
    <div style={{ backgroundColor: "black", height: "620px" }}>
      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "20px",
          backgroundColor: "red",
        }}
      >
        Shopping List
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "700px" }}>
          <div
            style={{
              display: "flex",
              padding: "20px",
              justifyContent: "space-between",
            }}
          >
            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
              >
                Fruits
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      click("Banana", "Fruits");
                      setCart([]);
                    }}
                  >
                    Banana
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      click("Apple", "Fruits");
                      setCart([]);
                    }}
                  >
                    Apple
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      click("Mango", "Fruits");
                      setCart([]);
                    }}
                  >
                    Mango
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
              >
                Vegetables
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    onClick={() => {
                      click("Tomato", "Vegetable");
                      setCart([]);
                    }}
                    href="#"
                  >
                    Tomato
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      click("Pumpkin", "Vegetable");
                      setCart([]);
                    }}
                    href="#"
                  >
                    Pumpkin
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      click("Carrot", "Vegetable");
                      setCart([]);
                    }}
                    href="#"
                  >
                    Carrot
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            {Data != 0 && (
              <div style={{}}>
                <img
                  src={Data != 0 ? Data.image : ""}
                  className="img-circle"
                  width="304"
                  height="236"
                />
                <div
                  style={{
                    color: "white",
                    paddingLeft: "80px",
                    margin: "20px",
                  }}
                >
                  <p>
                    <label>Price </label> : {pp == 0 ? prices : pp}{" "}
                    <label> {Data.currencyFormat}</label> / Kg
                  </p>
                  <p>
                    <label>Currency </label> : {}{" "}
                    <label>
                      <div className="dropdown">
                        <button
                          className="btn btn-primary dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                        >
                          {currencyFormat}
                          <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              onClick={() => {
                                change("USD", "INR", pp);
                                setCurrencyFormat("₹");
                              }}
                              href="#"
                            >
                              ₹
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => {
                                change("INR", "USD", prices);
                                setCurrencyFormat("$");
                              }}
                              href="#"
                            >
                              $
                            </a>
                          </li>
                        </ul>
                      </div>
                    </label>
                  </p>
                  <p>
                    <label> Category </label> : {Data.category}{" "}
                  </p>
                  <p>
                    <label> Qunatity </label>{" "}
                    <input
                      type="Number"
                      style={{ color: "black", width: "50px" }}
                      onChange={(e) => {
                        setQunatity(e.target.value);
                      }}
                    ></input>{" "}
                    Kg
                  </p>
                  <p>
                    <label>TotalPrice </label> :{" "}
                    {pp == 0 ? prices * Qunatity : pp * Qunatity}{" "}
                    <label>{currencyFormat}</label>{" "}
                  </p>
                  <p>
                    <label>TotalQuantity </label> : {Data.price}{" "}
                  </p>
                </div>
                <div style={{ textAlign: "center",display:"flex", justifyContent: "space-between", }}>
                  <button 
                    onClick={() => {
                      uupdate();
                    }}
                    style={{ color: "black", width: "200px",backgroundColor:"pink" }}
                  >
                    Add to Cart
                  </button>
                  <button
                  style={{ color: "black", width: "200px",backgroundColor:"pink" }}
                    onClick={() => {
                      cartGet("Mango", "Fruits");
                      setData([]);
                    }}
                  >
                    Check Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          {cart != 0 && (
            <div
              style={{ textAlign: "center", color: "white", padding: "40px" }}
            >
              <h1 style={{ margin: "20px" }}>Shopping List</h1>
              <table class="table" style={{ color: "white" }}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qunatity</th>
                    <th>TotalPrice</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => {
                    return (
                      <tr>
                        <td>
                          <img
                            className="img-circle"
                            style={{ height: "20px", width: "30px" }}
                            src={item.image}
                          ></img>
                        </td>
                        <td>{item.name}</td>
                        <td>
                          {item.price} {item.currencyFormat}
                        </td>
                        <td>{item.totalQuantity} Kg</td>
                        <td>
                          {item.totalPrice} {item.currencyFormat}
                        </td>
                        <td style={{ color: "black" }}>
                          <button
                            onClick={() => {
                              remove(item._id);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
