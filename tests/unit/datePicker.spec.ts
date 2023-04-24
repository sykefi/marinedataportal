import DatePicker from '@/components/common/DatePicker.vue'
import { describe, it, expect } from 'vitest'
import i18n from '@/locale/i18n'
import { shallowMount } from '@vue/test-utils'

describe('DatePicker.vue', () => {
  it('only shows year when option is given', () => {
    const shown = shallowMount(DatePicker, {
      global: { plugins: [i18n] },
      propsData: {
        showYear: true,
        modelValue: new Date(),
        ariaLabels: ['', '', ''],
      },
    })
    const yearSelect = shown.find('.year')
    expect(yearSelect.exists()).toBe(true)
    const hidden = shallowMount(DatePicker, {
      global: { plugins: [i18n] },
      propsData: {
        showYear: false,
        modelValue: new Date(),
        ariaLabels: ['', '', ''],
      },
    })
    const hiddenSelect = hidden.find('.year')
    expect(hiddenSelect.exists()).toBe(false)
  })
  it('has values from 1 to 31 in day selection when a month with 31 days has been selected', async () => {
    const datePicker = await shallowMount(DatePicker, {
      global: { plugins: [i18n] },
      propsData: {
        showYear: true,
        modelValue: null,
        ariaLabels: ['', '', ''],
      },
    })
    // Day selection has a non selectable placeholder value in the beginning
    expect(datePicker.find('.day').findAll('option').length).to.equal(1)

    const yearOption = datePicker.find('.year').findAll('option')?.at(2)
    expect(yearOption?.element.value).to.equal(
      (new Date().getFullYear() - 1).toString()
    )
    await yearOption?.setSelected()

    const monthOptions = datePicker.find('.month').findAll('option')
    const monthOption = monthOptions.at(1)
    expect(monthOption?.element.value).to.equal('0')
    await monthOption?.setSelected()

    const dayOptions = datePicker.find('.day').findAll('option')
    const firstDayOption = dayOptions.at(1)
    expect(firstDayOption?.element.value).to.equal('1')

    const lastDayOptionIndex = dayOptions.length - 1
    const lastDayOption = dayOptions.at(lastDayOptionIndex)
    expect(lastDayOption?.element.value).to.equal('31')
  })
  it('has values from 1 to 29 in day selection when does not show year and February is selected', async () => {
    const datePicker = await shallowMount(DatePicker, {
      global: { plugins: [i18n] },
      propsData: {
        showYear: false,
        modelValue: null,
        ariaLabels: ['', '', ''],
      },
    })
    // Day selection has a non selectable placeholder value in the beginning
    expect(datePicker.find('.day').findAll('option').length).to.equal(1)

    const monthOptions = datePicker.find('.month').findAll('option')
    const monthOption = monthOptions.at(2)
    expect(monthOption?.element.value).to.equal('1')
    await monthOption?.setSelected()

    const dayOptions = datePicker.find('.day').findAll('option')
    const firstDayOption = dayOptions.at(1)
    expect(firstDayOption?.element.value).to.equal('1')

    const lastDayOptionIndex = dayOptions.length - 1
    const lastDayOption = dayOptions?.at(lastDayOptionIndex)
    expect(lastDayOption?.element.value).to.equal('29')
  })
  it.todo('does not allow choosing a date from the future', async () => {
    const datePicker = await shallowMount(DatePicker, {
      global: { plugins: [i18n] },
      propsData: {
        showYear: true,
        modelValue: null,
        ariaLabels: ['', '', ''],
      },
    })
    const yearOption = datePicker.find('.year').findAll('option').at(1)
    expect(yearOption?.element.value).to.equal(
      new Date().getFullYear().toString()
    )

    await yearOption?.setSelected()

    const monthOptions = datePicker.find('.month').findAll('option')
    const lastMonthOptionIndex = monthOptions.length - 1
    const monthOption = monthOptions?.at(lastMonthOptionIndex)
    expect(monthOption?.element.value).to.equal(
      new Date().getMonth().toString()
    )

    await monthOption?.setSelected()

    const dayOptions = datePicker.find('.day').findAll('option')
    const lastDayOptionIndex = dayOptions.length - 1
    const dayOption = dayOptions?.at(lastDayOptionIndex)
    expect(dayOption?.element.value).to.equal(new Date().getDate().toString())
  })
})
