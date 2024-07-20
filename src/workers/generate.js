import { Keypair } from "@/composables/Keypair"

self.onmessage = (event) => {
    const keypair = new Keypair()
    keypair.generate({
        passphrase: event.data.passphrase,
        bits: event.data.bits
    })
    self.postMessage(keypair)
}