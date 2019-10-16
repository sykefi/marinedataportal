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
        start="1970-01-01"
        :end="new Date().toString()"
        :ariaLabels="[ $t('$timeSpanStartDay'), $t('$timeSpanStartMonth'), $t('$timeSpanStartYear')]"
      />
      <b>–</b>
      <DatePicker
        start="1970-01-01"
        :end="new Date().toString()"
        :ariaLabels="[$t('$timeSpanEndDay'), $t('$timeSpanEndMonth'), $t('$timeSpanEndYear')]"
        :defaultDate="new Date()"
      />
      <p />
      <DatePicker
        start="1970-01-01"
        :end="new Date().toString()"
        :showYear="false"
        :ariaLabels="[$t('$periodStartDay'), $t('$periodStartMonth')]"
      />
      <b>–</b>
      <DatePicker
        start="1970-01-01"
        :end="new Date().toString()"
        :showYear="false"
        :ariaLabels="[$t('$periodEndDay'), $t('$periodEndMonth')]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import DetailsButton from '@/components/common/detailsButton/DetailsButton.vue';
import DatePicker from '@/components/common/datePicker/DatePicker.vue';

@Component({
  components: {
    SelectionHeader,
    DetailsButton,
    DatePicker,
  },
})
export default class TimeSpanSelection extends Vue { }
</script>

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
}
.sub {
  grid-template-columns: 25% 25% 25% 25%;
}
.content {
  display: grid;
  align-items: center;
  grid-template-columns: 23% 3% 23% 2% 23% 3% 23%;
}
</style>