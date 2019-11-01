<template>
  <div class="selection-box">
    <fieldset class="selection-content">
      <legend class="details-header">{{header}}</legend>
      <label>
        <input type="checkbox" v-model="selectAll" :aria-label="$t('$selectAll')" />
        <b>{{$t('$selectAll')}}</b>
      </label>
      <br />
      <div v-for="option in availableOptions" :key="option.id">
        <label>
          <input type="checkbox" :value="option.id" v-model="selectedIds" />
          {{option.name}}
        </label>
        <br />
      </div>
    </fieldset>
  </div>
</template>

<script src="./optionsSelection.ts"></script>
