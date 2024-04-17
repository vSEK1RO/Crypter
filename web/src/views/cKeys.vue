<script setup>
import cAside from '@/components/cAside.vue'
import { useKeys } from '@/stores/keys'
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage} from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import forge from 'node-forge'

const route = useRoute()
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
    media: '',
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
    if(form.passphrase.length<8){
        ElMessage.error({
            title: 'Invalid input',
            message: 'Passphrases must be longer than 8 characters',
        })
        flag=true
    }
    if(flag)return
    loading.value = true
    let publickey = ''
    new Promise((resolve, reject)=>{
        forge.pki.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
            loading.value = false
            if (err) {
                reject(err)
            }else{
                resolve(keypair)
            }
        })
    }).then(keypair=>{
        publickey = forge.pki.publicKeyToPem(keypair.publicKey)
        let now = new Date()
        const hours = now.getUTCHours().toString().padStart(2,'0');
        const minutes = now.getUTCMinutes().toString().padStart(2,'0');
        const month = now.getMonth().toString().padStart(2,'0');
        const day = now.getDate().toString().padStart(2,'0');
        keys.pub.push({
            date: `${hours}:${minutes.toString().padStart(2,)} - ${day}.${month}`,
            name: form.name,
            key: publickey,
        })
        console.log(publickey)
        console.log(`"${form.name}" public key was created`)
    }).catch(err=>{
        ElMessage.error({
            title: 'Key generation error',
            message: `${err}`
        });
    })
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function showHandler(eventData){
    let ind = keys.pub.findIndex(key=>key.name==eventData)
    drawer.isActive = true
    drawer.media = keys.pub[ind].key
    drawer.name = keys.pub[ind].name
    console.log(`"${eventData}" public key was shown`)
}
function copyHandler(eventData){
    navigator.clipboard.writeText(drawer.media)
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
        let {href} = router.resolve({path: 'encrypt', query: {publicKey: keys.pub[ind].key}})
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
        router.push({path: 'encrypt', query: {publicKey: keys.pub[ind].key}})
        console.log(`redirect to "${eventData}" public key confirmed`)
    }
    
}
function deleteHandler(eventData){
    let ind = keys.pub.findIndex(key=>key.name==eventData)
    ElMessageBox.confirm(`Are you sure to delete key "${eventData}"?`)
        .then(()=>{
            keys.pub.splice(ind,1)
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
</script>

<template>
<el-container class="c-keys">
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
                <div class="public-key-media">
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
                    <h2>Generate public key</h2>
                </el-text>
            </el-form-item>
            <el-form-item>
                <el-input
                v-model="form.name"
                placeholder="public key name"
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
.c-keys{
    padding-top: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
}
.el-aside{
    top: 260px;
    left: 44px;
    position: absolute;
    z-index: 10;
}
.el-main{
    max-width: 800px;
}
.el-form, .public-key-media{
    padding: 16px;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
}
.el-form{
    border-radius: var(--el-border-radius-round);
    box-shadow: var(--el-box-shadow);
}
.public-key-media{
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
