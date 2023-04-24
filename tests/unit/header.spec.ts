import { mount, shallowMount } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader.vue'
import { describe, it, expect } from 'vitest'
import i18n from '@/locale/i18n'
import { createPinia, setActivePinia } from 'pinia'

describe('AppHeader.vue', () => {
  it('shows language selection options', () => {
    const wrapper = shallowMount(AppHeader, { global: { plugins: [i18n] } })
    const txt = wrapper.text()
    expect(txt).include('FI')
    expect(txt).include('EN')
  })

  it('allows changing the display language', async () => {
    setActivePinia(createPinia())

    const wrapper = await mount(AppHeader, { global: { plugins: [i18n] } })
    expect(i18n.global.locale).eq('en')
    await wrapper.find('#fi-link').trigger('click')
    expect(i18n.global.locale).eq('fi')
    await wrapper.find('#sv-link').trigger('click')
    expect(i18n.global.locale).eq('sv')
  })
})
