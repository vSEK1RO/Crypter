<script setup>
import cAside from '@/components/cAside.vue'
</script>

<template>
<RouterView></RouterView>
<cAside></cAside>
</template>

<style scoped lang="scss">
.c-aside {
    @media screen and (min-width: 871px) {
        position: fixed;
        left: 10%;
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
