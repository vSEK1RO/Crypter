import { defineStore } from 'pinia'

export const useKeys = defineStore('keys', {
    state: ()=>{
        return {
            pub: []
        }
    }
})