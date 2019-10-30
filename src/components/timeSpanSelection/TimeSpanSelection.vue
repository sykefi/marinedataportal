<template>
  <div>
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
        @day-change="storeTimeSpanStart"
        @year-month-change="resetTimeSpanStart"
        start="1970-01-01"
        :end="new Date().toString()"
        :ariaLabels="[ $t('$timeSpanStartDay'), $t('$timeSpanStartMonth'), $t('$timeSpanStartYear')]"
        :defaultDate="timeSpanStart"
        :error="timeSpanStartError"
      />
      <b>–</b>
      <DatePicker
        @day-change="storeTimeSpanEnd"
        @year-month-change="resetTimeSpanEnd"
        start="1970-01-01"
        :end="new Date().toString()"
        :ariaLabels="[$t('$timeSpanEndDay'), $t('$timeSpanEndMonth'), $t('$timeSpanEndYear')]"
        :defaultDate="timeSpanEnd"
        :error="timeSpanEndError"
      />
      <p />
      <DatePicker
        @day-change="storePeriodStart"
        @year-month-change="resetPeriodStart"
        start="1970-01-01"
        :end="new Date().toString()"
        :showYear="false"
        :ariaLabels="[$t('$periodStartDay'), $t('$periodStartMonth')]"
        :defaultDate="periodStart"
        :emptied="periodEmptied"
        :error="periodStartError"
      />
      <b>–</b>
      <DatePicker
        @day-change="storePeriodEnd"
        @year-month-change="resetPeriodEnd"
        start="1970-01-01"
        :end="new Date().toString()"
        :showYear="false"
        :ariaLabels="[$t('$periodEndDay'), $t('$periodEndMonth')]"
        :defaultDate="periodEnd"
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
