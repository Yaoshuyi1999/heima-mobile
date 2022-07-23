<template>
  <div class="call">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar :title="title" />
    </div>
    <!-- 原来的 -->
    <van-cell>
      <!-- 左侧图标，也就是头像 -->
      <template #icon>
        <van-image round width="36px" height="36px" :src="item.aut_photo" />
      </template>
      <!-- 左侧内容，也就是信息内容 -->
      <template #title>
        <div class="top">
          {{ item.aut_name }}
          <div class="right">
            <van-icon name="good-job-o" />
            <span class="custom-title">赞</span>
          </div>
        </div>
        <div class="mid">{{ item.content }}</div>
        <div class="bottom">
          {{ item.pubdate | articleDesc }}
          <van-button size="mini" round type="default" class="reply-btn">
            回复 {{ item.reply_count }}
          </van-button>
        </div>
      </template>
    </van-cell>
    <!-- 全部回复 -->
    <div class="all-replay">
      <van-cell title="全部回复" />
    </div>
    <!-- 回复的 -->
    <van-cell>
      <template #icon>
        <van-image round width="36px" height="36px" :src="item.aut_photo" />
      </template>
      <template #title>
        <div class="top">
          {{ item.aut_name }}
          <div class="right">
            <van-icon name="good-job-o" />
            <span class="custom-title">赞</span>
          </div>
        </div>
        <div class="mid">{{ item.content }}</div>
        <div class="bottom">
          {{ item.pubdate | articleDesc }}
          <van-button size="mini" round type="default" class="reply-btn">
            回复 0
          </van-button>
        </div>
      </template>
    </van-cell>
    <van-cell v-for="(item, index) in getCommentsShow" :key="index">
      <!-- 左侧图标，也就是头像 -->
      <template #icon>
        <van-image round width="36px" height="36px" :src="item.aut_photo" />
      </template>
      <!-- 左侧内容，也就是信息内容 -->
      <template #title>
        <div class="top">
          {{ item.aut_name }}
          <div class="right">
            <van-icon name="good-job-o" />
            <span class="custom-title">赞</span>
          </div>
        </div>
        <div class="mid">{{ item.content }}</div>
        <div class="bottom">
          {{ item.pubdate | articleDesc }}
          <van-button size="mini" round type="default" class="reply-btn">
            回复 {{ item.reply_count }}
          </van-button>
        </div>
      </template>
    </van-cell>
    <!-- 评论按钮 -->
    <div class="btn-reply">
      <van-button size="large" round>评论</van-button>
    </div>
  </div>
</template>

<script>
// import { getComments } from '@/api'
import dayjs from '@/utils/dayjs'
export default {
  data() {
    return {
      title: '暂无回复',
      loading: false,
      finished: false
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    getCommentsShow: {
      type: Array,
      required: true
    }
  },
  filters: {
    articleDesc(art) {
      const relativeTime = dayjs(art).fromNow()
      return relativeTime
    }
  }
}
</script>

<style lang="less" scoped>
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
  // 底部评论按钮
  .btn-reply {
    width: 100%;
    height: 100px;
    background-color: #ff69b4;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    .van-button {
      color: #000;
      width: 640px;
      height: 80px;
    }
  }
}
</style>
