import { useState, useEffect } from "https://esm.sh/react";

const API_URL = "https://script.google.com/macros/s/AKfycbyeyUVvkS6yPfPe0ZR6L7-o1H2sFrLIOKuinNw_Z1q8TSF44GtrXblwSUtxDLFqV0YhWA/exec";

export default function App() {

  const categories = [
    "Bank charge","Installment","Snacks","Rasel","Emon","Jewel",
    "Bank/Operio","Pelle","Tapperi","S.v.","Sarta",
    "Electric bill","Aqua","Internet","Tecnico","Mino",
    "Mosque","Prodotto","Credit card","Personal"
  ];

  const [sales,setSales]=useState([]);
  const [expenses,setExpenses]=useState([]);

  const [sale,setSale]=useState({date:"",customer:"",type:"Wash",method:"Cash",amount:""});
  const [exp,setExp]=useState({date:"",category:"Bank charge",method:"Cash",amount:""});

  useEffect(()=>{
    setSales(JSON.parse(localStorage.getItem("sales")||"[]"));
    setExpenses(JSON.parse(localStorage.getItem("expenses")||"[]"));
  },[]);

  useEffect(()=>localStorage.setItem("sales",JSON.stringify(sales)),[sales]);
  useEffect(()=>localStorage.setItem("expenses",JSON.stringify(expenses)),[expenses]);

  const send=(sheet,data)=>{
    fetch(`${API_URL}?sheet=${sheet}`,{
      method:"POST",
      body:JSON.stringify(data)
    });
  };

  const addSale=()=>{
    setSales([...sales,sale]);
    send("Sales",[sale.date,sale.customer,sale.type,sale.method,sale.amount]);
    setSale({date:"",customer:"",type:"Wash",method:"Cash",amount:""});
  };

  const addExp=()=>{
    setExpenses([...expenses,exp]);
    send("Expenses",[exp.date,exp.category,exp.method,exp.amount]);
    setExp({date:"",category:"Bank charge",method:"Cash",amount:""});
  };

  const cashSale=sales.filter(s=>s.method==="Cash").reduce((a,b)=>a+Number(b.amount||0),0);
  const posSale=sales.filter(s=>s.method==="POS").reduce((a,b)=>a+Number(b.amount||0),0);

  const cashExp=expenses.filter(e=>e.method==="Cash").reduce((a,b)=>a+Number(b.amount||0),0);
  const bankExp=expenses.filter(e=>e.method==="Bank").reduce((a,b)=>a+Number(b.amount||0),0);

  return (
    <div style={{padding:20,fontFamily:"Arial"}}>
      <h2>Lavasecco Elite Roma</h2>

      <h3>Sale</h3>
      <input placeholder="Date" value={sale.date} onChange={e=>setSale({...sale,date:e.target.value})}/>
      <input placeholder="Customer" value={sale.customer} onChange={e=>setSale({...sale,customer:e.target.value})}/>
      
      <select value={sale.type} onChange={e=>setSale({...sale,type:e.target.value})}>
        <option>Wash</option><option>Dry</option><option>Iron</option>
      </select>

      <select value={sale.method} onChange={e=>setSale({...sale,method:e.target.value})}>
        <option>Cash</option><option>POS</option>
      </select>

      <input placeholder="Amount" value={sale.amount} onChange={e=>setSale({...sale,amount:e.target.value})}/>
      <button onClick={addSale}>Add Sale</button>

      <h3>Expense</h3>
      <input placeholder="Date" value={exp.date} onChange={e=>setExp({...exp,date:e.target.value})}/>

      <select value={exp.category} onChange={e=>setExp({...exp,category:e.target.value})}>
        {categories.map((c,i)=><option key={i}>{c}</option>)}
      </select>

      <select value={exp.method} onChange={e=>setExp({...exp,method:e.target.value})}>
        <option>Cash</option><option>Bank</option>
      </select>

      <input placeholder="Amount" value={exp.amount} onChange={e=>setExp({...exp,amount:e.target.value})}/>
      <button onClick={addExp}>Add Expense</button>

      <h3>Summary</h3>
      <p>Cash Sale: €{cashSale}</p>
      <p>POS Sale: €{posSale}</p>
      <p>Cash Expense: €{cashExp}</p>
      <p>Bank Expense: €{bankExp}</p>

      <h4>Cash Balance: €{cashSale - cashExp}</h4>
      <h4>Bank Balance: €{posSale - bankExp}</h4>
    </div>
  );
}
