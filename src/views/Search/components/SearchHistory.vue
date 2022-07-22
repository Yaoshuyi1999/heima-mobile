<template>
  <div>
    <van-cell>
      <template #title>
        <span>搜索历史</span>
      </template>

      <template #default>
        <div v-if="flag == 1">
          <span @click="delAllFn">全部删除 </span>
          <span @click="flag = 0"> 完成</span>
        </div>
        <van-icon v-else name="delete-o" @click="flag = 1" />
      </template>
    </van-cell>
    <van-cell
      v-for="(item, index) in historyArray"
      :key="index"
      @click="getHistoryFn(index)"
    >
      <template #title>
        <span>{{ item }}</span>
      </template>
      <template #default>
        <van-icon name="close" @click="delFn(item)" v-show="flag === 1" />
      </template>
    </van-cell>
  </div>
</template>

<script>
import storage from '@/utils/storage'
export default {
  props: {
    // 搜索关键字
    keywords: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      flag: 0,
      historyArray: []
    }
  },
  created() {
    this.historyArray = storage.get('history')
  },
  methods: {
    getHistoryFn(index) {
      if (this.flag === 0) {
        this.$parent.keywords = this.historyArray[index]
        this.$parent.historyFn()
        this.$parent.isShowSearchResult = true
      }
    },
    // 全部删除
    delAllFn() {
      storage.remove('history')
      this.historyArray = []
      this.$parent.historyArray = []
      this.flag = 0
    },
    delFn(key) {
      // console.log(key)
      const index = this.historyArray.indexOf(key)
      if (index !== -1) {
        this.historyArray.splice(index, 1)
      }
      storage.set('history', this.historyArray)
      this.$parent.historyArray = this.historyArray
      this.flag = 1
    }
  }
}
</script>

<style></style>
