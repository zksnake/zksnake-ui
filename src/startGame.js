import { buildMimc7 } from 'circomlibjs'
import { bsv, buildContractClass, getPreimage, Int, PubKey, signTx } from 'scryptlib'
import { ContractUtxos, Player, PlayerPrivkey, PlayerPublicKey } from './storage'
import { web3 } from './web3'
import desc from '../out/snake_desc.json'

const { loadDesc, newTx, inputSatoshis } = require('./helper')

async function hashShips (placedShips) {
  let shipPreimage = 0n
  for (let i = 0; i < placedShips.length; i++) {
    const ship = placedShips[i]
    // eslint-disable-next-line no-undef
    shipPreimage += BigInt(ship[0] * Math.pow(16, i * 3) + ship[1] * Math.pow(16, i * 3 + 1) + ship[2] * Math.pow(16, i * 3 + 2))
  }

  const mimc7 = await buildMimc7()
  return mimc7.F.toString(mimc7.hash(shipPreimage, 0))
}

export const startGame = async (playerShips, computerShips) => {
  const Snake = buildContractClass(desc)
  const playerHash = await hashShips(playerShips)
  const computerHash = await hashShips(computerShips)
  console.log('Player Hash: ', playerHash)
  console.log('Computer Hash:', computerHash)

  const contract = new Snake(new PubKey(PlayerPublicKey.get(Player.You)),
    new PubKey(PlayerPublicKey.get(Player.Computer)),
    new Int(playerHash), new Int(computerHash), 0, 0, true, new Array(100).fill(false), new Array(100).fill(false)
  )
  console.log('ZkSnake:', contract)

  try {
    ContractUtxos.clear()
    console.log('Utxos: ', ContractUtxos)
    const rawTx = await web3.deploy(contract, 10000)
    console.log('RawTx:', rawTx)
    ContractUtxos.add(rawTx, 0, -1)

    const txid = ContractUtxos.getdeploy().utxo.txId
    // setDeployTxid(txid)
  } catch (error) {
    console.error('deploy contract fails', error)
    alert('deploy contract error:' + error.message)
  }
}
