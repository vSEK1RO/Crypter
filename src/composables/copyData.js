import { ElMessage } from "element-plus"

export function copyData(data){
    try{
        navigator.clipboard.writeText(data)
    }catch(error){
        ElMessage.error('Error during copying')
        ElMessage.info('Should manually copy')
        return
    }
    ElMessage.success('Copied to clipboard')
}