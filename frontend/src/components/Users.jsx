import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {Button} from './Button';
import axios from 'axios'
import { Balance } from "./Balance";

export function Users(){
  const [users,setUsers]=useState([]);
  const [filter,setFilter]=useState([]);
  const [myname,setMyname]=useState('')

  useEffect(()=>{
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(usersResponse.data.user);
  
        // Fetch current user
        const userResponse = await axios.post('http://localhost:3000/api/v1/user/me', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMyname(userResponse.data.username);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  },[filter])

    return(
        <>
  <div className="mx-10">
    <div className="font-bold mt-6 text-4xl">
      Users
    </div>
    <div className="my-2">
      <input onChange={(e)=>{
        setFilter(e.target.value);
      }} type="text" placeholder="Search users..." className="w-1/4 mb-5 px-2 py-1 border rounded border-slate-200" />
    </div>
    <div>
    {users.map(user => {
    if (user.username !== myname) {
    return <User user={user} />;
  }
  return null; // Skip rendering this user
})}
    </div>
  </div>
  </>
);
        
    
}

function User({user}) {
  const navigate=useNavigate()
  const [myname,setMyname]=useState('')

   axios.post('http://localhost:3000/api/v1/user/me',null,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then((e)=>{
    setMyname(e.data.username);
  })

  return <div className="flex justify-between my-3">
      <div className="flex">
          <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
              <div className="flex flex-col justify-center h-full text-xl">
                  {user.firstName[0]}
              </div>
          </div>
          <div className="flex flex-col justify-center h-ful">
              <div>
                  {user.firstName} {user.lastName}
              </div>
          </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <button className="bg-green-500 text-white p-3 mr-20 rounded-lg hover:bg-green-600 font-semibold" onClick={(e)=>{
          navigate("/transfer?id="+user._id+"&name="+user.firstName+" "+user.lastName+"&myname="+myname)
        }}>Send Money</button>
      </div>
  </div>
}