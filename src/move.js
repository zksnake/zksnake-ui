import { bsv, buildContractClass, getPreimage, Int, PubKey, signTx } from 'scryptlib'
import { web3 } from './web3'

function CellsToSnakeStates (cells) {
  let snakeState1 = 0, snakeState2 = 0
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      snakeState1 *= 2
      snakeState2 *= 2
      if (cells[i][j] === 'p') {
        snakeState1++
      } else if (cells[i][j] === 'q') {
        snakeState2++
      }
    }
  }
  return snakeState1, snakeState2
}

const eatPoison = async (cells, yourTurn)=>{

  // 1. convert cells to snake1,snake2 
  //                     00001, 10000
  //                     00001, 10000
  //                     00001, 10000
  //                     00001, 10000
  //                     00001, 10000
  const {snakeState1, snakeState2} = CellsToSnakeStates(cells)
  // const proof =
  // const contractUtxo =


    return web3.call(contractUtxo, async(tx) => {
       

        tx.setOutput(0, (tx) => {
          const amount = contractUtxo.satoshis - tx.getEstimateFee();
          if (amount < 1) {
            alert('Not enough funds.');
            throw new Error('Not enough funds.')
          }

          return new bsv.Transaction.Output({
            script: bsv.Script.buildPublicKeyHashOut(PlayerPrivkey.get(Player.You)),
            satoshis: amount,
          })
        })


        tx.setInputScript(0, (tx, output) => {
          const preimage = getPreimage(tx, output.script, output.satoshis)
          const currentTurn = !newStates.yourTurn;
          const privateKey = new bsv.PrivateKey.fromWIF(currentTurn ? PlayerPrivkey.get(Player.You) : PlayerPrivkey.get(Player.Computer));
          const sig = signTx(tx, privateKey, output.script, output.satoshis)
          const position = indexToCoords(index);
  
          let amount = contractUtxo.satoshis - tx.getEstimateFee();
  
          if (amount < 1) {
            alert('Not enough funds.');
            throw new Error('Not enough funds.')
          }
  
          return contract.end(snakeState1, snakeState2, yourTurn, proof).toScript();
        })
          .seal();
    })
    .catch(e => {
      console.error('call contract fail', e)
    })
  }
  


const move = async (isPlayerFired, index, contractUtxo, hit, proof, newStates) => {
  console.log('call move ...', 'index=', index, 'hit=', hit, 'newStates=', newStates)

  return web3.call(contractUtxo, async (tx) => {
    if (newStates.successfulYourHits === 2) {
      const amount = contractUtxo.satoshis - tx.getEstimateFee()

      if (amount < 1) {
        alert('Not enough funds.')
        throw new Error('Not enough funds.')
      }

      tx.setOutput(0, (tx) => {
        return new bsv.Transaction.Output({
          script: bsv.Script.buildPublicKeyHashOut(PlayerPrivkey.get(Player.Computer)),
          satoshis: amount
        })
      })
    } else if (newStates.successfulComputerHits === 2) {
      tx.setOutput(0, (tx) => {
        const amount = contractUtxo.satoshis - tx.getEstimateFee()
        if (amount < 1) {
          alert('Not enough funds.')
          throw new Error('Not enough funds.')
        }

        return new bsv.Transaction.Output({
          script: bsv.Script.buildPublicKeyHashOut(PlayerPrivkey.get(Player.You)),
          satoshis: amount
        })
      })
    } else {
      tx.setOutput(0, (tx) => {
        const amount = contractUtxo.satoshis - tx.getEstimateFee()

        if (amount < 1) {
          alert('Not enough funds.')
          throw new Error('Not enough funds.')
        }

        const newLockingScript = battleShipContract.getNewStateScript(newStates)

        return new bsv.Transaction.Output({
          script: newLockingScript,
          satoshis: amount
        })
      })
    }

    tx.setInputScript(0, (tx, output) => {
      const preimage = getPreimage(tx, output.script, output.satoshis)
      const currentTurn = !newStates.yourTurn
      const privateKey = new bsv.PrivateKey.fromWIF(currentTurn ? PlayerPrivkey.get(Player.You) : PlayerPrivkey.get(Player.Computer))
      const sig = signTx(tx, privateKey, output.script, output.satoshis)
      const position = indexToCoords(index)

      const amount = contractUtxo.satoshis - tx.getEstimateFee()

      if (amount < 1) {
        alert('Not enough funds.')
        throw new Error('Not enough funds.')
      }

      return battleShipContract.move(sig, position.x, position.y, hit, proof, amount, preimage).toScript()
    })
      .seal()
  }).then(async rawTx => {
    ContractUtxos.add(rawTx, isPlayerFired, index)

    battleShipContract.successfulYourHits = newStates.successfulYourHits
    battleShipContract.successfulComputerHits = newStates.successfulComputerHits
    battleShipContract.yourTurn = newStates.yourTurn
    battleShipContract.yourHits = newStates.yourHits
    battleShipContract.computerHits = newStates.computerHits

    setTimeout(async () => {
      web3.wallet.getbalance().then(balance => {
        console.log('update balance:', balance)
        setBalance(balance)
      })
    }, 5000)
  })
    .catch(e => {
      console.error('call contract fail', e)
    })
}
