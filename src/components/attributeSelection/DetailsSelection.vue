<template>
  <div class="selection-box">
    <fieldset class="selection-content">
      <legend class="details-header">{{header}}</legend>
      <input id="selectAll" type="checkbox" v-model="selectAll" :aria-label="$t('$selectAll')" />
      <label>
        <b>{{$t('$selectAll')}}</b>
      </label>
      <br />
      <div v-for="attribute in attributes" :key="attribute">
        <input
          :id="attribute"
          type="checkbox"
          :value="attribute"
          v-model="selected"
          @click="updateStore"
        />
        <label :for="attribute">{{attribute}}</label>
        <br />
      </div>
    </fieldset>
  </div>
</template>

<script src="./detailsSelection.ts"></script>
