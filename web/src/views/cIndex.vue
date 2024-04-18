<script setup>
import cAside from '@/components/cAside.vue'
</script>

<template>
<el-container>
    <el-aside>
        <cAside></cAside>
    </el-aside>
    <el-main>
        <el-text>
            <h1 class="title">Crypter</h1>
            <p class="sub-title">An easy way to share encrypted messages</p>
            <a href="https://github.com/vSEK1RO/Crypter" class="sub-title">Github</a>
        </el-text>
    </el-main>
</el-container>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
.title{
    font-size: 64px;
    font-family: "Pacifico", cursive;
    font-weight: 400;
    font-style: italic;
}
.sub-title{
    font-size: 18px;
    color: #CFD3DC;
}
.el-container{
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
}
.el-aside{
    top: 35%;
    left: 44px;
    position: fixed;
    z-index: 10;
}
.el-main{
    max-width: 800px;
    padding: 16px;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
    border-radius: var(--el-border-radius-round);
    box-shadow: var(--el-box-shadow);
}
</style>