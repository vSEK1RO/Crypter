<script setup>
import { Message } from '@/composables/Message';
import { computed, ref } from 'vue'

const props = defineProps({
    data: {
        type: Message,
    },
})
const model = defineModel()

</script>

<template>
<div class="result-wrapper">
    <div style="
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
    ">
        <slot name="icon"></slot>
        <el-text v-if="data.type == 'text'">
            Your message
        </el-text>
        <el-text v-else>
            File '{{ data.name }}'
        </el-text>
        <slot name="message">

        </slot>
    </div>
    <el-button>

    </el-button>
    <el-button>
        
    </el-button>
</div>
</template>

<style scoped lang="scss">
.result-wrapper{
    width: 100%;
    display: flex;
    flex-direction: row;
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-bg-color);
    padding: 10px;
}
</style>