import DatePicker from '@/components/common/datePicker/DatePicker.vue';
import { expect } from 'chai';
import i18n from '@/locale/i18n';
import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';

describe('DatePicker.vue', () => {
  it('only shows year when option is given', () => {
    const shown = shallowMount(DatePicker, {
      i18n, propsData: {
        showYear: true,
        value: new Date(),
        ariaLabels: [],
      },
    }).vm;
    expect(shown.$el.querySelector('.year')).not.equal(null);
    const hidden = shallowMount(DatePicker, {
      i18n, propsData: {
        showYear: false,
        value: new Date(),
        ariaLabels: [],
      },
    }).vm;
    expect(hidden.$el.querySelector('.year')).equal(null);
  });
  it('has values from 1 to 31 in day selection when a month with 31 days has been selected', async () => {
    const datePicker = shallowMount(DatePicker, {
      i18n, propsData: {
        showYear: true,
        value: null,
        ariaLabels: [],
      },
    });
    // Day selection has a non selectable placeholder value in the beginning
    expect(datePicker.find('.day').findAll('option').length).to.equal(1);

    const yearOption = datePicker.find('.year').findAll('option').at(2).element as HTMLOptionElement;
    yearOption.selected = true;
    datePicker.find('.year').trigger('change');

    const monthOption = datePicker.find('.month').findAll('option').at(1).element as HTMLOptionElement;
    monthOption.selected = true;
    datePicker.find('.month').trigger('change');
    await Vue.nextTick();

    const firstDayOption = datePicker.find('.day').findAll('option').at(1).element as HTMLOptionElement;
    expect(firstDayOption.value).to.equal('1');

    const lastDayOptionIndex = datePicker.find('.day').findAll('option').length - 1;
    const dayOption = datePicker.find('.day').findAll('option').at(lastDayOptionIndex).element as HTMLOptionElement;
    expect(dayOption.value).to.equal('31');
  });
  it('has values from 1 to 29 in day selection when does not show year and February is selected', async () => {
    const datePicker = shallowMount(DatePicker, {
      i18n, propsData: {
        showYear: false,
        value: null,
        ariaLabels: [],
      },
    });
    // Day selection has a non selectable placeholder value in the beginning
    expect(datePicker.find('.day').findAll('option').length).to.equal(1);

    const monthOption = datePicker.find('.month').findAll('option').at(2).element as HTMLOptionElement;
    monthOption.selected = true;
    datePicker.find('.month').trigger('change');
    await Vue.nextTick();

    const firstDayOption = datePicker.find('.day').findAll('option').at(1).element as HTMLOptionElement;
    expect(firstDayOption.value).to.equal('1');

    const lastDayOptionIndex = datePicker.find('.day').findAll('option').length - 1;
    const dayOption = datePicker.find('.day').findAll('option').at(lastDayOptionIndex).element as HTMLOptionElement;
    expect(dayOption.value).to.equal('29');
  });
  it('does not allow choosing a date from the future', async () => {
    const datePicker = shallowMount(DatePicker, {
      i18n, propsData: {
        showYear: true,
        value: null,
        ariaLabels: [],
      },
    });
    const yearOption = datePicker.find('.year').findAll('option').at(1).element as HTMLOptionElement;
    expect(yearOption.value).to.equal(new Date().getFullYear().toString());

    yearOption.selected = true;
    datePicker.find('.year').trigger('change');
    await Vue.nextTick();

    const lastMonthOptionIndex = datePicker.find('.month').findAll('option').length - 1;
    const monthOption = datePicker.find('.month').findAll('option')
      .at(lastMonthOptionIndex).element as HTMLOptionElement;
    expect(monthOption.value).to.equal((new Date().getMonth()).toString());

    monthOption.selected = true;
    datePicker.find('.month').trigger('change');
    await Vue.nextTick();

    const lastDayOptionIndex = datePicker.find('.day').findAll('option').length - 1;
    const dayOption = datePicker.find('.day').findAll('option').at(lastDayOptionIndex).element as HTMLOptionElement;
    expect(dayOption.value).to.equal(new Date().getDate().toString());
  });
});
