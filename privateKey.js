const { exit } = require('process')
const { bsv } = require('scryptlib');

// fill in private key on testnet in WIF here
const privKey = 'cSbYMVKeEHSCwSY78tngyJUL4pW56pEQbYsgDPtjChypykcAwLkV'

if (!privKey) {
  genPrivKey()
}

function genPrivKey() {
  const newPrivKey = new bsv.PrivateKey.fromRandom('testnet')
  console.log(`Missing private key, generating a new one ...
Private key generated: '${newPrivKey.toWIF()}'
You can fund its address '${newPrivKey.toAddress()}' from sCrypt faucet https://scrypt.io/#faucet`)
  exit(-1)
}

const privateKey = new bsv.PrivateKey.fromWIF(privKey)

module.exports = {
  privateKey,
  genPrivKey
}
