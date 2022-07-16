<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round> <van-icon name="search" />搜索 </van-button>
      </template>
    </van-nav-bar>
    <!-- tabs选项卡 -->
    <van-tabs v-model="active" swipeable>
      <van-tab
        v-for="item in myChannels"
        :key="item.id"
        :title="item.name"
      >
      <ArticleList :id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 更多按钮 -->
    <span class="toutiao toutiao-gengduo"></span>
  </div>
</template>

<script>
import { getMyChannels } from '@/api/channel'
import ArticleList from './component/ArticlList.vue'
export default {
  components: {
    ArticleList
  },
  created() {
    this.getMyChannels()
  },
  data() {
    return {
      active: 2,
      myChannels: {}
    }
  },
  methods: {
    async getMyChannels() {
      try {
        // const { data } = await getMyChannels()
        // this.myChannels = data.data.channels
        const res = await getMyChannels()
        this.myChannels = res.data.data.channels
        // console.log(res)
      } catch (err) {
        this.$toast.fail('请重新获取频道列表')
      }
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}

//tabs选项卡
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
</style>
