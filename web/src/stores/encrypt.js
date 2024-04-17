import { defineStore } from 'pinia'

export const useEncrypt = defineStore('encrypt', {
    state: ()=>{
        return {
            msg: []
        }
    }
})