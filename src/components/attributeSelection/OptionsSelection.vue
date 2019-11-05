<template>
  <div class="selection-box">
    <fieldset class="selection-content">
      <legend class="details-header">{{header}}</legend>
      <label>
        <input type="checkbox" v-model="selectAll" :aria-label="$t('$selectAll')" />
        <b>{{$t('$selectAll')}}</b>
      </label>
      <br />
      <div v-bind:class="[twoColumns ? 'two-columns' : '']">
        <div v-for="option in availableOptions" :key="option.id" class="option-input">
          <label>
            <input type="checkbox" :value="option.id" v-model="selectedIds" />
            {{option.name}}
          </label>
          <br />
        </div>
      </div>
    </fieldset>
  </div>
</template>

<style lang="scss">
  @import "@/assets/styles/variables.scss";
  .two-columns {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .option-input {
    min-width: 50%;
  }
</style>

<script src="./optionsSelection.ts"></script>
