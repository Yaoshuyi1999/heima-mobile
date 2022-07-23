<template>
  <div class="article">
    <!--头部 -->
    <van-nav-bar
      class="navbar"
      title="黑马头条"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <!-- 中间内容 -->
    <div class="middle">
      <!-- 标题 -->
      <h1>{{ getArticleInfoList.title }}</h1>
      <!-- 作者栏 -->
      <div class="author">
        <div class="pic">
          <van-image
            round
            width="35"
            height="35"
            :src="getArticleInfoList.aut_photo"
          />
        </div>
        <div class="name-time">
          <div class="name">{{ getArticleInfoList.aut_name }}</div>
          <div>{{ getArticleInfoList.pubdate | articleDesc }}</div>
        </div>
        <Follow :getArticleInfoList="getArticleInfoList"></Follow>
      </div>
      <!-- 文章内容 -->
      <article
        v-html="getArticleInfoList.content"
        v-highlight
        class="markdown-body"
        style="text-align: left"
        ref="contentRef"
      ></article>
      <!-- 正文结束 -->
      <van-divider class="end">正文结束</van-divider>
      <!-- 评论区域 -->
      <Comment :getArticleInfoList="getArticleInfoList"></Comment>
    </div>
    <!-- 底部导航 -->
    <Foot :getArticleInfoList="getArticleInfoList"></Foot>
  </div>
</template>

<script>
// 引入插件的
import Follow from './component/follow.vue'
import Foot from './component/foot.vue'
import Comment from './component/comment.vue'
// 引入几个组件插件的
import { ImagePreview } from 'vant'
import dayjs from '@/utils/dayjs'
import '../../../node_modules/github-markdown-css/github-markdown.css'
// 引入请求数据的
import { getArticleInfo } from '@/api'
export default {
  created() {
    this.getArticleInfo()
  },
  components: {
    Follow,
    Comment,
    Foot
  },
  data() {
    return {
      getArticleInfoList: {}
    }
  },
  methods: {
    // 返回
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取文章内容
    async getArticleInfo() {
      try {
        // console.log(this.$router)
        // console.log(this.$route.query.id)
        const res = await getArticleInfo(this.$route.query.id)
        // console.log(res)
        this.getArticleInfoList = res.data.data
        // console.log(this.getArticleInfoList, 1)
        // 文章内容渲染完成再拿到图片地址
        this.$nextTick(() => {
          this.previewImg()
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 获取文章内容的所有的图片地址,点击获取
    previewImg() {
      // console.log(this.$refs.contentRef)
      const contentEl = this.$refs.contentRef
      const allImg = contentEl.querySelectorAll('img')
      // console.log(allImg)
      const images = []
      allImg.forEach((element, index) => {
        images.push(element.currentSrc)
        // console.log('图片' + element.currentSrc)
        element.onclick = () => {
          ImagePreview({
            images,
            startPosition: index,
            closeable: true
          })
        }
      })
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
// 头部
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  /deep/.van-icon {
    color: #fff;
  }
}
// 中间内容
.middle {
  margin-bottom: 90px;
  margin-top: 92px;
  // 标题
  h1 {
    font-size: 40px;
    padding: 50px 32px;
    color: #3a3a3a;
    margin: 0;
  }
  // 作者栏
  /deep/.author {
    height: 84px;
    display: flex;
    padding: 0 32px;
    align-items: center;
    .pic {
      flex: 1;
    }
    .name-time {
      flex: 3;
      font-size: 24px;
      color: #b7b7b7;
      .name {
        color: #3a3a3a;
        margin-bottom: 20px;
      }
    }
  }
  // 文章内容
  .markdown-body {
    padding: 55px 32px;
  }
  // 正文结束
  .end {
    margin: 32px 0;
    font-size: 28px;
    color: #969799;
    display: flex;
    justify-content: center;
  }
}
</style>
