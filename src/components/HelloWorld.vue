<template>
  <div class="hello">
    <WalletInfo :wallet="wallet"></WalletInfo>
    <div class="row" v-for="xc, x in cells" :key="'x-'+x">
      <div class="cell" :class="styleClass(x,y)"
        v-for="yc, y in xc" :key="'y-'+y" @click="click(x,y)">
        <div v-if="setupGame" class="boomIcon">
          <boomIcon class="icon"/>
        </div>
        <crossIcon class="icon" v-if="!setupGame&&!cells[x][y] && !canClick(x,y, curPlayer)" style="opacity: 0.1; "></crossIcon>
      </div>
    </div>
    <div class="end" v-if="!wallet.client" @click="setUp">Start Game</div>
    <div>
      <p v-for="(log,idx) in logs" :key="('log-'+idx)">{{log}}</p>
    </div>
  </div>
</template>

<script>

import crossIcon from '../icons/cross.vue'
import boomIcon from '../icons/boom.vue'
import WalletInfo from './WalletInfo.vue'
import { web3, SensiletWallet, Network } from '../web3'

const rows = 5
const cols = 5
const posionsPerPlayer = 2

export default {
  components: {
    boomIcon,
    crossIcon,
    WalletInfo
  },
  name: 'HelloWorld',
  props: {
  },
  data () {
    return {
      setupGame: true,

      cells: [],
      curPlayer: 'q', // p or q
      lastCell: { // last position of p or q
        q: null,
        p: null
      },

      poisons: {
        p: [],
        q: []
      },

      // wallet
      wallet: {
        balance: 'init',
        network: 'init',
        address: 'init',
        client: null
      },

      logs: []
    }
  },
  methods: {
    async setUp () {
      // listen message

      // TODO 初始化链
      // construct wallet

      const wallet = new SensiletWallet()
      web3.setWallet(wallet)
      const isConnected = await web3.wallet.isConnected()

      if (isConnected) {
        const n = await wallet.getNetwork()

        if (n === Network.Mainnet) {
          alert("your sensilet wallet's network is mainnet, switch to testnet before playing.")
          return
        }

        web3.setWallet(new SensiletWallet(n))
      } else {
        try {
          const res = await web3.wallet.requestAccount('zksnake')
          if (!res) {
            throw new Error('no response')
          }
        } catch (error) {
          console.error('requestAccount error', error)
        }
      }
      console.log(wallet)
      this.wallet = {
        balance: (await wallet.sensilet.getBsvBalance()).balance.total,
        network: wallet.network,
        address: await wallet.sensilet.getAddress(),
        client: wallet
      }

      // init cells
      for (let i = 0; i < rows; i++) {
        const col = []
        const pP = []
        const pQ = []

        for (let j = 0; j < cols; j++) {
          col.push('')
          pP.push(false)
          pQ.push(false)
        }
        this.cells.push(col)
        this.poisons.p.push(pP)
        this.poisons.q.push(pQ)
      }

      this.logs.push('Please setup 2 posions.')
    },

    addPoison (x, y) {
      const player = 'p'
      this.poisons[player][x][y] = true
      let posions = 0
      this.poisons[player].forEach(v => {
        v.forEach(vv => {
          if (vv) {
            posions++
          }
        })
      })

      // AI setup poison
      if (posions >= posionsPerPlayer) {
        posions = 0

        for (;posions < 2;) {
          const randomX = Math.floor(Math.random() * rows) % rows
          const randomY = Math.floor(Math.random() * cols) % cols
          this.poisons.q[randomX][randomY] = true

          posions = 0
          this.poisons.q.forEach(v => {
            v.forEach(vv => {
              if (vv) {
                posions++
              }
            })
          })
        }

        this.logs.push('Please click any cell to start')
        this.setupGame = false
      }
    },

    click (x, y) {
      // step 1: player p add poison
      // step 2: player q add poison
      // step 3: player p start
      // step 4: player q start
      // setup game
      if (this.setupGame) {
        // TODO get x, y and init chain
        // deploy
        this.addPoison(x, y)
        return
      }

      // move
      if (!this.canClick(x, y, this.curPlayer)) return
      this.cells[x][y] = this.curPlayer
      this.lastCell[this.curPlayer] = [x, y]
      this.nextPlayer()
      // TODO verify
    },
    canClick (x, y, player) {
      if (x < 0 || x >= cols || y < 0 || y >= rows) return false
      if (this.cells[x][y]) return false
      if (!this.lastCell[player]) return true
      const last = this.lastCell[player]
      if (Math.abs(last[0] - x) + Math.abs(last[1] - y) > 1) return false
      return true
    },
    styleClass (x, y) {
      return {
        p: this.cells[x][y] === 'p',
        q: this.cells[x][y] === 'q',
        ph: this.curPlayer === 'p',
        qh: this.curPlayer === 'q'
      }
    },
    nextPlayer () {
      const next = this.curPlayer === 'p' ? 'q' : 'p'
      const lastCell = this.lastCell[next]
      if (lastCell) {
        if (!this.canClick(lastCell[0] - 1, lastCell[1], next) &&
            !this.canClick(lastCell[0] + 1, lastCell[1], next) &&
            !this.canClick(lastCell[0], lastCell[1] + 1, next) &&
            !this.canClick(lastCell[0], lastCell[1] - 1, next)
        ) {
          return
        }
      }
      this.curPlayer = next // switch
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped scss>
.hello {
  margin: 0 auto;
  width: 700px;
  height: 700px;
  padding: 0;
}
.row{
  margin: 0;
  padding: 0;
  height: 100px;
}
.cell{
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px rgba(101, 101, 101, 0.193) solid;
  cursor: pointer;
  margin: 0px;
  top: 0;
  left: 0;
  padding: 0;
}
.cell.ph:hover{
  background-color: #CCFFFF;
}
.cell.qh:hover{
  background-color: #FFCCCC;
}

.cell.p{
  background-color: #CCFFFF !important;
}
.cell.q{
  background-color: #FFCCCC !important;
}

.boomIcon{
  opacity: 0;
  padding: 12px;
}
.boomIcon:hover{
  opacity: 0.6;
}

.boomIcon.icon{
  top: 10px;
}

.end{
  border: 1px solid red;
  width: 100px;
  border-radius: 10px;
  margin: 20px auto;
  padding: 10px;
  cursor: pointer;
}
</style>
