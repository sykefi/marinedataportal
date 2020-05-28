<template>
  <div class="selection-box">
    <fieldset class="selection-content" :style="cssVars">
      <legend class="details-header">{{ header }}</legend>
      <label>
        <input
          type="checkbox"
          v-model="selectAll"
          :aria-label="$t('$selectAll')"
        />
        <b>{{ $t("$selectAll") }}</b>
      </label>
      <br />
      <div v-bind:class="[twoColumns ? 'two-columns' : '']">
        <label
          v-for="option in availableOptions"
          :key="option.id"
          class="option-label"
        >
          <input type="checkbox" :value="option.id" v-model="selectedIds" :disabled="!option.online" />
          {{ option.name }}
        </label>
      </div>
    </fieldset>
    <p v-if="showPhosphorusMessage" class="info-paragraph">{{ $t("$phosphorusMessage") }}</p>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables.scss";
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(var(--length), 1fr);
  grid-auto-flow: column;
}
.option-label {
  display: block;
}
</style>

<script src="./optionsSelection.ts"></script>
