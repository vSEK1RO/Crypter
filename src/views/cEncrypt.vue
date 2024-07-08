<script setup>
import { useEncrypt } from '@/stores/encrypt'
import { reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage} from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import forge from 'node-forge'
import cTable from '@/components/cTable.vue'
import cTextOrFile from '@/components/cTextOrFile.vue'
import { copyLink } from '@/composables/copyLink'
import { copyData } from '@/composables/copyData'
import { saveFile } from '@/composables/saveFile'
import { hideOverflow } from '@/composables/hideOverflow'
import { Message } from '@/composables/Message'

const isMobile = ref(window.outerWidth < 900)
const router = useRouter()
const route = useRoute()
const encrypt = useEncrypt()
const form = reactive({
    name: '',
    key: forge.util.decode64(route.query.publicKey || ''),
    message: '',
    type: 'text',
    fileName: '',
})
const loading = ref(false)
const drawer = reactive({
    isActive: false,
    name: '',
    raw: '',
    enc: '',
    pub: '',
})
async function encryptHandler(eventData){
    let flag=false
    if(encrypt.data.findIndex(msg=>msg.name==form.name)!=-1){
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
    if(form.key==''){
        ElMessage.error({
            message: 'Public key must not be empty',
        })
        flag=true
        await sleep(1)
    }
    if(form.message==''){
        ElMessage.error({
            message: 'Msg must not be empty',
        })
        flag=true
    }
    if(flag)return
    let message = new Message({
        data: form.message,
        name: form.type == 'file'?form.fileName:form.name,
        type: form.type,
    })
    try{
        message.encrypt(form.key)
    }catch(error){
        ElMessage.error({message: error})
        return
    }
    let now = new Date()
    encrypt.data.unshift({
        date: now,
        name: form.name.trim(),
        enc: message.encode64(),
        raw: form.message,
        pub: form.key.trim(),
    })
    encrypt.set()
    console.log(`"${message.name}" msg was encrypted`)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function showHandler(eventData){
    let ind = encrypt.data.findIndex(msg=>msg.name==eventData)
    drawer.isActive = true
    drawer.name = encrypt.data[ind].name
    drawer.enc = encrypt.data[ind].enc
    drawer.raw = encrypt.data[ind].raw
    drawer.pub = encrypt.data[ind].pub
    console.log(`"${eventData}" encrypted msg was shown`)
}
function copyHandler(eventData){
    copyData(drawer.enc, drawer.name, 'encrypted msg')
}
function shareHandler(eventData, request){
    let ind = encrypt.data.findIndex(msg=>msg.name==eventData)
    if(request=='click'){
        let protocol = window.location.protocol
        let hostname = window.location.hostname
        let port = window.location.port
        if(port==''){
            port='443'
        }
        let {href} = router.resolve({path: 'decrypt', query: {encryptedMsg: encrypt.data[ind].enc}})
        let link = `${protocol}//${hostname}:${port}${import.meta.env.BASE_URL}${href}`
        copyLink(link, eventData, 'encrypted msg')
    }else if(request=='cancel'){
        console.log(`download "${eventData}" encrypted msg cancelled`)
    }else if(request=='confirm'){
        saveFile(`${eventData}.enc`, encrypt.data[ind].enc)
        console.log(`download "${eventData}" encrypted msg confirmed`)
    }
    
}
function deleteHandler(eventData){
    let ind = encrypt.data.findIndex(msg=>msg.name==eventData)
    ElMessageBox.confirm(`Are you sure to delete msg "${eventData}"?`)
        .then(()=>{
            encrypt.data.splice(ind,1)
            encrypt.set()
            console.log(`"${eventData}" encrypted msg was deleted`)
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

onMounted(() => {
    encrypt.get()
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
            <h2>Copy and share encrypted message</h2>
        </template>
        <template #default>
            <div class="drawer-media-wrapper">
                <div class="drawer-media">
                    <el-text> 
                        <h3>Raw</h3>
                        {{ hideOverflow(drawer.raw, 1024) }}
                    </el-text>
                </div>
                <div class="drawer-media">
                    <el-text> 
                        <h3>Encrypted</h3>
                        {{ hideOverflow(drawer.enc, 1024) }}
                    </el-text>
                </div>
                <div class="drawer-media">
                    <el-text> 
                        <h3>Public key</h3>
                        {{ hideOverflow(drawer.pub, 1024) }}
                    </el-text>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button
            type="success"
            @click="copyHandler"
            >
                Copy to clipboard
            </el-button>
        </template>
    </el-drawer>
    <el-form>
        <el-form-item>
            <el-text>
                <h2>Encrypt message</h2>
            </el-text>
        </el-form-item>
        <el-form-item>
            <el-input
            v-model="form.name"
            placeholder="message name"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <cTextOrFile
            :is-mobile="isMobile"
            :textarea="true"
            :limit="2**20"
            placeholder="message"
            v-model:type="form.type"
            v-model:name="form.fileName"
            v-model="form.message"
            />
        </el-form-item>
        <el-form-item>
            <cTextOrFile
            :is-mobile="isMobile"
            placeholder="public key"
            v-model="form.key"
            />
        </el-form-item>
        <el-form-item>
            <el-button
            @click="encryptHandler"
            type="success"
            >
                Encrypt
            </el-button>
        </el-form-item>
        <el-form-item v-if="encrypt.data.length!=0">
            <cTable
            :data="encrypt.data"
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
