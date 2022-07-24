<template>
  <van-cell class="comment">
    <!-- 左侧图标，也就是头像 -->
    <template #icon>
      <van-image
        round
        width="36px"
        height="36px"
        :src="getCommentItem.aut_photo"
      />
    </template>
    <!-- 左侧内容，也就是信息内容 -->
    <template #title>
      <!-- 上 -->
      <div class="top">
        {{ getCommentItem.aut_name }}
        <div class="right" @click="loveFn(getCommentItem.com_id)">
          <van-icon
            :color="isLiking ? '#1989fa' : ''"
            :name="isLiking ? 'good-job' : 'good-job-o'"
          />
          <span class="custom-title">赞</span>
          <span>{{ like_count === 0 ? '' : like_count }}</span>
        </div>
      </div>
      <!-- 中间 -->
      <div class="mid">{{ getCommentItem.content }}</div>
      <!-- 下面 -->
      <div class="bottom">
        {{ getCommentItem.pubdate | articleDesc }}
        <van-button
          size="mini"
          round
          type="default"
          class="reply-btn"
          @click="clickPopFn"
        >
          回复 {{ getCommentItem.reply_count }}
        </van-button>
      </div>
    </template>
  </van-cell>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { addLikeCall, removeLikeCall, getComments } from '@/api'
export default {
  props: {
    getCommentItem: {
      type: Object,
      default: () => ({})
    },
    ind: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isLiking: this.getCommentItem.is_liking,
      isReplyShow: false,
      getReplyList: [],
      replyCount: 0,
      like_count: this.getCommentItem.like_count
      // last: ''
    }
  },
  methods: {
    // 点击回复，弹出回复列表
    async clickPopFn() {
      this.isReplyShow = true
      await this.getReply()
      // console.log(this.getReplyList, 4)
      this.$emit(
        'popFn',
        this.isReplyShow,
        this.ind,
        this.getReplyList,
        this.replyCount
      )
    },
    // 获取评论的评论列表
    async getReply() {
      console.log(1)
      try {
        // console.log(this.last)
        // console.log(this.$route.query.id)
        const res = await getComments({
          type: 'c',
          source: this.getCommentItem.com_id,
          // offset: this.last,
          limit: 5
        })
        // this.last = res.data.data.last_id
        // this.end = res.data.data.end_id
        this.getReplyList = res.data.data.results
        this.replyCount = res.data.data.total_count
        // console.log(this.getReplyList, 1)
        // console.log(this.last)
        console.log(res)
        // return res.data.data.results
      } catch (err) {
        console.log(err)
      }
    },
    // 评论点赞
    async loveFn(comId) {
      try {
        if (this.isLiking) {
          await removeLikeCall(comId)
          this.$toast.success('取消点赞')
          this.like_count = this.like_count - 1
        } else {
          await addLikeCall(comId)
          this.$toast.success('点赞成功')
          this.like_count = this.like_count + 1
        }

        this.isLiking = !this.isLiking

        // this.$forceUpdate()
        // this.$router.go(0)
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
    }
  },
  // 过滤器处理时间
  filters: {
    articleDesc(art) {
      const relativeTime = dayjs(art).fromNow()
      return relativeTime
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
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
}
</style>
