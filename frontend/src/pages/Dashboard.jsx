import { useNavigate } from "react-router-dom";
import { Balance } from "../components/Balance";

import { NavBar } from "../components/NavBar";
import { Users } from "../components/Users";
import { useEffect } from "react";

export function Dashboard(){
    const navigate=useNavigate();
    useEffect(()=>{
        if(!localStorage.token){
            navigate("/signin");
        }
    },[navigate])
    
        return(
            <>
            <NavBar/>
            <Balance />
            <Users/>
            </>
        )
}