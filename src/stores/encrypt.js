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
            if (obj?.data[0] !== undefined) {
                if (obj.data[0].hasOwnProperty('date') &&
                    obj.data[0].hasOwnProperty('name') &&
                    obj.data[0].hasOwnProperty('enc') &&
                    obj.data[0].hasOwnProperty('raw') &&
                    obj.data[0].hasOwnProperty('pub'))
                {
                    this.data = obj.data
                }else{
                    this.data = []
                }
            }
        }
    }
})