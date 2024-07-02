import { defineStore } from 'pinia'

export const useKeys = defineStore('keys', {
    state: () => ({
        pub: []
    }),
    actions: {
        set(){
            localStorage.setItem(
                "keysStore",JSON.stringify(this)
            )
        },
        get(){
            const obj = JSON.parse(
                localStorage.getItem("keysStore")
            )
            this.pub = obj.pub
        }
    }
})