<template>
    <div class="walletinfo">
        <p>Balance: {{wallet.balance}}</p>
        <p>Network: {{wallet.network}}</p>
        <p>Address: {{wallet.address}}</p>
    </div>
</template>

<script>

export default {
  components: {
  },
  name: 'WalletInfo',
  props: ['wallet'],
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped scss>
.walletinfo{
    width: 100%;
}
</style>
