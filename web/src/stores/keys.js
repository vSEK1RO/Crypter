import { defineStore } from 'pinia'

export const useKeys = defineStore('keys', {
    state: ()=>{
        return {
            pub: [{
                date: "test",
                name: "test",
                key: "123",
            },
            {
                date: "test",
                name: "test1",
                key: "123",
            },
            {
                date: "test",
                name: "test12",
                key: "123",
            },
            {
                date: "test",
                name: "test123",
                key: "123",
            },]
        }
    }
})