<template>
  <div>
    <SelectionHeader :header="$t('$timeSpanSelectionTitle')" />
    <div class="title">
      <h3 aria-hidden="true">
        {{ $t('$timeSpan') }}
      </h3>
      <div class="with-details">
        <h3 aria-hidden="true">
          {{ $t('$period') }}
        </h3>
        <DetailsButton :content-key="$t('$periodInfoText')" />
      </div>
    </div>
    <div class="title sub">
      <h4 aria-hidden="true">
        {{ $t('$startTimeSpan') }}
      </h4>
      <h4 aria-hidden="true">
        {{ $t('$endTimeSpan') }}
      </h4>
      <h4 aria-hidden="true">
        {{ $t('$startPeriod') }}
      </h4>
      <h4 aria-hidden="true">
        {{ $t('$endPeriod') }}
      </h4>
    </div>
    <div class="content">
      <DatePicker
        v-model="timeSpanStart"
        :aria-labels="[
          $t('$timeSpanStartDay'),
          $t('$timeSpanStartMonth'),
          $t('$timeSpanStartYear'),
        ]"
        :error="timeSpanStartError"
      />
      <b>–</b>
      <DatePicker
        v-model="timeSpanEnd"
        :aria-labels="[
          $t('$timeSpanEndDay'),
          $t('$timeSpanEndMonth'),
          $t('$timeSpanEndYear'),
        ]"
        :error="timeSpanEndError"
      />
      <p />
      <DatePicker
        v-model="periodStart"
        :show-year="false"
        :aria-labels="[$t('$periodStartDay'), $t('$periodStartMonth')]"
        :emptied="periodEmptied"
        :error="periodStartError"
      />
      <b>–</b>
      <DatePicker
        v-model="periodEnd"
        :show-year="false"
        :aria-labels="[$t('$periodEndDay'), $t('$periodEndMonth')]"
        :emptied="periodEmptied"
        :error="periodEndError"
      />
      <EmptySelectionButton
        :content-key="$t('$emptyPeriodSelection')"
        @empty-selection="emptyPeriodSelection"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SelectionHeader from '@/components/common/SelectionHeader.vue'
import DetailsButton from '@/components/common/DetailsButton.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import EmptySelectionButton from '@/components/common/EmptySelectionButton.vue'
import { defineComponent } from 'vue'
import { useMainStateStore } from '@/stores/mainStateStore'
import { mapStores } from 'pinia'
import { useSearchParameterStore } from '@/stores/searchParameterStore'
import { DatePickerResult } from '@/components/common/DatePicker.vue'

export default defineComponent({
  components: {
    SelectionHeader,
    DetailsButton,
    DatePicker,
    EmptySelectionButton,
  },
  data() {
    return {
      periodEmptied: false,
    }
  },
  computed: {
    ...mapStores(useMainStateStore, useSearchParameterStore),
    timeSpanStart: {
      get() {
        return this.searchParameterStore.timeSpanStart
      },
      set(payload: DatePickerResult | null) {
        this.searchParameterStore.setTimeSpanStart(payload)
      },
    },
    timeSpanEnd: {
      get() {
        return this.searchParameterStore.timeSpanEnd
      },
      set(payload: DatePickerResult) {
        this.searchParameterStore.setTimeSpanEnd(payload)
      },
    },
    periodStart: {
      get() {
        return this.searchParameterStore.periodStart
      },
      set(payload: DatePickerResult | null) {
        this.searchParameterStore.setPeriodStart(payload)
      },
    },
    periodEnd: {
      get() {
        return this.searchParameterStore.periodEnd
      },
      set(payload: DatePickerResult | null) {
        this.searchParameterStore.setPeriodEnd(payload)
      },
    },
    timeSpanStartError() {
      return (
        this.mainStateStore.isError('$missingTimeSpanStart') ||
        this.mainStateStore.isError('$timeSpanStartAfterTimeSpanEnd')
      )
    },
    timeSpanEndError() {
      return (
        this.mainStateStore.isError('$missingTimeSpanEnd') ||
        this.mainStateStore.isError('$timeSpanStartAfterTimeSpanEnd')
      )
    },
    periodEndError() {
      return (
        this.mainStateStore.isError('$missingPeriodEnd') ||
        this.mainStateStore.isError('$incompletePeriodEnd')
      )
    },
    periodStartError() {
      return (
        this.mainStateStore.isError('$missingPeriodStart') ||
        this.mainStateStore.isError('$incompletePeriodStart')
      )
    },
  },
  methods: {
    resetPeriodStart() {
      this.searchParameterStore.periodStart = null
    },
    resetPeriodEnd() {
      this.searchParameterStore.periodEnd = null
    },
    emptyPeriodSelection() {
      this.resetPeriodStart()
      this.resetPeriodEnd()
      this.periodEmptied = !this.periodEmptied
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
.title {
  display: grid;
  font-family: 'TitilliumWeb';
  grid-template-columns: 50% 50%;
  grid-template-rows: 3rem;
  align-items: center;
  .with-details {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  h3 {
    font-size: $font-size-l;
  }
}
.sub {
  grid-template-columns: 25% 25% 22% 22% 6%;
  h4 {
    font-weight: normal;
  }
}
.content {
  display: grid;
  align-items: center;
  grid-template-columns: 23% 3% 23% 2% 20% 3% 20% 6%;
}
</style>
