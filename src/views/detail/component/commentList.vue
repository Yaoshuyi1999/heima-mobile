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
        :ind="index"
        :getCommentItem="item"
        @popFn="popFn"
      ></CommentItem>
      <PopReply
        :isReplyShow="ReplyShow"
        :ReplyIndex="ReplyIndex"
        :getCommentsList="getCommentsList"
        :getReplyList="getReplyList"
        :replyCount="replyCount"
        @close="ReplyShow = $event"
        :artId="$route.query.id"
      ></PopReply>
    </van-list>
  </div>
</template>

<script>
import CommentItem from './commentItem.vue'
import PopReply from './popReply.vue'
import eventBus from './EventBus'
// import dayjs from '@/utils/dayjs'
import { getComments } from '@/api'
export default {
  data() {
    return {
      getCommentsList: [], // 评论列表的数据
      getReplyList: [],
      flag: false, // 进入页面会直接请求两次数据的问题
      loading: false, // 加载中，请求完成渲染好一次数据，会自动变为true
      finished: false, // 表示是否结束列表
      last: '', // 每次请求评论列表得到的最后一个值
      ReplyShow: false,
      ReplyIndex: 0,
      end: '',
      replyCount: 0,
      like_count: 0
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
    CommentItem,
    PopReply
  },
  async created() {
    const res = await this.getComment()
    this.getCommentsList = [...this.getCommentsList, ...res]

    eventBus.$on('send', (getReleaseList) => {
      this.getCommentsList.unshift(getReleaseList)
    })
  },
  methods: {
    // 子传父
    popFn(isReplyShow, ind, getReplyList, replyCount) {
      this.ReplyShow = isReplyShow
      this.ReplyIndex = ind
      this.getReplyList = getReplyList
      this.replyCount = replyCount
      // console.log(this.getReplyList, 0)
    },
    // 获取评论列表
    async getComment() {
      try {
        // console.log(this.last)
        // console.log(this.$route.query.id)
        const res = await getComments({
          type: 'a',
          source: this.$route.query.id,
          offset: this.last,
          limit: 10
        })
        this.last = res.data.data.last_id
        this.end = res.data.data.end_id
        // this.like_count=res.data.data.results.like_count
        // console.log(this.last)
        // console.log(res)
        return res.data.data.results
      } catch (err) {
        console.log(err)
      }
    },
    // 滚动条触底后自动触发的，重新获取新的数据
    async onLoad() {
      const res = await this.getComment()
      this.getCommentsList = [...this.getCommentsList, ...res]
      if (!this.end) {
        this.finished = true
        this.loading = false
        return
      }
      console.log(this.getCommentsList, 2)
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
