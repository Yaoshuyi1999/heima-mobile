<template>
  <div class="call">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="flag"
    >
      <van-cell v-for="(item, index) in getCommentsList" :key="index">
        <!-- 左侧图标，也就是头像 -->
        <template #icon>
          <van-image round width="36px" height="36px" :src="item.aut_photo" />
        </template>
        <!-- 左侧内容，也就是信息内容 -->
        <template #title>
          <div class="top">
            {{ item.aut_name }}
            <div class="right" @click="loveFn(item.com_id, item.is_liking)">
              <van-icon
                :color="item.is_liking ? '#1989fa' : ''"
                :name="item.is_liking ? 'good-job' : 'good-job-o'"
              />
              <span class="custom-title">赞</span>
            </div>
          </div>
          <div class="mid">{{ item.content }}</div>
          <div class="bottom">
            {{ item.pubdate | articleDesc }}
            <van-button
              size="mini"
              round
              type="default"
              class="reply-btn"
              @click="showFn(index, item.com_id)"
            >
              回复 {{ item.reply_count }}
            </van-button>
            <!-- 弹出层 -->
            <van-popup
              v-model="isReplyShow"
              position="bottom"
              closeable
              close-icon-position="top-left"
              :style="{ height: '100%' }"
            >
              <commentItem
                :item="getCommentsList[showIndex]"
                :getCommentsShow="getCommentsShow"
              ></commentItem>
            </van-popup>
          </div>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import commentItem from './commentItem.vue'
import eventBus from './EventBus'
import { getComments, addLikeCall, removeLikeCall } from '@/api'
import dayjs from '@/utils/dayjs'
export default {
  props: {
    getArticleInfoList: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    commentItem
  },
  created() {
    this.getComment()
    eventBus.$on('send', (getReleaseList) => {
      // console.log(getReleaseList)
      this.getCommentsList.unshift(getReleaseList)
      this.getComment()
    })
  },
  data() {
    return {
      getCommentsList: [],
      getCommentsShow: [], // 弹出层使用
      loading: false,
      finished: false,
      limit: 5,
      last: '',
      lastR: '',
      flag: false,
      isReplyShow: false, // 回复评论的弹层状态
      numReply: 0, // 总评论数
      showIndex: 0,
      liking: false
    }
  },
  methods: {
    // 点击回复按钮
    async showFn(index, comId) {
      this.getRealy(comId)
      this.showIndex = index
      this.isReplyShow = true
    },
    // 获取回复数据
    async getRealy(comId) {
      const resR = await getComments({
        type: 'c',
        source: comId,
        offset: this.lastR
      })
      this.getCommentsShow = resR.data.data.results
    },
    // 获取评论
    async getComment() {
      try {
        // console.log(this.last)
        // console.log(this.$route.query.id)
        const res = await getComments({
          type: 'a',
          source: this.$route.query.id,
          offset: this.last,
          limit: this.limit
        })
        // console.log(res)
        this.numReply = res.data.data.total_count
        eventBus.$emit('sendNum', this.numReply)
        // console.log('评论数' + this.numReply)
        return res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 加载状态
    async onLoad() {
      const res = await this.getComment()
      // console.log(res)
      if (!res.end_id) {
        this.finished = true
        this.loading = false
        return
      }
      this.last = res.last_id
      // console.log(this.last)
      this.getCommentsList = [...this.getCommentsList, ...res.results]
      console.log(this.getCommentsList)
      this.loading = false
    },
    // 评论点赞
    async loveFn(comId, isLiking) {
      try {
        this.liking = isLiking
        if (this.liking) {
          await removeLikeCall(comId)
          this.$toast.success('取消点赞')
        } else {
          await addLikeCall(comId)
          this.$toast.success('点赞成功')
        }

        this.liking = !this.liking
        // this.$forceUpdate()
        this.$router.go(0)
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
// 评论区域
.call {
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
