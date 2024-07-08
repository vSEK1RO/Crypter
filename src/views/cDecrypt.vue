<script setup>
import { useKeys } from '@/stores/keys'
import { reactive, ref, onMounted } from 'vue'
import { ElMessage} from 'element-plus'
import { useRoute } from 'vue-router'
import forge from 'node-forge'
import { copyData } from '@/composables/copyData'
import { hideOverflow } from '@/composables/hideOverflow'
import { Message } from '@/composables/Message'

const isMobile = ref(window.outerWidth < 900)
const keys = useKeys()
const route = useRoute()
const drawer = reactive({
    isActive: false,
    media: '',
})
const form = reactive({
    passphrase: '',
    privatekey: '',
    encrypted: route.query.encryptedMsg,
})
const loading = ref(false)
async function decryptHandler(eventData){
    let flag=false
    if(form.passphrase==''){
        ElMessage.error({
            message: 'Passphrase must not be empty',
        })
        flag=true
        await sleep(1)
    }
    if(form.privatekey==''){
        ElMessage.error({
            message: 'Private key must not be empty',
        })
        flag=true
        await sleep(1)
    }
    if(form.encrypted==''){
        ElMessage.error({
            message: 'Encrypted message must not be empty',
        })
        flag=true
    }
    if(flag)return
    let message = new Message({
        encoded64: form.encrypted
    })
    try{
        message.decrypt(form.privatekey, forge.util.encodeUtf8(form.passphrase))
    }catch(error){
        ElMessage.error({message: error})
        return
    }
    drawer.media = message.data
    drawer.isActive = true
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function copyHandler(eventData){
    copyData(drawer.media, 'unnamed', 'decrypted msg')
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
            <h2>Decrypted message</h2>
        </template>
        <template #default>
            <div class="drawer-media-wrapper">
                <div class="drawer-media">
                    <el-text> 
                        {{ hideOverflow(drawer.media, 1024) }}
                    </el-text>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button
            type="danger"
            @click="copyHandler"
            >
                Copy to clipboard
            </el-button>
        </template>
    </el-drawer>
    <el-form>
        <el-form-item>
            <el-text>
                <h2>Decrypt message</h2>
            </el-text>
        </el-form-item>
        <el-form-item>
            <el-select
            autosize
            show-password
            v-model="form.privatekey"
            placeholder="private key"
            >
                <el-option
                v-for="item in keys.data"
                :key="item.name"
                :label="item.name"
                :value="item.priv"
                />
            </el-select>
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
            v-model="form.encrypted"
            placeholder="encrypted message"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button
            @click="decryptHandler"
            type="success"
            >
                Decrypt
            </el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped lang="scss">
</style>
