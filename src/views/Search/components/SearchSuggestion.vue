<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="resultFn(index)"
    >
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>

      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 引入API
import { getSearchSuggestion } from '@/api'
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
      suggestions: []
    }
  },
  watch: {
    // 监视属性绑定的函数，如果是methods里面的话
    keywords: {
      immediate: true,
      handler() {
        this.getSearchSuggestion()
      }
    }
  },
  methods: {
    // 获取搜索建议，并处理数据
    async getSearchSuggestion() {
      try {
        const res = await getSearchSuggestion(this.keywords)

        if (res.data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.suggestions = res.data.data.options.filter(Boolean)
        // console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    resultFn(index) {
      this.$parent.keywords = this.suggestions[index]
      this.$parent.historyFn()
      this.$parent.isShowSearchResult = true
    }
  },
  computed: {
    highlightData() {
      // 将搜索建议的每一项处理
      const reg = new RegExp(this.keywords, 'ig')

      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      )
    }
  }
}
</script>

<style scoped lang="less">
.search-icon {
  padding-top: 10px;
}
</style>
