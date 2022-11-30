import { buildMimc7 } from 'circomlibjs';
import { bsv, buildContractClass, getPreimage, Int, PubKey, signTx } from 'scryptlib';
const { loadDesc, newTx, inputSatoshis } = require('./helper');
import { ContractUtxos, Player, PlayerPrivkey, PlayerPublicKey } from './storage';
import { web3 } from './web3';

async function hashShips(placedShips) {

  let shipPreimage = 0n;
  for (let i = 0; i < placedShips.length; i++) {
    const ship = placedShips[i];
    // eslint-disable-next-line no-undef
    shipPreimage += BigInt(ship[0] * Math.pow(16, i * 3) + ship[1] * Math.pow(16, i * 3 + 1) + ship[2] * Math.pow(16, i * 3 + 2));
  }

  const mimc7 = await buildMimc7();
  return mimc7.F.toString(mimc7.hash(shipPreimage, 0));
}

const startGame = async (playerShips, computerShips, publicKeyPlayer, publicKeyComputer) => {

    const Snake = buildContractClass(loadDesc('snake'));

    const playerHash = await hashShips(playerShips);
    const computerHash = await hashShips(computerShips);
    console.log("Player Hash: ", playerHash);
    console.log("Computer Hash:", computerHash);

    const zkSnake = new Snake(new PubKey(toHex(publicKeyPlayer)),
      new PubKey(toHex(publicKeyComputer)),
      new Int(playerHash), new Int(computerHash), 0, 0, true,new Array(100).fill(false),new Array(100).fill(false) 
    );

    try {
      ContractUtxos.clear();
      const rawTx = await web3.deploy(zkSnake, 10000);
      ContractUtxos.add(rawTx, 0, -1);
      const txid = ContractUtxos.getdeploy().utxo.txId
      setDeployTxid(txid)

    } catch (error) {
      console.error("deploy contract fails", error);
      alert("deploy contract error:" + error.message);
      return;
    }

};

module.exports = {startGame}