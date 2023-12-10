import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const link = process.env.REACT_APP_API_URL + "/transactions";
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const addNewTransaction = async (ev) => {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          price,
          name: name.substring(price.length + 1),
          description,
          datetime,
        }),
      });
      const json = await response.json();
      setName("");
      setDescription("");
      setDatetime("");
      console.log("result", json);
      // Refresh transactions after adding a new one
      fetchTransactions();
    } catch (error) {
      console.error("Error adding new transaction:", error);
    }
  };

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);

  return (
    <main>
      <h1>₹ {balance}<span></span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Enter transaction name or description"
          />
          <input
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            type="text"
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div key={transaction.id}>
              <div className="transaction">
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div className={"price" + (transaction.price < 0 ? " red" : " green")}>
                    {transaction.price}
                  </div>
                  <div className="datetime">{transaction.datetime}</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
