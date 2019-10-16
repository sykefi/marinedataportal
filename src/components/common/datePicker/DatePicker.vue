<template>
  <div class="form-inline">
    <div v-if="showYear" class="form-control">
      <select
        class="form-control year"
        v-model.number="year"
        @change="onChangeYear"
        :aria-label="ariaLabels[2]"
      >
        <option :value="-1" disabled hidden>{{$t('$yearPlaceholder')}}</option>
        <option v-for="year in years" v-bind:key="year" :value="year">{{year}}</option>
      </select>
    </div>
    <div class="form-control">
      <select
        class="form-control month"
        v-model.number="month"
        @change="onChangeMonth"
        :aria-label="ariaLabels[1]"
      >
        <option :value="-1" disabled hidden>{{$t('$monthPlaceholder')}}</option>
        <option v-for="month in months" v-bind:key="month" :value="month">{{month+1}}</option>
      </select>
    </div>
    <div class="form-control">
      <select
        class="form-control day"
        v-model.number="day"
        :aria-label="ariaLabels[0]"
      >
        <option :value="-1" disabled hidden>{{$t('$dayPlaceholder')}}</option>
        <option v-for="day in days" v-bind:key="day" :value="day">{{day}}</option>
      </select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
.form-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.08rem solid;
  border-radius: 1.2rem;
  border-color: $border-light;
  height: 3rem;
  color: $text-dark;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: $background-light;
}
.form-control {
  border-top: none;
  border-left: none;
  border-right: none;
  width: 90%;
  font-family: "OpenSans";
  font-size: $font-size-m;
  background-color: $background-light;
}
.year {
  width: 4rem;
}
select {
  -moz-appearance: none;
  text-align-last: center;
}
</style>

<script src="./datePicker.ts"></script>
