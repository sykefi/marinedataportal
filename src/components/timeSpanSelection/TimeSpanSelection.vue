<template>
  <div>
    <div id="scroll-on-focus" />
    <SelectionHeader :header="$t('$timeSpanSelectionTitle')" />
    <div class="title">
      <h3 aria-hidden="true">{{$t('$timeSpan')}}</h3>
      <div class="with-details">
        <h3 aria-hidden="true">{{$t('$period')}}</h3>
        <DetailsButton :contentKey="$t('$periodInfoText')" />
      </div>
    </div>
    <div class="title sub">
      <h4 aria-hidden="true">{{$t('$startTimeSpan')}}</h4>
      <h4 aria-hidden="true">{{$t('$endTimeSpan')}}</h4>
      <h4 aria-hidden="true">{{$t('$startPeriod')}}</h4>
      <h4 aria-hidden="true">{{$t('$endPeriod')}}</h4>
    </div>
    <div class="content">
      <DatePicker
        v-model="searchModule.timeSpanStart"
        @focus-date-picker="scrollOnFocus"
        :ariaLabels="[ $t('$timeSpanStartDay'), $t('$timeSpanStartMonth'), $t('$timeSpanStartYear')]"
        :error="timeSpanStartError"
      />
      <b>–</b>
      <DatePicker
        v-model="searchModule.timeSpanEnd"
        @focus-date-picker="scrollOnFocus"
        :ariaLabels="[$t('$timeSpanEndDay'), $t('$timeSpanEndMonth'), $t('$timeSpanEndYear')]"
        :error="timeSpanEndError"
      />
      <p />
      <DatePicker
        v-model="searchModule.periodStart"
        @focus-date-picker="scrollOnFocus"
        :showYear="false"
        :ariaLabels="[$t('$periodStartDay'), $t('$periodStartMonth')]"
        :emptied="periodEmptied"
        :error="periodStartError"
      />
      <b>–</b>
      <DatePicker
        v-model="searchModule.periodEnd"
        @focus-date-picker="scrollOnFocus"
        :showYear="false"
        :ariaLabels="[$t('$periodEndDay'), $t('$periodEndMonth')]"
        :emptied="periodEmptied"
        :error="periodEndError"
      />
      <EmptySelectionButton
        :contentKey="$t('$emptyPeriodSelection')"
        @empty-selection="emptyPeriodSelection"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
.title {
  display: grid;
  font-family: "TitilliumWeb";
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

<script src="./timeSpanSelection.ts"></script>
