<script setup>
import cAside from '@/components/cAside.vue'
</script>

<template>
    <main>
        <div class="router-view">
            <RouterView></RouterView>
        </div>
    </main>
    <cAside></cAside>
</template>

<style scoped lang="scss">
main {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.router-view {
    @media screen and (min-width: 871px) {
        width: 700px;
        margin: 10px 0px;
    }
    @media screen and (max-width: 870px) {
        width: 95%;
        margin: 10px 0px 80px 0px;
    }
}
.c-aside {
    z-index: 10;
    @media screen and (min-width: 871px) {
        position: fixed;
        left: 40px;
        top: 50%;
        transform: translate(0%, -50%);
    }
    @media screen and (max-width: 870px) {
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translate(-50%, 0%);
    }
}
</style>
