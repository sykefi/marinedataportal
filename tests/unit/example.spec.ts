import { shallowMount } from '@vue/test-utils';
import Header from '@/components/Header.vue';

describe('Header.vue', () => {
  it('shows test message', () => {
    const wrapper = shallowMount(Header);
    expect(wrapper.text()).toContain('Meritietoportaalin latauspalvelun kehitysversio');
  });
});
