<template>
  <van-popup
    :value="isReplyShow"
    position="bottom"
    closeable
    @click-close-icon="closeFn"
    close-icon-position="top-left"
    :style="{ height: '100%' }"
  >
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar :title="`${replyCount}条回复`" fixed />
    </div>
    <!-- 楼主 -->
    <CommentItem
      :getCommentItem="getCommentsList[ReplyIndex]"
      :ind="ReplyIndex"
    ></CommentItem>
    <!-- <CommentItem></CommentItem> -->
    <!-- 全部回复 -->
    <div class="all-replay">
      <van-cell title="全部回复" />
    </div>
    <!-- 回复的列表 -->
    <CommentItem
      v-for="(item, index) in getReplyList"
      :key="index"
      :getCommentItem="item"
      :ind="index"
    ></CommentItem>
    <!-- 评论按钮 -->
    <div class="btn-reply">
      <van-button size="large" round @click="showLeave = true">评论</van-button>
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
    </div>
  </van-popup>
</template>

<script>
import CommentItem from './commentItem.vue'
import { getRelease } from '@/api'
export default {
  data() {
    return {
      showLeave: false, // 留言面板的显示状态
      message: '' // 发布留言的初始内容
    }
  },
  props: {
    replyCount: { type: Number, default: 0 },
    isReplyShow: {
      // 弹层开关的状态
      type: Boolean,
      required: true
    },
    ReplyIndex: {
      // 点击时候，此评论的下标
      type: Number,
      required: true
    },
    getCommentsList: {
      // list传过来的评论列表
      type: Array,
      required: true
    },
    artId: {
      type: String,
      required: true
    },
    getReplyList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CommentItem
  },
  methods: {
    // 点击弹层关闭的时候
    closeFn() {
      this.$emit('close', !this.isReplyShow)
    },
    // 对评论  发布评论
    async onRelease() {
      try {
        // console.log(this.getArticleInfoList.art_id + 'qq')
        // console.log(this.message + 'ww')
        const res = await getRelease({
          target: this.getCommentsList[this.ReplyIndex].com_id,
          content: this.message,
          art_id: this.artId
        })
        // console.log(res, 2)
        // this.getReleaseList = res.data.data.new_obj
        // console.log(this.getReleaseList)
        this.showLeave = false
        this.message = ''
        this.$parent.$parent.getReplyList.unshift(res.data.data.new_obj)
        // console.log(res.data.data.new_obj)
        // this.$parent.getReplyList.unshift(res.data.data.new_obj)
        // 用了非法的方式，直接改变了父组件传的值
        // this.getArticleInfoList.comm_count =
        //   this.getArticleInfoList.comm_count + 1
      } catch (err) {
        console.log(err)
        this.$toast.success('发布失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
