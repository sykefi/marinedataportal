import DatePicker from '@/components/common/datePicker/DatePicker.vue';
import { expect } from 'chai';
import i18n from '@/locale/i18n';
import { mount } from '@vue/test-utils';


describe('DatePicker.vue', () => {
  it('only shows year when option is given', () => {
    const shown = mount(DatePicker, {
      i18n, propsData: {
        showYear: true,
        value: new Date(),
        ariaLabels: [],
      },
    }).vm;
    expect(shown.$el.querySelector('.year')).not.equal(null);
    const hidden = mount(DatePicker, {
      i18n, propsData: {
        showYear: false,
        value: new Date(),
        ariaLabels: [],
      },
    }).vm;
    expect(hidden.$el.querySelector('.year')).equal(null);
  });
});
