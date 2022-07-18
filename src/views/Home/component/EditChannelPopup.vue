<template>
  <van-popup
    v-model="isShow"
    position="bottom"
    :style="{ height: '100%' }"
    closeable
    close-icon-position="top-left"
  >
    <div class="popupMain">
      <!-- 我的频道 -->
      <div class="my-channel">
        <!-- 我的频道标题 -->
        <van-cell title="我的频道">
          <van-button size="small" round class="edit-btn">编辑</van-button>
        </van-cell>

        <!--我的频道-->
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="item in myChannels"
            :key="item.id"
            :text="item.name"
          >
            <template #icon> <van-icon name="cross" /> </template>
          </van-grid-item>
        </van-grid>
      </div>

      <!-- 推荐频道 -->
      <div class="recommend-channel">
        <!--推荐频道的标题-->
        <van-cell title="推荐频道"></van-cell>

        <!--推荐频道-->
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="item in recommendChannels"
            :key="item.id"
            :text="item.name"
            icon="plus"
          >
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
// 引入API
import { getAllChannels } from '@/api'
export default {
  props: {
    myChannels: {
      type: Array,
      require: true
    }
  },
  created() {
    this.getAllChannels()
  },
  data() {
    return {
      isShow: false,
      allChannels: []
    }
  },
  methods: {
    // 获取所有频道列表并处理数据
    async getAllChannels() {
      const { data } = await getAllChannels()
      //   console.log(data)
      this.allChannels = data.data.channels
    }
  },
  computed: {
    recommendChannels() {
      // 在所有的频道中 减去 我的频道
      // 在所有的频道中 筛选掉 我的频道
      return this.allChannels.filter((item) => {
        // 所有频道的每一项
        // const result = this.myChannels.find((i) => i.id === item.id)
        // if (result) {
        //   return false
        // } else {
        //   return true
        // }
        return !this.myChannels.find((i) => i.id === item.id)
      })
    }
  }
}
</script>

<style scoped lang="less">
.popupMain {
  padding-top: 100px;
  //按钮的样式
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 0.02667rem solid red;
  }

  :deep(.van-grid-item__content) {
    width: 162px;
    height: 86px;
    background-color: #f4f5f6;
  }
  //   我的频道的样式
  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;

        .van-icon-cross {
          position: absolute;
          top: -20px;
          right: -15px;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          //   line-height: 0.32rem;
          transform: scale(0.6, 0.6);
        }
      }
    }
  }

  // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;
      padding-left: 10px;

      .van-grid-item__icon {
        font-size: 0.4rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}
</style>
