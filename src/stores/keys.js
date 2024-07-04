import { defineStore } from 'pinia'

export const useKeys = defineStore('keys', {
    state: () => ({
        data: []
    }),
    actions: {
        set() {
            localStorage.setItem(
                "keysStore", JSON.stringify({data: this.data})
            )
        },
        get() {
            const obj = JSON.parse(
                localStorage.getItem("keysStore")
            )
            if (obj != null) {
                this.data = obj.data
            }
        }
    }
})