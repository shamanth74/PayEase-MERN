
export function InputBox({label,type,onchange,value,disabled}){
    return(
        <>
        <label className="text-sm font-medium text-left py-2">{label}</label><br />
        <input type={type} value={value} onChange={onchange} required className="w-3/4 px-2 py-1 border rounded border-slate-400" disabled={disabled}/><br /><br />
        </>

    )
}