import { useEffect, useState } from "react";
import { BottomText } from "../components/BottomText";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from 'axios'
import { showSuccessToast, showErrorToast } from "../components/Alerts";
import { ToastContainer } from 'react-toastify';


export function SignUp() {
    const [username,setusername]=useState('');
    const [firstName,setFirstName]=useState('');
    const [lastName,setLastName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.getItem('token')){
            navigate('/dashboard');
        }
    },[navigate])
    return(
        <>
        <ToastContainer/>
        <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center w-1/3">
        <div className="shadow-3xl bg-white  text-center p-2 h-max px-4">


        <Heading label={"Sign Up"}/>
        <SubHeading label={"Enter the required credentials to Sign Un"}/>
        <InputBox label={"Enter Your Username"} type={"text"} onchange={e=>{
            setusername(e.target.value)
        }}/>
        <InputBox label={"Enter Your First Name"} type={"text"} onchange={e=>{
            setFirstName(e.target.value)
        }}/>
        <InputBox label={"Enter Your Last Name"} type={"text"} onchange={e=>{
            setLastName(e.target.value)
        }}/>
        <InputBox label={"Enter Your Email"} type={"email"} onchange={e=>{
            setEmail(e.target.value)
        }}/>
        <InputBox label={"Enter Your Password"} type={"password"} onchange={e=>{
            setPassword(e.target.value)
        }}/>
        <Button onclick={async()=>{
            const response=await axios.post('http://localhost:3000/api/v1/user/signup',{
                username,
                email,
                password,
                firstName,
                lastName
            })
            console.log(response.data.msg)
            if (response.data.msg=="Invalid Credentials") {
                showErrorToast("Invalid Credentials")
            }
            if (response.data.msg=="User with same UserName or Email already exists") {
                showErrorToast("User With these credentials exists.")
            }
            if(response.data.msg=="OTP sent successfully"){
                const tempPass=(response.data.password)
                localStorage.setItem("Temp",tempPass)
                navigate(`/verify?username=${username}&email=${email}&firstName=${firstName}&lastName=${lastName}`)
            }
        }} label={'Verify Email'} />
        <BottomText content={"Already have an account?"} buttonText={"Click here to Sign In"} to={'/signin'}/>

        </div>
        </div>
        </div>
        </>
    )
}

function verify(){

}