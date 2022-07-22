<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in results" :key="item.art_id">
        <template #title>
          <span>{{ item.title }}</span>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api'
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
      results: [],
      per_page: 16,
      page: 1,
      loading: false,
      finished: false
    }
  },
  created() {
    this.getSearch()
  },
  methods: {
    // 获取搜索建议，并处理数据
    async getSearch() {
      try {
        const res = await getSearchResult({
          q: this.keywords,
          per_page: this.per_page,
          page: this.page
        })

        return res.data.data.results
        // console.log(1)
        // console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    async onLoad() {
      this.page++
      const res = await this.getSearch()
      if (res.length === 0) {
        this.finished = true
        this.loading = false
        return
      }
      this.results = [...this.results, ...res]
      this.loading = false
    }
  }
}
</script>

<style></style>
