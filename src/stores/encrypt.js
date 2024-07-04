import { defineStore } from 'pinia'

export const useEncrypt = defineStore('encrypt', {
    state: () => ({
        data: []
    }),
    actions: {
        set() {
            localStorage.setItem(
                "encryptStore", JSON.stringify({data: this.data})
            )
        },
        get() {
            const obj = JSON.parse(
                localStorage.getItem("encryptStore")
            )
            if (obj != null) {
                this.data = obj.data
            }
        }
    }
})