<script setup>
import cAside from '@/components/cAside.vue'
import { useKeys } from '@/stores/keys'
import { reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage} from 'element-plus'
import { useRouter } from 'vue-router'
import forge from 'node-forge'
import { toBinary } from '@/composables/toBinary'

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
            title: 'Invalid input',
            message: 'Passphrases do not match',
        })
        flag=true
        await sleep(1)
    }
    if(keys.pub.findIndex(key=>key.name==form.name)!=-1){
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
    if(flag)return
    loading.value = true
    let rsaKeyPair = forge.pki.rsa.generateKeyPair({bits: 1024})
    let privateKey = forge.pki.encryptRsaPrivateKey(rsaKeyPair.privateKey, toBinary(form.passphrase))
    let publicKey = forge.pki.publicKeyToPem(rsaKeyPair.publicKey)
    console.log(privateKey) 
    loading.value = false
    let now = new Date()
    const hours = now.getUTCHours().toString().padStart(2,'0');
    const minutes = now.getUTCMinutes().toString().padStart(2,'0');
    const month = now.getMonth().toString().padStart(2,'0');
    const day = now.getDate().toString().padStart(2,'0');
    keys.pub.push({
        date: `${hours}:${minutes.toString().padStart(2,)} - ${day}.${month}`,
        name: form.name,
        key: publicKey,
        priv: privateKey,
    })
    keys.set()
    console.log(publicKey)
    console.log(`"${form.name}" public key was created`)
        
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function showHandler(eventData){
    let ind = keys.pub.findIndex(key=>key.name==eventData)
    drawer.isActive = true
    drawer.pub = keys.pub[ind].key
    drawer.priv = keys.pub[ind].priv
    drawer.name = keys.pub[ind].name
    console.log(`"${eventData}" public key was shown`)
}
function copyHandler(eventData){
    navigator.clipboard.writeText(drawer.pub)
        .then(() => {
            ElMessage.success('Copied to clipboard')
        })
        .catch(err => {
            ElMessage.error('Error during copying')
        });
    console.log(`"${drawer.name}" public key was copied`)
}
function copyPrivateHandler(eventData){
    navigator.clipboard.writeText(drawer.priv)
        .then(() => {
            ElMessage.success('Copied to clipboard')
        })
        .catch(err => {
            ElMessage.error('Error during copying')
        });
    console.log(`"${drawer.name}" public key was copied`)
}
function shareHandler(eventData, request){
    let ind = keys.pub.findIndex(key=>key.name==eventData)
    if(request=='click'){
        let protocol = window.location.protocol
        let hostname = window.location.hostname
        let port = window.location.port
        if(port==''){
            port='443'
        }
        let {href} = router.resolve({path: 'encrypt', query: {publicKey: btoa(keys.pub[ind].key)}})
        navigator.clipboard.writeText(`${protocol}//${hostname}:${port}${href}`)
            .then(() => {
                ElMessage.success('Copied to clipboard')
            })
            .catch(err => {
                ElMessage.error('Error during copying')
            });
        console.log(`link to "${drawer.name}" public key was copied`)
    }else if(request=='cancel'){
        console.log(`redirect to "${eventData}" public key cancelled`)
    }else if(request=='confirm'){
        router.push({path: 'encrypt', query: {publicKey: btoa(keys.pub[ind].key)}})
        console.log(`redirect to "${eventData}" public key confirmed`)
    }
    
}
function deleteHandler(eventData){
    let ind = keys.pub.findIndex(key=>key.name==eventData)
    ElMessageBox.confirm(`Are you sure to delete key "${eventData}"?`)
        .then(()=>{
            keys.pub.splice(ind,1)
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

onMounted(() => {
    keys.get()
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
                <h2>Copy and share public key</h2>
            </template>
            <template #default>
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
            </template>
            <template #footer>
                <el-button
                type="success"
                @click="copyHandler"
                >
                    Copy public to clipboard
                </el-button>
                <el-button
                type="danger"
                @click="copyPrivateHandler"
                >
                    Copy private to clipboard
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
            </el-form-item>
            <el-form-item>
                <el-table
                v-if="keys.pub.length!=0"
                :data="keys.pub"
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
