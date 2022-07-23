<template>
  <div class="btn">
    <van-button
      round
      type="info"
      @click="follow"
      v-if="!getArticleInfoList.is_followed"
    >
      <van-icon name="plus" />
      关注
    </van-button>
    <van-button round @click="follow" v-else> 已关注 </van-button>
  </div>
</template>

<script>
import { addFollow, removeFollow } from '@/api'
export default {
  props: {
    getArticleInfoList: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  methods: {
    // 添加关注和取消关注
    async follow() {
      try {
        const autId = this.getArticleInfoList.aut_id
        console.log(autId)
        // 判断是否已经关注
        if (this.getArticleInfoList.is_followed) {
          await removeFollow(autId)
          this.$toast.success('取消关注')
        } else {
          await addFollow(autId)
          this.$toast.success('成功关注')
        }

        // 是否关注的情况更改
        this.getArticleInfoList.is_followed =
          !this.getArticleInfoList.is_followed
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn {
  flex: 3;
  .van-button--round {
    float: right;
    width: 170px;
    height: 58px;
  }
}
</style>
