import { toByteSize } from '@/composables/toByteSize'

self.onmessage = (event) => {
    if(!event.data.hasOwnProperty('file') || 
        !event.data.hasOwnProperty('size')
    ){
        throw Error('event.data should has file and size properties')
    }
    const size = event.data.size
    const file = event.data.file
    if(file.size > size){
        const err = `File is larger than ${toByteSize(size)}`
        self.postMessage({status: 'sizeError', data: err})
        throw Error(err)
    }
    const reader = new FileReader()
    reader.onprogress = (e) => {
        self.postMessage({status: 'loading', data: e.loaded / e.total * 100})
    }
    reader.onload = () => {
        self.postMessage({status: 'loaded', data: reader.result, name: file.name})
    }
    reader.readAsText(file)
}