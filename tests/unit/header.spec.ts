import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Header from '@/components/Header.vue';
import VueI18n from 'vue-i18n';
import { expect } from 'chai';

describe('Header.vue', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);

  it('shows language selection options', () => {
    const wrapper = shallowMount(Header);
    const txt = wrapper.text();
    expect(txt).include('FI');
    expect(txt).include('EN');
    wrapper.destroy();
  });

  it('allows changing the display language', () => {
    const vm = mount(Header, { localVue }).vm;
    expect(vm.$i18n.locale).eq('en');
    (vm as any).setLanguage('fi');
    expect(vm.$i18n.locale).eq('fi');
    (vm as any).setLanguage('sv');
    expect(vm.$i18n.locale).eq('sv');

    vm.$destroy();
  });

});
