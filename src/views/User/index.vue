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
      <input
        type="file"
        hidden
        ref="file"
        accept=".png,.jpg"
        @change="onFileChange"
      />
      <van-cell title="头像" is-link @click="$refs.file.click()">
        <van-image
          class="avatar"
          cover
          round
          width="30"
          height="30"
          :src="userPhoto"
        />
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

      <!-- 弹层头像 -->
      <van-popup v-model="imageShow">
        <ImagePopup
          :userImage="userImage"
          :imageShow.sync="imageShow"
          :updatePhoto.sync="userPhoto"
        ></ImagePopup>
      </van-popup>
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
import ImagePopup from './component/imagePopup'
import dayjs from '@/utils/dayjs'
import { getUserProfile, getMyProfile } from '@/api'
export default {
  components: {
    ImagePopup
  },
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
      currentDate: new Date(),
      show: false,
      photo: '',
      // 头像部分
      userPhoto: '',
      status: 0,
      imageShow: false,
      userImage: null
    }
  },
  created() {
    this.getUserProfile()
  },
  // mounted() {
  //   this.$refs.file.addEventListener('change', (e) => {
  //     // e.target 触发事件的元素
  //     // 图片的src能识别什么?
  //     //  - 图片相对/绝对路径
  //     //  - base64 DateUrl
  //     //  - file,blob对象的url
  //     const file = e.target.files[0]
  //     // file = URL.createObjectURL(file) // 将file对象转换成图片可识别的url
  //     const fr = new FileReader()
  //     fr.readAsDataURL(file)

  //     fr.onload = (e) => {
  //       this.photo = e.target.result
  //       this.show = true
  //     }
  //   })
  // },
  methods: {
    // 获取用户的资料
    async getUserProfile() {
      //   console.log(11)
      try {
        const res = await getUserProfile()
        this.userProfile = res.data.data
        this.message = this.userProfile.name
        this.userPhoto = this.userProfile.photo
        // console.log(res)
      } catch (err) {
        this.$toast.fail('获取信息失败')
      }
    },
    // 提交头像的修改
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob 数据
      this.userImage = window.URL.createObjectURL(file)
      // 展示预览图片弹出层
      this.imageShow = true
      // file-input 如果选了同一个文件不会触 change 事件
      // 解决办法就是每次使用完毕,把它的value 清空
      this.$refs.file.value = ''
    },
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
/deep/.cropper-container {
  width: 750px !important;
  height: 750px !important;
}
</style>
