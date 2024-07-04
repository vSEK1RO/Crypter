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
            if (obj?.data[0] !== undefined) {
                if (obj.data[0].hasOwnProperty('date') &&
                    obj.data[0].hasOwnProperty('name') &&
                    obj.data[0].hasOwnProperty('pub') &&
                    obj.data[0].hasOwnProperty('priv'))
                {
                    this.data = obj.data
                }else{
                    this.data = []
                }
            }
        }
    }
})