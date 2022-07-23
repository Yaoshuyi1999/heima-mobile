<template>
  <div class="personInfo">
    <!--头部 -->
    <van-nav-bar
      class="navbar"
      title="个人信息"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- 内容 -->
    <van-cell-group class="group">
      <van-cell title="头像" value="内容" is-link>
        <template #default>
          <van-image
            class="headPic"
            cover
            round
            width="30"
            height="30"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
        </template>
      </van-cell>
      <!-- 昵称 -->
      <van-cell
        title="昵称"
        :value="userProfile.name"
        is-link
        @click="isPopName = true"
      />
      <!-- 性别 -->
      <van-cell
        title="性别"
        :value="userProfile.gender ? '女' : '男'"
        is-link
        @click="isPopSex = true"
      />
      <van-cell
        title="生日"
        :value="userProfile.birthday"
        is-link
        @click="isPopBirthday = true"
      />

      <!-- 弹层昵称 -->
      <van-popup v-model="isPopName" style="height: 100%" position="bottom">
        <van-nav-bar
          title="更新昵称"
          left-text="取消"
          right-text="保存"
          @click-left="isPopName = false"
          @click-right="popName"
        />
        <van-field
          v-model="message"
          autosize
          type="textarea"
          maxlength="7"
          placeholder="请输入新的昵称"
          show-word-limit
        />
      </van-popup>
      <!-- 弹层性别 -->
      <van-popup v-model="isPopSex" style="height: 45%" position="bottom">
        <van-picker
          title="性别"
          show-toolbar
          :columns="columns"
          @cancel="isPopSex = false"
          @confirm="onConfirmSex"
        />
      </van-popup>
      <!-- 生日弹层 -->
      <van-popup v-model="isPopBirthday" style="height: 45%" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="isPopBirthday = false"
          @confirm="onConfirmBirthday"
        />
      </van-popup>
    </van-cell-group>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { getUserProfile, getMyProfile } from '@/api'
export default {
  data() {
    return {
      userProfile: {},
      message: '',
      isPopName: false, // 昵称的弹层
      isPopSex: false, // 性别的弹层
      columns: ['男', '女'],
      isPopBirthday: false, // 生日的弹层
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()
    }
  },
  created() {
    this.getUserProfile()
  },
  methods: {
    // 获取用户的资料
    async getUserProfile() {
      //   console.log(11)
      try {
        const res = await getUserProfile()
        this.userProfile = res.data.data
        this.message = this.userProfile.name
        // console.log(res)
      } catch (err) {
        this.$toast.fail('获取信息失败')
      }
    },
    // 提交头像的修改
    // 提交昵称的修改
    async popName() {
      try {
        this.isPopName = false
        // console.log(this.message)
        const res = await getMyProfile({
          name: this.message
        })
        this.getUserProfile()
        // this.getMyProfile = res.data.data
        // console.log(res)
      } catch (err) {
        this.$toast.fail('修改信息失败')
      }
    },
    // 提交性别的修改
    async onConfirmSex(value, index) {
      try {
        this.isPopSex = false
        const res = await getMyProfile({
          gender: index
        })
        this.getUserProfile()
      } catch (err) {
        this.$toast.fail('修改信息失败')
      }
    },
    // 提交生日的修改
    async onConfirmBirthday() {
      //   console.log(this.currentDate)
      try {
        this.isPopBirthday = false
        const res = await getMyProfile({
          birthday: dayjs(this.currentDate).format('YYYY-MM-DD')
        })
        this.getUserProfile()
      } catch (err) {
        this.$toast.fail('修改信息失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.personInfo {
  background-color: #f5f7f9;
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
  //   内容
  .group {
    margin-top: 96px;
  }
}
</style>
