<script setup>
import {ref} from 'vue'

const isCollapsed = ref(true)

</script>

<template>
<el-menu
    class="c-aside"
    mode="vertical"
    :collapse="isCollapsed"
    router
    @mouseover="isCollapsed=false"
    @mouseleave="isCollapsed=true"
>
    <el-menu-item index="/">
        <el-icon><message/></el-icon>
        <el-text>Crypter</el-text>
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
.c-aside{
    position: absolute;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-round);
    box-shadow: var(--el-box-shadow);
}
</style>