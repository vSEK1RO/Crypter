import { defineStore } from 'pinia'

export const useLoading = defineStore('loading', {
    state: () => ({
        data: {
            keys: false,
            encrypt: false,
            decrypt: false,
        }
    }),
    actions: {
        set() {
            localStorage.setItem(
                "loadingStore", JSON.stringify({data: this.data})
            )
        },
        get() {
            const obj = JSON.parse(
                localStorage.getItem("loadingStore")
            )
            if (obj?.data !== undefined) {
                if (obj.data.hasOwnProperty('keys') &&
                    obj.data.hasOwnProperty('encrypt') &&
                    obj.data.hasOwnProperty('decrypt'))
                {
                    this.data = obj.data
                }else{
                    this.data = {
                        keys: false,
                        encrypt: false,
                        decrypt: false,
                    }
                }
            }
        }
    }
})