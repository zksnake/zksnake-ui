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
    <div class="end" @click="endGame">End Game</div>
  </div>
</template>

<script>

import crossIcon from '../icons/cross.vue'
import boomIcon from '../icons/boom.vue'
import WalletInfo from './WalletInfo.vue'
import { web3, SensiletWallet } from '../web3'

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

      // wallet
      wallet: {
        balance: 'init',
        network: 'init',
        address: 'init'
      }
    }
  },
  mounted () {
    const cells = [
      ['', '', '', '', ''], // p or q
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ]
    this.cells = cells
    // TODO 初始化链

    // construct wallet
    const wallet = new SensiletWallet()
    web3.setWallet(wallet)
    // example to display wallet balance
    // this.wallet = {
    //   balance: '1111',
    //     network: 'testnet',
    //     address: 'asdgawdawdvu27tasd'
    // }
  },
  methods: {
    endGame () {
      // TODO end game
    },
    click (x, y) {
      if (this.setupGame) {
        this.setupGame = false
        // TODO get x, y and init chain
        return
      }

      if (!this.canClick(x, y, this.curPlayer)) return
      this.cells[x][y] = this.curPlayer
      this.lastCell[this.curPlayer] = [x, y]
      this.nextPlayer()
    },
    canClick (x, y, player) {
      if (x < 0 || x >= 5 || y < 0 || y >= 5) return false
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
