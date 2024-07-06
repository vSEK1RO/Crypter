import { ElMessage } from "element-plus"

export function copyData(data, name, msg){
    try{
        navigator.clipboard.writeText(data)
    }catch(error){
        ElMessage.error('Error during copying')
        ElMessage.info('Should manually copy')
        return
    }
    ElMessage.success('Copied to clipboard')
    console.log(`"${name}" ${msg} was copied`)
}