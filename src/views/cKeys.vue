<script setup>
import { useKeys } from '@/stores/keys'
import { reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage} from 'element-plus'
import { useRouter } from 'vue-router'
import forge from 'node-forge'
import { toBinary } from '@/composables/toBinary'
import cTable from '@/components/cTable.vue'

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
        navigator.clipboard.writeText(`${protocol}//${hostname}:${port}${import.meta.env.BASE_URL}${href}`)
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
        </el-form-item>
        <el-form-item v-if="keys.pub.length!=0">
            <cTable
            :data="keys.pub"
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
