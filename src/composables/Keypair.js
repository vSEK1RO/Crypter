import forge from 'node-forge'

export class Keypair {
    constructor(options = {}){
        if(options.hasOwnProperty('pub') &&
            options.hasOwnProperty('priv')
        ){
            this.priv = options.priv
            this.pub = options.pub
        }
    }
    generate(options = {}){
        if(!options.hasOwnProperty('passphrase') ||
            !options.hasOwnProperty('bits')
        ){
            throw Error('options should have passphrase and bits property')
        }
        let rsaKeyPair = forge.pki.rsa.generateKeyPair({bits: options.bits})
        this.priv = forge.pki.encryptRsaPrivateKey(rsaKeyPair.privateKey, forge.util.encodeUtf8(options.passphrase))
        this.pub = forge.pki.publicKeyToPem(rsaKeyPair.publicKey)
    }
}