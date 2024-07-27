import { Link } from "react-router-dom"

export function BottomText({content,buttonText,to}) {
    return(
        <>
        <div className="text-lg my-3 text-slate-500">
            {content}
        <Link className="pointer underline pl-1 cursor-pointer text-blue-500" to={to}>
        {buttonText}
        </Link>    
        </div>
        </>
    )
}