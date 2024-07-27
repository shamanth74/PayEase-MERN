import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { BottomText } from "../components/BottomText";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from 'axios'
import { Dashboard } from "./Dashboard";
import { showSuccessToast, showErrorToast } from "../components/Alerts";
import { ToastContainer } from 'react-toastify';

export function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.getItem('token')){
            navigate('/dashboard');
        }
    },[navigate])
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/login', {
                username,
                password
            });

            if (response.data.msg == "Invalid Credentials") {
                showErrorToast('Invalid Credentials');
            } else {
                localStorage.clear();
                localStorage.setItem("token", response.data.token);
                showSuccessToast('Login Successful');
                navigate('/dashboard');
            }
        } catch (error) {
            showErrorToast('An error occurred');
            console.error(error);
        }
    };
    return(
        <>
        <ToastContainer />

        <div className="bg-slate-300 min-h-screen flex justify-center items-center">
            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
                <div className="shadow-3xl bg-white text-center p-4">

                    <Heading label={"Sign In"} />
                    <SubHeading label={"Enter Your Username and Password to Sign In"} />
                    <InputBox label={"Enter Your Username"} type={"text"} onchange={(e) => setUsername(e.target.value)} />
                    <InputBox label={"Enter Your Password"} type={"password"} onchange={(e) => setPassword(e.target.value)} />
                    <Button onclick={handleLogin} label={'Sign In'} />
                    <BottomText content={"Already have an account?"} buttonText={"Click here to Sign Up"} to={'/signup'}/>
                </div>
            </div>
        </div>
    </>
    )
}