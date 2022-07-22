<template>
  <div @click="articlesDate(articleInfo.art_id)">
    <!-- 渲染无图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 0"
      :title="articleInfo.title"
      :label="articleDesc"
    />
    <!-- 渲染一张图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 1"
      :title="articleInfo.title"
      :label="articleDesc"
    >
      <van-image
        width="3rem"
        height="2rem"
        :src="articleInfo.cover.images[0]"
      />
    </van-cell>
    <!-- 渲染三张图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 3"
      :title="articleInfo.title"
      :label="articleDesc"
    >
      <template #label>
        <div>
          <van-image
            v-for="(item, key) in articleInfo.cover.images"
            :key="key"
            width="3rem"
            height="2rem"
            :src="item"
          />
        </div>
        <span>{{ articleDesc }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  props: {
    articleInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    articleDesc() {
      const art = this.articleInfo
      const relativeTime = dayjs(art.pubdate).fromNow()
      return `${this.articleInfo.aut_name} ${this.articleInfo.comm_count}评论 ${relativeTime}`
    }
  },
  methods: {
    // 点击跳转详情页
    articlesDate(id) {
      console.log(id)
      this.$router.push({
        // path: `/detail/${id}`
        name: 'detail',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style></style>
