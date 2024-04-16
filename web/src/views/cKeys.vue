<script setup>
import cAside from '@/components/cAside.vue'
import { useKeys } from '@/stores/keys';
import { reactive } from 'vue'
import { ElNotification } from 'element-plus'

const keys = useKeys()
const form = reactive({
    name: '',
    passphrase: '',
    rpassphrase: '',
})
async function submitHandler(eventData){
    let flag=false
    if(form.passphrase!=form.rpassphrase){
        ElNotification.error({
            title: 'Invalid input',
            message: 'Passphrases do not match',
        })
        flag=true
        await sleep(1)
    }
    if(keys.pub.findIndex(key=>key.name==form.name)!=-1){
        ElNotification.error({
            title: 'Invalid input',
            message: 'Name already exists',
        })
        flag=true
        await sleep(1)
    }
    if(form.name==''){
        ElNotification.error({
            title: 'Invalid input',
            message: 'Name must not be empty',
        })
        flag=true
        await sleep(1)
    }
    if(form.passphrase.length<8){
        ElNotification.error({
            title: 'Invalid input',
            message: 'Passphrases must be longer than 8 characters',
        })
        flag=true
    }
    if(flag)return
    let now = new Date()
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const month = now.getMonth();
    const day = now.getDate();
    keys.pub.push({
        date: `${hours}:${minutes} - ${day}.${month}`,
        name: form.name,
        key: "test",
    })
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function shareHandler(eventData){

}
function deleteHandler(eventData){

}
</script>

<template>
<el-container class="c-encrypt">
    <el-aside>
        <cAside></cAside>
    </el-aside>
    <el-main>
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
                            <el-tag>{{ scope.row.name }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="Operations"
                    >
                        <template #default="scope">
                            <el-button
                            size="small"
                            type="success"
                            @click="shareHandler(scope.row.name)"
                            >
                                Share
                            </el-button>
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
.el-form{
    padding: 16px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-round);
    box-shadow: var(--el-box-shadow);
    background-color: var(--el-bg-color);
}
.el-table{
    max-width: 100%;
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-bg-color);
}   

</style>
