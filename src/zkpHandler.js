import ZKPWorker from './zkp.worker';

const zkpWorkerMsgHandler = async (event) => {

    const { ctx, isVerified, proof, output } = event.data;

    if (isVerified) {


      queue.enqueue(async () => {

        const isPlayerFired = ctx.role === 'player';

        const contractUtxo = ContractUtxos.getlast().utxo;
  
        const Proof = battleShipContract.getTypeClassByType("Proof");
        const G1Point = battleShipContract.getTypeClassByType("G1Point");
        const G2Point = battleShipContract.getTypeClassByType("G2Point");
        const FQ2 = battleShipContract.getTypeClassByType("FQ2");
  
        contractUtxo.script = battleShipContract.lockingScript.toHex();

        await move(isPlayerFired, ctx.targetIdx, contractUtxo, output, new Proof({
          a: new G1Point({
            x: new Int(proof.proof.a[0]),
            y: new Int(proof.proof.a[1]),
          }),
          b: new G2Point({
            x: new FQ2({
              x: new Int(proof.proof.b[0][0]),
              y: new Int(proof.proof.b[0][1]),
            }),
            y: new FQ2({
              x: new Int(proof.proof.b[1][0]),
              y: new Int(proof.proof.b[1][1]),
            })
          }),
          c: new G1Point({
            x: new Int(proof.proof.c[0]),
            y: new Int(proof.proof.c[1]),
          })
        }), ctx.newStates)
          .then(() => {
  
            if (isPlayerFired) {
              setHitsProofToPlayer(new Map(hp2PRef.current.set(ctx.targetIdx, { status: isVerified ? 'verified' : 'failed', proof })))
            } else {
              setHitsProofToComputer(new Map(hp2CRef.current.set(ctx.targetIdx, { status: isVerified ? 'verified' : 'failed', proof })))
            }
          })
          .catch(e => {
            console.error("call contract error:", e);
            alert("call contract error:" + e.message);
          })
      })
    }
}

useEffect((battleShipContract) => {
    const zkWorkers = new ZKPWorker();
    zkWorkers.addEventListener('message', zkpWorkerMsgHandler);
    setZKPWorkerForPlayer(zkWorkers);

    return (() => {
      zkWorkers.terminate();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleShipContract]);