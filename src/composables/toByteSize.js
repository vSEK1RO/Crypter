const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

export function toByteSize(number){
    let i = 0;
    let n = parseInt(number,10) || 0;
    while(n >= 1024 && ++i){
        n/=1024
    }
    return n.toFixed(n<10 && i>0?1:0) + ' ' + units[i];
}