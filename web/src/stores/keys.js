import { defineStore } from 'pinia'

export const useKeys = defineStore('keys', {
    state: ()=>{
        return {
            pub: [{
                date: "test",
                name: "test",
                key: "test",
            }]
        }
    }
})