import { Link, useSearchParams,useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react';
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { ToastContainer } from 'react-toastify';
import axios from 'axios'
import { showErrorToast } from '../components/Alerts';

export function Verify() {
    const [otp,setotp]=useState('');
    const [searchParams]=useSearchParams()
    const navigate=useNavigate()
    const username=searchParams.get("username")
    const firstName=searchParams.get("firstName")
    const lastName=searchParams.get("lastName")
    const email=searchParams.get("email");
    const password=localStorage.getItem("Temp");

    const handleSignUp = async ()=>{
      
        const response=await axios.post('http://localhost:3000/api/v1/user/verify',{
            email,
            otp,
            username,
            firstName,
            lastName,
            hash:password
        })
        if(response.data.msg=="Invalid or expired OTP"){
            showErrorToast("Invalid OTP");
            navigate(`/verify?username=${username}&email=${email}&firstName=${firstName}&lastName=${lastName}`)
        }
        if(response.data.msg=="User created successfully"){
            localStorage.setItem("token",response.data.token);
            localStorage.removeItem("Temp")
            navigate('/dashboard')
        }
    };

  return (
    <div>
      <ToastContainer/>
      <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center w-1/3">
        <div className="shadow-3xl bg-white  text-center p-2 h-max px-4">


        <Heading label={"Verify Email"}/>
        <SubHeading label={`Email has been sent to ${email}`}/>
        <InputBox label={"Enter the OTP"} type={"text"} onchange={(e)=>{
            setotp(e.target.value)
        }}/>
        
        <Button onclick={handleSignUp} label={'Verify Email'} />
        </div>
        </div>
        </div>
    </div>
  )
}
