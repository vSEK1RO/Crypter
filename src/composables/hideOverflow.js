export function hideOverflow(str, length){
    if(str.length > length){
        return str.slice(0,length) + ` ... total length: ${str.length}`
    }else{
        return str
    }
}