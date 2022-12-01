import { buildMimc7 } from 'circomlibjs'
import { bsv, buildContractClass, getPreimage, Int, PubKey, signTx } from 'scryptlib'
import { ContractUtxos, Player, PlayerPrivkey, PlayerPublicKey } from './storage'
import { web3 } from './web3'
import desc from '../out/snake_desc.json'

const { loadDesc, newTx, inputSatoshis } = require('./helper')

async function hashPoison (poisonState) {
  let poisonPreimage = 0n

  console.log('-------- PoisonState:' + poisonState)

  poisonPreimage = BigInt(poisonState)

  console.log(poisonPreimage)
  const mimc7 = await buildMimc7()

  return mimc7.F.toString(mimc7.hash(poisonPreimage, 0))
}

function poisonMatrixToState (poisonMatrix) {
  let poisonState = 0
  for (let i = 0; i < poisonMatrix.length; i++) {
    for (let j = 0; j < poisonMatrix[i].length; j++) {
      poisonState = 2 * poisonState
      if (poisonMatrix[i][j] === true) {
        poisonState++
      }
    }
  }
  return poisonState
}

export const startGame = async (playerPoison, computerPoison) => {
  console.log('playerPoison:', playerPoison)
  console.log('computerPoison:', computerPoison)
  const playerPoisonState = poisonMatrixToState(playerPoison)
  const computerPoisonState = poisonMatrixToState(computerPoison)
  console.log('playerPoisonState:', playerPoisonState)
  console.log('computerPoisonState:', computerPoisonState)

  const Snake = buildContractClass(desc)
  console.log(desc)

  const playerHash = await hashPoison(playerPoisonState)
  const computerHash = await hashPoison(computerPoisonState)
  console.log('Player Hash: ', playerHash)
  console.log('Computer Hash:', computerHash)

  const contract = new Snake(new Int(playerHash), new Int(computerHash))
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
