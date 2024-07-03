import { defineStore } from 'pinia'

export const useEncrypt = defineStore('encrypt', {
    state: () => ({
        msg: []
    }),
    actions: {
        set() {
            localStorage.setItem(
                "encryptStore", JSON.stringify(this)
            )
        },
        get() {
            const obj = JSON.parse(
                localStorage.getItem("encryptStore")
            )
            if (obj != null) {
                this.msg = obj.msg
            }
        }
    }
})