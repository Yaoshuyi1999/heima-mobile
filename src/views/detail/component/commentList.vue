<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="flag"
    >
      <CommentItem
        v-for="(item, index) in getCommentsList"
        :key="index"
        :getCommentItem="item"
      ></CommentItem>
    </van-list>
  </div>
</template>

<script>
import CommentItem from './commentItem.vue'
// import eventBus from './EventBus'
// import dayjs from '@/utils/dayjs'
import { getComments } from '@/api'
export default {
  data() {
    return {
      getCommentsList: [], // 评论列表的数据
      flag: false, // 进入页面会直接请求两次数据的问题
      loading: false, // 加载中，请求完成渲染好一次数据，会自动变为true
      finished: false, // 表示是否结束列表
      last: '' // 每次请求评论列表得到的最后一个值
    }
  },
  props: {
    // 文章详情的请求数据
    getArticleInfoList: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    CommentItem
  },
  created() {
    this.getComment()
  },
  methods: {
    // 获取评论列表
    async getComment() {
      try {
        // console.log(this.last)
        // console.log(this.$route.query.id)
        const res = await getComments({
          type: 'a',
          source: this.$route.query.id,
          offset: this.last,
          limit: 5
        })
        this.last = res.data.data.last_id
        console.log(this.last)
        // console.log(res)
        // this.getCommentsList = res.data.data.results
        // console.log(this.getCommentsList)
        // this.numReply = res.data.data.total_count
        return res.data.data.results
      } catch (err) {
        console.log(err)
      }
    },
    // 滚动条触底后自动触发的，重新获取新的数据
    async onLoad() {
      const res = await this.getComment()
      if (!this.last) {
        this.finished = true
        this.loading = false
        return
      }
      this.getCommentsList = [...this.getCommentsList, ...res]
      // console.log(this.getCommentsList)
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
// 评论区域
.van-image {
  margin-right: 20px;
}
.van-cell__title {
  .top {
    color: #406599;
    font-size: 26px;
    display: flex;
    justify-content: space-between;
    .right {
      color: #000;
      .custom-title {
        margin-left: 10px;
      }
    }
  }
  .mid {
    font-size: 32px;
    color: #222;
    margin: 32px 0;
  }
  .bottom {
    display: flex;
    align-items: center;
    .reply-btn {
      color: #000;
      margin-left: 25px;
    }
    .van-button--mini {
      padding: 3px 30px;
    }
  }
}
</style>
