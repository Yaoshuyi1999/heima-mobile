import request from '@/utils/request'

// 文章详情
export const getArticleInfo = (id) => {
  return request({
    url: `/v1_0/articles/${id}`
  })
}

// 获取文章评论
export const getComments = (params) => {
  return request({
    url: '/v1_0/comments',
    params
  })
}

// 进行发表评论
export const getRelease = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
