<template>
  <div>
    <p v-if="!sykeApiOnline && !fmiApiOnline" class="error-notification">
      {{ $t('$serviceUnavailable') }}
    </p>
    <p v-else-if="!sykeApiOnline" id="error-paragraph">
      {{ $t('$sykeApiDownInfo') }}
    </p>
    <p v-else-if="!fmiApiOnline" id="error-paragraph">
      {{ $t('$fmiApiDownInfo') }}
    </p>
    <div v-if="errorList.length" ref="focus" tabindex="-1" id="focus-to-error">
      <fieldset id="error-content">
        <li v-for="error in errorList" :key="error" class="error">
          {{ $t(error) }}
        </li>
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts">
import { useMainStateStore } from '@/stores/mainStateStore'
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    ...mapStores(useMainStateStore),
    sykeApiOnline() {
      return this.mainStateStore.sykeApiOnline
    },
    fmiApiOnline() {
      return this.mainStateStore.fmiApiOnline
    },
    errorList() {
      const errorList = this.mainStateStore.errorList
      if (errorList.length) {
        const wrapper = this.$refs.focus
        ;(wrapper as Element)?.scrollIntoView(true)
        ;(wrapper as HTMLElement)?.focus()
      }
      return errorList
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

#error-paragraph {
  padding: 1rem;
  background: $border-warn;
  color: #fff;
  text-align: center;
  bottom: 0;
  left: 0;
}

#error-content {
  border: none;
  text-align: left;
  padding-top: 2rem;
  margin: 1rem 7rem 0 7rem;
}

#focus-to-error {
  &:focus {
    outline-color: white;
  }
}
</style>
