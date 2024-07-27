import { useState,useEffect} from "react";
import { BottomText } from "../components/BottomText";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../components/Alerts";
import { ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import ReactCardFlip from 'react-card-flip';
import { Button } from "../components/Button";
import { Checkmark } from 'react-checkmark'
import { XCircle } from 'react-feather';

export function Transfer(){
    const [amount,setAmount]=useState(0);
    const [password,setPassword]=useState('')
    const [isFlip,setIsflip]=useState(false)
    const [searchParams] = useSearchParams();
    const to = searchParams.get("id");
    const name = searchParams.get("name");
    const username=searchParams.get("myname")
    const navigate=useNavigate();
    useEffect(()=>{
        if(!localStorage.token){
            navigate('/signin');
        }
    },[navigate])


    const handleTransfer = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/login', {
                username,
                password
            });

            if (response.data.msg === "Invalid Credentials") {
                showErrorToast('Wrong Password');
            } else {
                initiateTransfer()
            }
        } catch (error) {
            showErrorToast('An error occurred');
            console.error(error);
        }
    };
    const initiateTransfer = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/account/transfer', {
                to:to,
                amount:parseInt(amount)
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.token}`
                }
            }
           );

            if (response.data.msg === "Invalid Credentials") {
                showErrorToast('Invalid Credentials');
                return;
            } 
            if(response.data.msg=="Insufficient Balance"){
                showErrorToast('Insufficient Balance')
                return;
            }
            if(response.data.msg=="Incomplete Transaction"){
                showErrorToast('Technical error Try again Later');
                return;
            }
            if(response.data.msg=="Transfer Complete"){
                showSuccessToast('Transfer Complete')
                setIsflip(true)
                return;
            }
        } catch (error) {
            showErrorToast('An error occurred');
        }
    };

    if(isFlip==true){
        return(
            <>
            <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center w-1/3">
        <div className="shadow-3xl bg-white text-center p-2 h-max px-4 relative">

            {/* Close icon */}
            <div className="absolute top-2 right-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <XCircle className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                    </div>

        <Checkmark size={'xLarge'} color='#48bb78'/>
        <Heading label={"Transfer Complete"} success={"text-green-500"}/>
        <SubHeading label={`₹ ${amount} is transfered to ${name}`}/>

        <BottomText content={"Transaction Detail"} buttonText="Click Here to Check" to={'/transactionhistory'}/>

        </div>
        </div>
        </div>
            </>
        )
    }

    return(
        <>
        <ToastContainer/>
        <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center w-1/3">
        <div className="shadow-3xl bg-white text-center p-2 h-max px-4 relative">

        {/* Close icon */}
        <div className="absolute top-2 right-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <XCircle className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                    </div>
        <Heading label={"Transfer Funds"}/>
        <SubHeading label={"Check the details of the reciever"}/>
        <InputBox label={"Account Number"} type={"text"} value={to} disabled={"disabled"}/>
        <InputBox label={"Account Holder"} type={"text"} value={name} disabled={"disabled"}/>
        <InputBox label={"Enter Ammount"} type={"number"} onchange={(e)=>{
            setAmount(e.target.value);
        }}/>
        <InputBox label={"Enter Your Password"} type={"password"} onchange={(e)=>{
            setPassword(e.target.value);
        }}/>
        <button className="text-white w-3/4 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2   dark:focus:ring-gray-700 dark:border-gray-700 my-3 mb-7" onClick={handleTransfer} >Pay Now</button>

        </div>
        </div>
        </div>
        </>
    )
}