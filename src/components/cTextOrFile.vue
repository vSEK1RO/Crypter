<script setup>
import { computed, ref } from 'vue'
import { uploadFile } from '@/composables/uploadFile';
import { ElMessage } from 'element-plus';
import { toByteSize } from '@/composables/toByteSize';
import ReadFileWorker from '@/workers/readFile?worker'

const props = defineProps({
    textarea: {
        type: Boolean,
        default: false,
    },
    isMobile: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
    },
    limit: {
        type: Number,
        default: 2**30
    }
})
const model = defineModel()
const type = defineModel('type')
const name = defineModel('name')
const disabledModel = ref('')
const buffer = ref('')
const fileUploaded = ref(false)
const loading = ref(false)
const pc = ref(0)
const gap = computed(() => {
    return props.isMobile?'10px':'20px'
})

function uploadHandler(event){
    const worker = new ReadFileWorker()
    worker.onmessage = readFileWorkerHandler
    loading.value = true
    pc.value = 0
    worker.postMessage({
        file: event,
        size: props.limit
    })
}
function readFileWorkerHandler(event){
    if(event.data.status == 'loaded'){
        disabledModel.value = event.data.name
        buffer.value = model.value
        model.value = event.data.data
        type.value = 'file'
        name.value = event.data.name
        fileUploaded.value = true
        loading.value = false
    }else if(event.data.status == 'loading'){
        pc.value = Math.floor(event.data.data)
    }else if(event.data.status == 'sizeError'){
        ElMessage.error(event.data.data)
        loading.value = false
    }
}
function deleteHandler(){
    model.value = buffer.value
    type.value = 'text'
    name.value = ''
    fileUploaded.value = false
}
</script>

<template>
<div class="text-or-file-wrapper">
    <div style="
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    " v-if="loading">
        <el-progress :percentage="pc" :striped="true" :striped-flow="true" />
    </div>
    <div style="width: 100%" v-else>
        <el-input
        v-if="fileUploaded"
        :disabled="fileUploaded"
        :autosize="textarea"
        :type="textarea && !fileUploaded?'textarea':''"
        :placeholder="placeholder"
        v-model="disabledModel"
        ></el-input>
        <el-input
        v-else
        :disabled="fileUploaded"
        :autosize="textarea"
        :type="textarea && !fileUploaded?'textarea':''"
        :placeholder="placeholder"
        v-model="model"
        ></el-input>
    </div>
    <el-button
    v-if="fileUploaded"
    @click="deleteHandler"
    type="danger"
    >
        <el-icon><Close /></el-icon>
    </el-button>
    <el-button
    v-else
    :disabled="loading"
    @click="uploadFile(uploadHandler)"
    type="info"
    >
        <el-icon><Upload /></el-icon>
    </el-button>
</div>
</template>

<style scoped lang="scss">
.text-or-file-wrapper{
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: v-bind('gap');
}
</style>