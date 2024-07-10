<script setup>
import { computed, ref } from 'vue'
import { uploadFile } from '@/composables/uploadFile';
import { ElMessage } from 'element-plus';
import { toByteSize } from '@/composables/toByteSize';

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
        default: 4*2**20
    }
})
const model = defineModel()
const type = defineModel('type')
const name = defineModel('name')
const disabledModel = ref('')
const buffer = ref('')
const fileUploaded = ref(false)
const gap = computed(() => {
    return props.isMobile?'10px':'20px'
})

function uploadHandler(eventData){
    if(eventData.size>props.limit){
        ElMessage.error({message: `File is larger than ${toByteSize(props.limit)}`})
        return
    }
    const reader = new FileReader()
    reader.onload = () => {
        disabledModel.value = eventData.name
        buffer.value = model.value
        model.value = reader.result
        type.value = 'file'
        name.value = eventData.name
        fileUploaded.value = true
    }
    reader.readAsText(eventData)
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
    <el-button
    v-if="!fileUploaded"
    @click="uploadFile(uploadHandler)"
    type="info"
    >
        <el-icon><Upload /></el-icon>
    </el-button>
    <el-button
    v-if="fileUploaded"
    @click="deleteHandler"
    type="danger"
    >
        <el-icon><Close /></el-icon>
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