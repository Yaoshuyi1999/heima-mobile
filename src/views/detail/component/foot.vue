<template>
  <div class="footer">
    <!-- 左边-写评论 -->
    <div class="left">
      <div class="content" @click="leaveWordFn">写评论</div>
    </div>
    <van-popup
      v-model="showLeave"
      position="bottom"
      :style="{ height: '18%' }"
      class="popup"
    >
      <van-field
        class="left-field"
        v-model="message"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
      />
      <!-- message的长度等于0的时候disabled -->
      <van-button
        class="right-btn"
        :disabled="message.length === 0"
        @click="onRelease"
      >
        发布
      </van-button>
    </van-popup>
    <!-- 右边-四个按钮 -->
    <div class="right">
      <!-- 评论 -->
      <div class="icon">
        <div class="num">{{ numReply }}</div>
        <van-icon name="comment-o" />
      </div>
      <!-- 收藏 -->
      <div class="icon">
        <van-icon
          :color="getArticleInfoList.is_collected ? '#1989fa' : ''"
          :name="getArticleInfoList.is_collected ? 'star' : 'star-o'"
          @click="onStar"
        />
      </div>
      <!-- 点赞 -->
      <div class="icon">
        <van-icon
          :color="getArticleInfoList.attitude === 1 ? '#1989fa' : ''"
          :name="getArticleInfoList.attitude === 1 ? 'good-job' : 'good-job-o'"
          @click="onGood"
        />
      </div>
      <!--转发 -->
      <div class="icon">
        <van-icon name="share" @click="onShare" />
        <van-share-sheet
          v-model="showShare"
          title="转发"
          :options="options"
          @select="onSelect"
        />
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from './EventBus'
import {
  addCollections,
  removeCollections,
  addLike,
  removeLike,
  getRelease
} from '@/api'
export default {
  props: {
    getArticleInfoList: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showShare: false, // 分享面板的显示状态
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' },
        { name: '二维码', icon: 'qrcode' }
      ], // 分享面板的取值
      // leaveWord: false,
      showLeave: false, // 留言面板的显示状态
      message: '', // 发布留言的初始内容
      getReleaseList: {}, // 发布评论以后，返回的数据
      numReply: 0
    }
  },
  created() {
    eventBus.$on('sendNum', (numReply) => {
      // console.log(numReply + '真的')
      this.numReply = numReply
    })
  },
  methods: {
    // 写评论留言
    leaveWordFn() {
      // 显示留言面板
      this.showLeave = true
    },
    // 发布评论
    async onRelease() {
      try {
        // console.log(this.getArticleInfoList.art_id + 'qq')
        // console.log(this.message + 'ww')
        const res = await getRelease({
          target: this.getArticleInfoList.art_id,
          content: this.message
        })
        this.getReleaseList = res.data.data.new_obj
        console.log(this.getReleaseList)
        this.showLeave = false
        this.message = ''
        // 跨组件传值，发送方
        eventBus.$emit('send', this.getReleaseList)
        this.$toast.success('发布成功')
        this.getArticleInfoList.comm_count =
          this.getArticleInfoList.comm_count + 1
      } catch (err) {
        console.log(err)
        this.$toast.success('发布失败')
      }
    },
    // 收藏
    async onStar() {
      try {
        const artId = this.getArticleInfoList.art_id
        console.log(artId)
        if (this.getArticleInfoList.is_collected) {
          await removeCollections(artId)
          // console.log(x)
          this.$toast.success('取消收藏')
        } else {
          await addCollections(artId)
          this.$toast.success('收藏成功')
        }

        this.getArticleInfoList.is_collected =
          !this.getArticleInfoList.is_collected
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
    },
    // 点赞
    async onGood() {
      try {
        const artId = this.getArticleInfoList.art_id
        if (this.getArticleInfoList.attitude === 1) {
          await removeLike(artId)
          this.$toast.success('取消点赞')
          this.getArticleInfoList.attitude = -1
        } else {
          await addLike(artId)
          this.$toast.success('点赞成功')
          this.getArticleInfoList.attitude = 1
        }
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
    },
    // 转发
    async onShare() {
      try {
        this.showShare = true
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
    },
    // 点击转发面板内的内容时候跳出的信息
    onSelect(option) {
      this.$toast(option.name)
      this.showShare = false
    }
  }
}
</script>

<style lang="less" scoped>
//底部导航
.footer {
  z-index: 999;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88px;
  display: flex;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .left {
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      width: 278px;
      height: 46px;
      border: 1px solid #eee;
      border-radius: 23px;
      text-align: center;
      line-height: 46px;
      font-size: 30px;
      color: #a7a7a7;
    }
  }
  .right {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex: 1.2;
    text-align: center;
    .icon {
      flex: 1;
      position: relative;
      .num {
        position: absolute;
        top: -6px;
        right: 16px;
        width: 28px;
        height: 28px;
        background-color: #e22829;
        border-radius: 50%;
        text-align: center;
        line-height: 28px;
        font-size: 24px;
        color: #fff;
        z-index: 1;
      }
      .van-icon {
        font-size: 40px;
        color: #777;
      }
    }
  }
}
.popup {
  height: 18%;
  padding: 32px 0 32px 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .left-field {
    width: 82%;
    position: relative;
    background-color: #f5f7f9;
    .van-field__word-limit {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .right-btn {
    border: none;
    .van-button__text {
      color: #6ba3d8;
    }
  }
}
</style>
