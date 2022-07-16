<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar class="navbar" title="登录" @click-left="backToPrePage">
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>

    <!-- 手机号、验证码表单 -->
    <van-form @submit="login" class="form" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        type="number"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #left-icon>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        type="number"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <!-- 左侧字体图标 -->
        <template #left-icon>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <!-- 右侧验证码图标 -->
        <template #right-icon>
          <!-- 倒计时 -->
          <van-count-down
            v-if="isShowCountDown"
            :time="60 * 1000"
            @finish="isShowCountDown = false"
          />
          <!-- 发送验证码 -->
          <van-button
            v-else
            size="small"
            text="获取验证码"
            class="code-btn"
            @click="sendCode"
            native-type="button"
          ></van-button>
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 引入api
import { login, sendCode } from '@/api/user'
// 引入校验规则
import { mobileRules, codeRules } from './rules'
export default {
  name: 'Login',

  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules: codeRules,
      isShowCountDown: false
    }
  },

  mounted() {},

  methods: {
    backToPrePage() {
      this.$router.back()
    },
    async login() {
      // #region
      // loading
      this.$toast.loading({
        message: '不要着急，加载中..',
        // loading时候，禁止点击页面
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        // 存储token
        this.$store.commit('setUser', res.data.data)
        // console.log(res)
        // 提示成功
        this.$toast.success('登录成功')
        this.$router.push('/profile')
      } catch (error) {
        // 拿到后端状态码
        const status = error.response.status
        // 默认失败消息
        let message = '登入错误，请刷新~'
        if (status === 400) {
          message = error.response.data.message
        }
        this.$toast.fail(message)
      }
    },
    // 发送验证码
    async sendCode() {
      try {
        await this.$refs.form.validate('mobile')
        await sendCode(this.mobile)
        this.isShowCountDown = true
      } catch (error) {
        if (!error.response) {
          this.$toast.fail('手机号格式不正确')
        } else {
          const status = error.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(error.response.data.message)
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 导航栏样式
// :deep 穿透 scoped 样式
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon-cross {
    color: #fff;
  }
}

// 表单样式
.form {
  .toutiao {
    font-size: 37px;
    color: #666;
  }

  .van-button {
    background-color: #6db4fb;
    font-size: 30px;
    border: none;
  }
  .code-btn {
    background-color: #ededed;
    width: 158px;
    height: 46px;
    line-height: 36px;
    font-size: 22px;
    color: #666;
    border-radius: 23px;
  }
}
</style>
