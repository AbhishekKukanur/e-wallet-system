import React, { useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import Dropdown from "../components/Dropdown";
import { resolvePath, useNavigate } from "react-router-dom";


export default function Home(){
  const navigate = useNavigate();
  const [wallets, setWallet] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('Choose a Wallet');
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const [amount, setTransactionAmount] = useState(0)
  const [fromDate, setFromDate] = useState('Pick a date')
  const [toDate, setToDate] = useState("Pick a date")
  const [report, setReport] = useState([])
  const [availableWallets, setAvailableWallets] = useState([
    {type:"e-wallet"},
    {type:"mobile-wallet"},
    {type:"shopping-wallet"},
  ]
)

  const handleDropdownChange = (e) =>{
    setSelectedWallet(e.target.value);
  }
  const handleRadioChange = (e) =>{
    setSelectedTransaction(e.target.value);
  }
  const handleTextChange = (e) =>{
    setTransactionAmount(e.target.value);
  }
  const handleFromDatePicker = (e) =>{
    setFromDate(e.target.value)
  }

  const handleToDatePicker = (e) =>{
    setToDate(e.target.value)
  }

  const handleTransactionSubmit = async(e) =>{
    e.preventDefault()
    if(selectedWallet == 'Choose a Wallet'){
    alert("Please select a wallet")
    }
    else if(selectedTransaction == ''){
      alert("Please select a transaction type")
    }
    else if(amount < 0){
      alert("Please enter positive amount")
    }
    else{
      axios.post("/create-transaction",{
          phoneNumber:localStorage.getItem("phoneNumber"),
          walletType:selectedWallet,
          transactionType:selectedTransaction,
          amount:amount  
      })
      .then(function(response){
        console.log(response);
        alert("Transaction is successful!")
        getWallet();
      })
      .catch(function(error){
        console.log(error,'error')
        if (String(error).includes("409")){
          alert("Wallet not found")
        }
        else if (String(error).includes("401")){
          alert("ERROR: Transaction Failed - Insufficient funds!")
        }
        else{
          alert("Error:"+error)
        }
      })
    }
  }

  const handleTransactionReportSubmit = (e) =>{
    e.preventDefault()
    if(selectedWallet == 'Choose a Wallet'){
      alert("Please select a wallet")
      }
    else if (fromDate == 'Pick a date' | fromDate == ''){
      alert("Please enter the From date")
    }
    else if (toDate == 'Pick a date' | toDate == ''){
      alert("Please enter the To date")
    }
    else{
      axios.get("/get-transaction",{
        params:{
          phoneNumber:localStorage.getItem("phoneNumber"),
          walletType:selectedWallet,
          fromDate:fromDate,
          toDate:toDate
        }
      })
      .then(function(response) {
        if (response.length===0){
          alert("No transactions found")
        }
        setReport(response.data)
      })
      .catch(function(error){
        console.log(error,'error')
        alert("ERROR: "+error)
      })
    }
  }

const handleWalletCreate = (e)=>{
  e.preventDefault()
  if(selectedWallet == "Select a Wallet"){
    alert("Please select a wallet")
  }
  else{
    axios.post("/create-wallet",{
        phoneNumber:localStorage.getItem("phoneNumber"),
        walletType:selectedWallet,
    })
    .then(function(response){
      console.log(response);
      alert(selectedWallet+" Wallet has been successfully!")
      getWallet();
      setSelectedWallet('')
    })
    .catch(function(error){
      console.log(error,'error')
      if (String(error).includes("409")){
        alert("Wallet of type: "+selectedWallet+" already exists!")
      }
      else{
        alert("Error:"+error)
    }
    })
  }
}

  useEffect(() =>{
    getWallet()
  }, [])

  function getWallet(){
    axios.get("/get-wallet",{
      params:{
      phoneNumber:localStorage.getItem("phoneNumber")
      }
    })
    .then((response) =>{
      return response.data ;
    })
    .then((data)=>{
      console.log(data)
      setWallet(data)
    })
    .catch((error)=>{
      alert("No linked wallet found. Create a new wallet")
    })
  }

  return(
    <React.Fragment>
      <div class="container text-center">
        <div className="row" style={{padding: "1rem"}}>
          <div className="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title bg-primary">Your Wallets</h5>
                <table className="table text-center">
                  <thead>
                    <tr className="p-3 rounded">
                    <th>Wallet type</th>
                    <th>balance</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    wallets && wallets?.map((wallet) =>{
                        const {balance, id, type} = wallet;
                        return(
                          <tr>
                            <td>{type}</td>
                            <td>{balance}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                <br></br>
                <br></br>
                {<Dropdown wallets={availableWallets} onChange={handleDropdownChange}/>}
                <br></br>
              </div>
              <a class="btn btn-primary" onClick={handleWalletCreate}>Create Wallet</a>
            </div>
          </div>
          <div className="col">
            <div class="card">
            <div class="card-body">
              <h5 class="card-title bg-primary">Transaction</h5>
              <p class="card-text">Make Transactions</p>
              {wallets && <Dropdown wallets={wallets} onChange={handleDropdownChange}/>}
              <br></br>
              <br></br>
              <input type="radio" name="transactionType" value="credit" onChange={handleRadioChange}/>Credit
              <input type="radio" name="transactionType" value="debit" onChange={handleRadioChange}/>Debit
              <br></br>
              <br></br>
              <input type="number" name="amount" onChange={handleTextChange}/>
            </div>
              <a class="btn btn-primary" onClick={handleTransactionSubmit}>Submit</a>
            </div>
          </div>
          <div className="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title bg-primary">Get Transactions Report</h5>
              Select the Wallet:
              {wallets && <Dropdown wallets={wallets} onChange={handleDropdownChange}/>}
              <br></br>
              <br></br>
              From:
              <input type="date" onChange={handleFromDatePicker}/>
              <br></br>
              <br></br>
              To:
              <input type="date" onChange={handleToDatePicker}/>
              <br></br>
              <br></br>
            </div>
            <a class="btn btn-primary" onClick={handleTransactionReportSubmit}>Get Report</a>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div className="container">
        <div className="mt-3">
          <h3>Transaction Report</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {report && report?.map((data, index) => {
                  return <tr key={index}>
                    <td>{data.id}</td>
                    <td>{data.date}</td>
                    <td>{data.type}</td>
                    <td>{data.amount}</td>
                  </tr>
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </React.Fragment>
  )
}