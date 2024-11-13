import { mount } from '@vue/test-utils'
import CameraCapture from '~/components/CameraCapture.vue'

describe('CameraCapture', () => {
  test('devrait émettre un événement photo-taken', async () => {
    const wrapper = mount(CameraCapture)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('photo-taken')).toBeTruthy()
  })
}) 