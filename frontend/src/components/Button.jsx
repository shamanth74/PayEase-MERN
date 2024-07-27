import { Link } from "react-router-dom"

export function Button({label,onclick,to}){
    return(
        <>
        <Link to={to}>
        <button onClick={onclick} className="text-white w-3/4 bg-gray-800 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 my-3">{label}</button>
        </Link>
        </>
    )
}