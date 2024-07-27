

export function Heading({label,success}){
    return(
        <>
        <div className={`text-center text-5xl font-medium ${success}`}>{label}</div>
        </>
    )
}