import { ElMessage } from "element-plus"

export function copyLink(link, name, msg){
    if(link.length > 2048){
        ElMessage.error('Link limit 2048 characters was exceeded')
        ElMessage.info('Should manually copy')
    }else{
        try{
            navigator.clipboard.writeText(link)
        }catch(error){
            ElMessage.error('Error during copying')
            ElMessage.info('Should manually copy')
            return
        }
        ElMessage.success('Copied to clipboard')
        console.log(`link to "${name}" ${msg} was copied`)
    }
}