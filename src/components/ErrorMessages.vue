<template>
  <div>
    <p
      v-if="!sykeApiOnline && !fmiApiOnline"
      class="error-notification"
    >
      {{ $t("$serviceUnavailable") }}
    </p>
    <p
      v-else-if="!sykeApiOnline"
      id="error-paragraph"
    >
      {{ $t("$sykeApiDownInfo") }}
    </p>
    <p
      v-else-if="!fmiApiOnline"
      id="error-paragraph"
    >
      {{ $t("$fmiApiDownInfo") }}
    </p>
    <div
      v-if="errorList.length"
      ref="focus"
      tabindex="-1"
      id="focus-to-error"
    >
      <fieldset id="error-content">
        <li
          v-for="error in errorList"
          :key="error"
          class="error"
        >
          {{ $t(error) }}
        </li>
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import i18n from '@/locale/i18n';
import { mainState } from '@/store/mainState';

@Component({ i18n })
export default class Header extends Vue {

  get sykeApiOnline() {
    return mainState.sykeApiOnline;
  }

  get fmiApiOnline() {
    return mainState.fmiApiOnline;
  }

  get errorList() {
    const errorList = mainState.errorList;
    if (errorList.length) {
      const wrapper = this.$refs.focus;
      (wrapper as Element)?.scrollIntoView(true);
      (wrapper as HTMLElement)?.focus();
    }
    return errorList;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

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