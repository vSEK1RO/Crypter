<script setup>
import cAside from '@/components/cAside.vue'
import { useEncrypt } from '@/stores/encrypt'
import { reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage} from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import forge from 'node-forge'
import { toBinary } from '@/composables/toBinary'

const router = useRouter()
const route = useRoute()
const encrypt = useEncrypt()
const form = reactive({
    name: '',
    key: atob(route.query.publicKey || ""),
    message: '',
})
const loading = ref(false)
const drawer = reactive({
    isActive: false,
    name: '',
    media: '',
})
async function encryptHandler(eventData){
    let flag=false
    if(encrypt.msg.findIndex(msg=>msg.name==form.name)!=-1){
        ElMessage.error({
            title: 'Invalid input',
            message: 'Name already exists',
        })
        flag=true
        await sleep(1)
    }
    if(form.name==''){
        ElMessage.error({
            title: 'Invalid input',
            message: 'Name must not be empty',
        })
        flag=true
        await sleep(1)
    }
    if(form.key==''){
        ElMessage.error({
            title: 'Invalid input',
            message: 'Public key must not be empty',
        })
        flag=true
        await sleep(1)
    }
    if(form.message==''){
        ElMessage.error({
            title: 'Invalid input',
            message: 'Msg must not be empty',
        })
        flag=true
    }
    if(flag)return
    loading.value = true
    let encryptedMsg = btoa(forge.pki.publicKeyFromPem(form.key).encrypt(toBinary(form.message), 'RSA-OAEP'));
    loading.value = false
    let now = new Date()
    const hours = now.getUTCHours().toString().padStart(2,'0');
    const minutes = now.getUTCMinutes().toString().padStart(2,'0');
    const month = now.getMonth().toString().padStart(2,'0');
    const day = now.getDate().toString().padStart(2,'0');
    encrypt.msg.push({
        date: `${hours}:${minutes.toString().padStart(2,)} - ${day}.${month}`,
        name: form.name,
        enc: encryptedMsg,
    })
    encrypt.set()
    console.log(encryptedMsg)
    console.log(`"${form.name}" msg was encrypted`)
    
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function showHandler(eventData){
    let ind = encrypt.msg.findIndex(msg=>msg.name==eventData)
    drawer.isActive = true
    drawer.media = encrypt.msg[ind].enc
    drawer.name = encrypt.msg[ind].name
    console.log(`"${eventData}" encrypted msg was shown`)
}
function copyHandler(eventData){
    navigator.clipboard.writeText(drawer.media)
        .then(() => {
            ElMessage.success('Copied to clipboard')
        })
        .catch(err => {
            ElMessage.error('Error during copying')
        });
    console.log(`"${drawer.name}" encrypted msg was copied`)
}
function shareHandler(eventData, request){
    let ind = encrypt.msg.findIndex(msg=>msg.name==eventData)
    if(request=='click'){
        let protocol = window.location.protocol
        let hostname = window.location.hostname
        let port = window.location.port
        if(port==''){
            port='443'
        }
        let {href} = router.resolve({path: 'decrypt', query: {encryptedMsg: encrypt.msg[ind].enc}})
        navigator.clipboard.writeText(`${protocol}//${hostname}:${port}${href}`)
            .then(() => {
                ElMessage.success('Copied to clipboard')
            })
            .catch(err => {
                ElMessage.error('Error during copying')
            });
        console.log(`link to "${drawer.name}" encrypted msg was copied`)
    }else if(request=='cancel'){
        console.log(`redirect to "${eventData}" encrypted msg cancelled`)
    }else if(request=='confirm'){
        router.push({path: 'decrypt', query: {encryptedMsg: encrypt.msg[ind].enc}})
        console.log(`redirect to "${eventData}" encrypted msg confirmed`)
    }
    
}
function deleteHandler(eventData){
    let ind = encrypt.msg.findIndex(msg=>msg.name==eventData)
    ElMessageBox.confirm(`Are you sure to delete msg "${eventData}"?`)
        .then(()=>{
            encrypt.msg.splice(ind,1)
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
</script>

<template>
<el-container>
    <el-aside>
        <cAside></cAside>
    </el-aside>
    <el-main>
        <el-drawer
        size="50%"
        v-model="drawer.isActive"
        >
            <template #header>
                <h2>Copy and share encrypted message</h2>
            </template>
            <template #default>
                <div class="drawer-media">
                    <el-text> 
                        {{ drawer.media }}
                    </el-text>
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
                <el-input
                autosize
                type="textarea"
                v-model="form.key"
                placeholder="public key"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                autosize
                type="textarea"
                v-model="form.message"
                placeholder="message"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                @click="encryptHandler"
                type="success"
                >
                    Encrypt
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-table
                v-if="encrypt.msg.length!=0"
                :data="encrypt.msg"
                v-loading="loading"
                >  
                    <el-table-column
                    label="Date"
                    prop="date"
                    >
                    
                    </el-table-column>
                    <el-table-column
                    label="Name"
                    prop="name"
                    >
                        <template #default="scope">
                            <el-tag><h2>{{ scope.row.name }}</h2></el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                    align="right"
                    label="Operations"
                    >
                        <template #default="scope">
                            <el-button
                            size="small"
                            type="info"
                            @click="showHandler(scope.row.name)"
                            >
                                Show
                            </el-button>
                            <el-popconfirm
                            width="220"
                            confirm-button-text="Yes"
                            cancel-button-text="No"
                            @cancel="shareHandler(scope.row.name, 'cancel')"
                            @confirm="shareHandler(scope.row.name, 'confirm')"
                            title="Link copied. Do you want to be redirected?"
                            >
                                <template #reference>
                                    <el-button
                                    size="small"
                                    type="success"
                                    @click="shareHandler(scope.row.name, 'click')"
                                    >
                                        Share
                                    </el-button>
                                </template>
                            </el-popconfirm>
                            <el-button
                            size="small"
                            type="danger"
                            @click="deleteHandler(scope.row.name)"
                            >
                                Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </el-main>
</el-container>
</template>

<style scoped lang="scss">
.el-container{
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
}
.el-aside{
    top: 35%;
    left: 44px;
    position: fixed;
    z-index: 10;
}
.el-main{
    max-width: 800px;
}
.el-form, .drawer-media{
    padding: 16px;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
}
.el-form{
    border-radius: var(--el-border-radius-round);
    box-shadow: var(--el-box-shadow);
}
.drawer-media{
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-light);
}
.el-table{
    max-width: 100%;
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-bg-color);
}   
</style>
