<script setup>
import { computed, ref } from 'vue' 

const isCollapsed = ref(true)
const isMobile = ref(window.outerWidth < 900)
const mode = computed(() => {
    return isMobile.value?`horizontal`:`vertical`
})
const collapse = computed(() => {
    return isCollapsed.value && !isMobile.value
})

addEventListener('resize', () => {
    isMobile.value = window.outerWidth < 900
})
</script>

<template>
<el-menu
    class="c-aside"
    :mode="mode"
    :collapse="collapse"
    :ellipsis="false"
    router
    :default-active="`/`+$route.name"
    @mouseover="isCollapsed=false"
    @mouseleave="isCollapsed=true"
    style="justify-content: center;"
>
    <el-menu-item index="/">
        <el-icon><message/></el-icon>
        <el-text v-if="!isMobile">Crypter</el-text>
    </el-menu-item>
    <el-menu-item index="/keys">
        <el-icon><key/></el-icon>
        <el-text>Keys</el-text>
    </el-menu-item>
    <el-menu-item index="/encrypt">
        <el-icon><lock/></el-icon>
        <el-text>Encrypt</el-text>
    </el-menu-item>
    <el-menu-item index="/decrypt">
        <el-icon><unlock/></el-icon>
        <el-text>Decrypt</el-text>
    </el-menu-item>
</el-menu>
</template>

<style scoped lang="scss">
    .el-menu {
        user-select: none;
        border-radius: var(--el-border-radius-round);
        box-shadow: var(--el-box-shadow);
    }
</style>