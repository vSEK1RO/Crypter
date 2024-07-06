<script setup>
import { useKeys } from '@/stores/keys'
import { reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage} from 'element-plus'
import { useRouter } from 'vue-router'
import forge from 'node-forge'
import cTable from '@/components/cTable.vue'
import { saveFile } from '@/composables/saveFile'
import { uploadFile } from '@/composables/uploadFile'
import { copyData } from '@/composables/copyData'
import { copyLink } from '@/composables/copyLink'

const isMobile = ref(window.outerWidth < 900)
const router = useRouter()
const keys = useKeys()
const form = reactive({
    name: '',
    passphrase: '',
    rpassphrase: '',
})
const loading = ref(false)
const drawer = reactive({
    isActive: false,
    name: '',
    pub: '',
    priv: '',
})
async function submitHandler(eventData){
    let flag=false
    if(form.passphrase!=form.rpassphrase){
        ElMessage.error({
            message: 'Passphrases do not match',
        })
        flag=true
        await sleep(1)
    }
    if(keys.data.findIndex(key=>key.name==form.name)!=-1){
        ElMessage.error({
            message: 'Name already exists',
        })
        flag=true
        await sleep(1)
    }
    if(form.name==''){
        ElMessage.error({
            message: 'Name must not be empty',
        })
        flag=true
        await sleep(1)
    }
    if(flag)return
    let rsaKeyPair = forge.pki.rsa.generateKeyPair({bits: 1024})
    let privateKey = forge.pki.encryptRsaPrivateKey(rsaKeyPair.privateKey, forge.util.encodeUtf8(form.passphrase))
    let publicKey = forge.pki.publicKeyToPem(rsaKeyPair.publicKey)
    let now = new Date()
    keys.data.unshift({
        date: now,
        name: form.name.trim(),
        pub: publicKey.trim(),
        priv: privateKey.trim(),
    })
    keys.set()
    console.log(`"${form.name}" keypair was created`)
        
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function showHandler(eventData){
    let ind = keys.data.findIndex(key=>key.name==eventData)
    drawer.isActive = true
    drawer.pub = keys.data[ind].pub
    drawer.priv = keys.data[ind].priv
    drawer.name = keys.data[ind].name
    console.log(`"${eventData}" public key was shown`)
}
function copyHandler(eventData){
    copyData(drawer.pub, drawer.name, 'public key')
}
function copyPrivateHandler(eventData){
    copyData(drawer.priv, drawer.name, 'private key')
}
function shareHandler(eventData, request){
    let ind = keys.data.findIndex(key=>key.name==eventData)
    if(request=='click'){
        let protocol = window.location.protocol
        let hostname = window.location.hostname
        let port = window.location.port
        if(port==''){
            port='443'
        }
        let {href} = router.resolve({path: 'encrypt', query: {publicKey: forge.util.encode64(keys.data[ind].pub)}})
        let link = `${protocol}//${hostname}:${port}${import.meta.env.BASE_URL}${href}`
        copyLink(link, drawer.name, 'public key')
    }else if(request=='cancel'){
        console.log(`redirect to "${eventData}" public key cancelled`)
    }else if(request=='confirm'){
        router.push({path: 'encrypt', query: {publicKey: forge.util.encode64(keys.data[ind].pub)}})
        console.log(`redirect to "${eventData}" public key confirmed`)
    }
    
}
function deleteHandler(eventData){
    let ind = keys.data.findIndex(key=>key.name==eventData)
    ElMessageBox.confirm(`Are you sure to delete key "${eventData}"?`)
        .then(()=>{
            keys.data.splice(ind,1)
            keys.set()
            console.log(`"${eventData}" public key was deleted`)
        })
        .catch((err)=>{
            if(err!='cancel'){
                ElNotification.error({
                    title: 'Error',
                    message: `deleteHandler(${eventData})\n`,
                })
            }   
        })
}
function exportHandler(){
    saveFile('keys.json',JSON.stringify(keys.data))
    console.log(`keys were exported to "keys.json"`)
}
function importHandler(eventData){
    if(eventData.size>4*2**20){
        ElMessage.error({message: 'File is larger than 4MB'})
        return
    }
    const reader = new FileReader()
    reader.onload = () => {
        let obj = {}
        try{
            obj = JSON.parse(reader.result)
        }catch(error){
            ElMessage.error({message: "File isn't JSON"})
            return
        }
        if(!Array.isArray(obj)){
            ElMessage.error({message: "Incorrect JSON format: isn't array"})
            return
        }
        let flag = false
        obj.forEach(element => {
            if(element.hasOwnProperty('date') &&
                element.hasOwnProperty('name') &&
                element.hasOwnProperty('pub') &&
                element.hasOwnProperty('priv'))
            {
                if(keys.data.find(innerEl => {
                    return innerEl.date === element.date &&
                        innerEl.pub === element.pub &&
                        innerEl.priv === element.priv;
                }) === undefined){
                    flag = true
                    let buffer = {}
                    if(keys.data.find(innerEl => innerEl.name == element.name) === undefined){
                        buffer.name = element.name
                    }else{
                        let addNumber = 2;
                        while(buffer.name === undefined){
                            if(keys.data.find(innerEl => innerEl.name === element.name + `_${addNumber}`) === undefined){
                                buffer.name = element.name + `_${addNumber}`
                            }
                            addNumber++
                        }
                    }
                    buffer.date = element.date
                    buffer.pub = element.pub
                    buffer.priv = element.priv
                    let ind = 0
                    while(keys.data[ind] != undefined && keys.data[ind]?.date > buffer.date){
                        ind++
                    }
                    keys.data.splice(ind,0,buffer)
                }
            }
        })
        if(!flag){
            ElMessage({message: "Nothing has been added"})
        }else{
            keys.set()
            console.log(`some keys were imported from "${eventData.name}"`)
        }
    }
    reader.readAsText(eventData)
}

onMounted(() => {
    keys.get()
})
addEventListener('resize', () => {
    isMobile.value = window.outerWidth < 900
})
</script>

<template>
    <el-drawer
    :size="isMobile?`100%`:`50%`"
    v-model="drawer.isActive"
    >
        <template #header>
            <h2>Copy and share public key</h2>
        </template>
        <template #default>
            <div class="drawer-media-wrapper">
                <div class="drawer-media">
                    <el-text> 
                        {{ drawer.pub }}
                    </el-text>
                </div>
                <div class="drawer-media">
                    <el-text> 
                        {{ drawer.priv }}   
                    </el-text>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button
            type="success"
            @click="copyHandler"
            >
                Copy public
            </el-button>
            <el-button
            type="danger"
            @click="copyPrivateHandler"
            >
                Copy private
            </el-button>
        </template>
    </el-drawer>
    <el-form>
        <el-form-item>
            <el-text>
                <h2>Generate keypair</h2>
            </el-text>
        </el-form-item>
        <el-form-item>
            <el-input
            v-model="form.name"
            placeholder="keypair name"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-input
            show-password
            v-model="form.passphrase"
            placeholder="passphrase"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-input
            show-password
            v-model="form.rpassphrase"
            placeholder="repeat passphrase"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button
            @click="submitHandler"
            type="success"
            >
                Submit
            </el-button>
            <el-button
            @click="exportHandler"
            >
                Export
            </el-button>
            <el-button
            @click="uploadFile(importHandler)"
            >
                Import
            </el-button>
        </el-form-item>
        <el-form-item v-if="keys.data.length!=0">
            <cTable
            :data="keys.data"
            :loading="loading"
            :is-mobile="isMobile"
            @show="showHandler"
            @share="shareHandler"
            @delete="deleteHandler"
            />
        </el-form-item>
    </el-form>
</template>

<style scoped lang="scss">
</style>
