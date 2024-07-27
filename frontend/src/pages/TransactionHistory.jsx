import { useEffect, useState } from "react";
import axios from 'axios';
import { Heading } from "../components/Heading";
import { Link } from "react-router-dom";

export function TransactionHistory() {
    
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.post('http://localhost:3000/api/v1/account/history', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transaction history:', error);
            }
        };

        fetchHistory();
    }, []); // Empty dependency array to run only once when component mounts

    return (
        <>
        <div className="grid grid-flow-col grid-cols-2 w-3/4">
        <Link to={'/dashboard'} className="text-2xl my-3 mx-4 text-blue-600 mb-10" >{"<<"}Back</Link>
            <Heading label={"Transaction History"} /></div>
            {/* Render your transaction history */}
                {transactions.map(transaction => (
            <History history={transaction}/>
                ))}
        
        </>
    );
}

function History({history}){
    let color="text-green-500"
    let indicator="+"
    if(history.type=="Sent"){
        color="text-red-500"
        indicator="-"
    }
    return (
        
<div className="relative overflow-x-auto mt-3">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
                <th scope="col" className="px-6 py-3">
                    From
                </th>
                <th scope="col" className="px-6 py-3">
                    To
                </th>
                <th scope="col" className="px-6 py-3">
                    Date
                </th>
                <th scope="col" className="px-6 py-3">
                    Amount
                </th>
                <th scope="col" className="px-6 py-3">
                    Type
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                   {history.fromName}
                </th>
                <td className="px-6 py-4 font-medium">
                    {history.toName}
                </td>
                <td className="px-6 py-4">
                    {history.date.slice(0,10)}
                </td>
                <td className={`px-6 py-4 ${color} font-medium`}>
                    {indicator}{history.amount}
                </td>
                <td className={`px-6 py-4 ${color} font-medium`}>
                    {history.type}
                </td>
            </tr>
            
        </tbody>
    </table>
</div>

    )
}