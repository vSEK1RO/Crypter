import { defineStore } from 'pinia'

export const useKeys = defineStore('keys', {
    state: () => ({
        pub: []
    }),
    actions: {
        set() {
            localStorage.setItem(
                "keysStore", JSON.stringify({pub: this.pub})
            )
        },
        get() {
            const obj = JSON.parse(
                localStorage.getItem("keysStore")
            )
            if (obj != null) {
                this.pub = obj.pub
            }
        }
    }
})