<template>
  <div class="hello">
    <div class="row" v-for="xc, x in cells" :key="'x-'+x">
      <div class="cell" :class="styleClass(x,y)"
        v-for="yc, y in xc" :key="'y-'+y" @click="click(x,y)">
        <crossIcon class="icon" v-if="!this.cells[x][y] && !canClick(x,y, curPlayer)" style="opacity: 0.1; "></crossIcon>
      </div>
    </div>
  </div>
</template>


<script>
import crossIcon from '../icons/cross.vue'

export default {
  components:{
    crossIcon,
  },
  name: 'HelloWorld',
  props: {
  },
  data(){
    return {
      cells: [],
      curPlayer: 'q', // p or q
      lastCell: { // last position of p or q
        q: null,
        p: null
      }
    }
  },
  mounted(){
    const cells = [
      ["","","","",""], // p or q
      ["","","","",""],
      ["","","","",""],
      ["","","","",""],
      ["","","","",""],
    ];
    this.cells = cells;
  },
  methods:{
    click(x,y){
      if(!this.canClick(x,y, this.curPlayer)) return;
      this.cells[x][y] = this.curPlayer
      this.lastCell[this.curPlayer] = [x,y]
      this.nextPlayer()
    },
    canClick(x,y, player){
      console.log(1)
      if(x <0 || x >= 5 || y < 0 || y>=5 ) return false;
      console.log(2)
      if (this.cells[x][y]) return false;
      console.log(3)
      if(!this.lastCell[player]) return true;
      console.log(4)
      const last = this.lastCell[player]
      if( Math.abs(last[0] - x) + Math.abs(last[1] - y) > 1) return false;
      console.log(5)
      return true
    },
    styleClass(x,y){
      return {
        p: this.cells[x][y]==='p',
        q: this.cells[x][y] === 'q',
        ph: this.curPlayer==='p',
        qh: this.curPlayer ==='q',
      }
    },
    nextPlayer(){
      let next = this.curPlayer === 'p' ? 'q' : 'p'
      const lastCell = this.lastCell[next]
      if(lastCell){
        if (!this.canClick(lastCell[0] - 1, lastCell[1], next) &&
            !this.canClick(lastCell[0] + 1, lastCell[1], next) &&
            !this.canClick(lastCell[0], lastCell[1] + 1, next) &&
            !this.canClick(lastCell[0], lastCell[1] - 1, next)
        ){
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
.disabled{

}

</style>
