<script setup>
import cAside from '@/components/cAside.vue'
import { reactive, ref } from 'vue'
import { ElMessage} from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()
const drawer = reactive({
    isActive: false,
    media: '',
})
const form = reactive({
    passphrase: '',
    encrypted: route.query.encryptedMsg,
})
const loading = ref(false)
async function decryptHandler(eventData){
    let flag=false
    if(form.passphrase==''){
        ElMessage.error({
            title: 'Invalid input',
            message: 'Passphrase must not be empty',
        })
        flag=true
        await sleep(1)
    }
    if(form.encrypted==''){
        ElMessage.error({
            title: 'Invalid input',
            message: 'Encrypted message must not be empty',
        })
        flag=true
    }
    if(flag)return
    loading.value = true
    //todo
    loading.value = false
    drawer.media = decryptedMsg
    drawer.isActive = true
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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
                <h2>Decrypted message</h2>
            </template>
            <template #default>
                <div class="drawer-media">
                    <el-text> 
                        {{ drawer.media }}
                    </el-text>
                </div>
            </template>
        </el-drawer>
        <el-form>
            <el-form-item>
                <el-text>
                    <h2>Decrypt message</h2>
                </el-text>
            </el-form-item>
            <el-form-item>
                <el-input
                autosize
                show-password
                v-model="form.passphrase"
                placeholder="passphrase"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input
                autosize
                type="textarea"
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
    top: 260px;
    left: 44px;
    position: fixed;
    z-index: 10;
}
.el-main{
    max-width: 800px;
}
.el-form{
    padding: 16px;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
}
.el-form{
    border-radius: var(--el-border-radius-round);
    box-shadow: var(--el-box-shadow);
}
</style>
