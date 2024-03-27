import {expect, test, describe} from 'vitest'

function sum(a,b){
    return a+b
}

describe('arythm',()=>{
    test('sum test',()=>{
        expect(sum(1,2)).toBe(3)
    })
    test.each([
        [1,2,3],
        [0,0,0],
    ])('sum(%i,%i) -> %i',(a,b,expected)=>{
        expect(sum(a,b)).toBe(expected)
    })
})
