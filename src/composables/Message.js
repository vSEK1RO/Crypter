import forge from 'node-forge'

export class Message{
    constructor(options){
        if(options.hasOwnProperty('name') &&
            options.hasOwnProperty('type') &&
            options.hasOwnProperty('data')
        ){
            this.data = options.data
            this.name = options.name
            this.type = options.type
        }
        if(options.hasOwnProperty('encoded64')){
            const obj = JSON.parse(forge.util.decode64(options.encoded64))
            if(!(obj.hasOwnProperty('name') &&
                obj.hasOwnProperty('type') &&
                obj.hasOwnProperty('data')))
            {
                throw new Error('Invalid encoded64 data format')
            }
            this.data = obj.data
            this.name = obj.name
            this.type = obj.type
        }
    }
    obj(){
        return {
            name: this.name,
            type: this.type,
            data: this.data
        }
    }
    encode64(){
        return forge.util.encode64(JSON.stringify(this.obj()))
    }
    encrypt(pubKeyPem){
        let b64message = forge.util.encodeUtf8(this.data)
        let encryptedMsg = ''
        while(b64message.length > 0){
            const buffer = b64message.slice(0,32)
            b64message = b64message.slice(32)
            const encBuffer = forge.pki.publicKeyFromPem(pubKeyPem).encrypt(buffer, 'RSA-OAEP')
            encryptedMsg += encBuffer
        }
        this.data = encryptedMsg
    }
    decrypt(privKeyPem, passphrase){
        let decryptedPrivateKey = forge.pki.decryptRsaPrivateKey(privKeyPem, passphrase);
        if(decryptedPrivateKey==null){
            throw new Error('Passphrase incorrect')
        }
        let decryptedPrivateKeyPem = forge.pki.privateKeyToPem(decryptedPrivateKey)
        if(decryptedPrivateKeyPem==null){
            throw new Error('Passphrase incorrect')
        }
        let privateKey = forge.pki.privateKeyFromPem(decryptedPrivateKeyPem)
        let rawEnc = this.data
        const byteSize = privateKey.n.bitLength()/8;
        let decryptedMsg = ''
        try{
            while(rawEnc.length > 0){
                const buffer = rawEnc.slice(0,byteSize)
                rawEnc = rawEnc.slice(byteSize)
                decryptedMsg += privateKey.decrypt(buffer, 'RSA-OAEP')
            }
        }catch(error){
            throw error
        }
        this.data = forge.util.decodeUtf8(decryptedMsg)
    }
}