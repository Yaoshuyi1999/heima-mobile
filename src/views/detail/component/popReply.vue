<template>
  <van-popup
    v-model="isReplyShow"
    position="bottom"
    closeable
    close-icon-position="top-left"
    :style="{ height: '100%' }"
  >
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar title="暂无回复" />
    </div>
    <!-- 全部回复 -->
    <div class="all-replay">
      <van-cell title="全部回复" />
    </div>
    <!-- 评论按钮 -->
    <div class="btn-reply">
      <van-button size="large" round>评论</van-button>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: ['isReplyShow']
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
</style>
