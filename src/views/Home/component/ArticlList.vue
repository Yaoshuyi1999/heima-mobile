<template>
  <div>
    <van-pull-refresh
      v-model="refreshLoading"
      @refresh="loadNextPage"
      success-text="刷新成功"
    >
      <van-list
        @load="loadNextPage"
        :immediate-check="false"
        v-model="loading"
        :finished="isFinished"
        :error.sync="error"
        error-text="出错了，请点击重新加载"
        finished-text="没有更多了~~"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/api'
import ArticleItem from './ArticleItem'
export default {
  components: {
    ArticleItem
  },
  data() {
    return {
      articles: {},
      pre_timestamp: '',
      loading: false,
      isFinished: false,
      error: false,
      refreshLoading: false
    }
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    // 获取频道的文章并且处理文章数据
    async getArticleList() {
      try {
        const { data } = await getArticleList(this.id, +new Date())
        this.pre_timestamp = data.data.pre_timestamp
        this.articles = data.data.results
      } catch (error) {
        const status = error.response.status

        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请重新刷新')
        }
      }
    },
    // 加载下一页频道数据
    async loadNextPage() {
      try {
        if (Math.random() < 0.7) {
          throw new Error('错误了')
        }
        const { data } = await getArticleList(this.id, this.pre_timestamp)

        if (!data.data.pre_timestamp) {
          this.isFinished = true
        }
        if (this.refreshLoading) {
          this.articles.unshift(...data.data.results)
        } else {
          // 将第n页的数据,放在articles
          this.articles.push(...data.data.results)
        }
        // 更新页数
        this.pre_timestamp = data.data.pre_timestamp
      } catch {
        this.error = true
      } finally {
        // finally表示不管成功与否，都会执行的语句
        // loading设置为false
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>

<style></style>
