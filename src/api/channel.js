import request from '@/utils/request'

export const getMyChannels = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}
