import { useEffect, useState } from "react";
import { BottomText } from "./BottomText";
import axios from 'axios'

export function Balance(){
    const [Balance,setBalance]=useState();
    const [id,setId]=useState();
    const [username,setUsername]=useState();
    const [name,setname]=useState();
    
    useEffect(()=>{
        axios.get('http://localhost:3000/api/v1/account/balance',{
            
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }
        })
    .then(e=>{
        setBalance(e.data.balance)
        setId(e.data.userId)
        setUsername(e.data.username)
        setname(e.data.name)
    })
    
    },[Balance])
    
    
    
    return(
        <>
        <div className="grid grid-cols-2 justify-items-center my-8">
            <h2 className=" w-3/4 text-4xl font-semibold">Welcome {name}</h2>
        </div>
        <div className="grid grid-cols-2 justify-items-center my-12">
            <div className=" w-3/4">
            <div className="block w-3/4 p-6 bg-white border  border-gray-200 shadow-md ">
                <h5 className="mb-2 text-2xl font-bold tracking-tight w-full text-black">Your Balance</h5>
                 <p className="text-4xl font-semibold">₹{Balance}</p>
                <BottomText content={"Add Money"} buttonText={"Click here to TopUp your wallet"} to={'/signup'}/>
            </div>
            </div>
            <div className="w-3/4">
            <div className="block  p-6 bg-white border  border-gray-200 shadow-md ">

                <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">Account Details</h5>
  
                 <p className="text-2xl font-semibold my-3">Username - {username}</p>
                 <p className="text-2xl font-semibold">Account Number - {id}</p>
                
            </div>
            </div>
        </div>
        </>
    )
}

