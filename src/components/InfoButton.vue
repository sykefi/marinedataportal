<template>
  <div id="button-wrapper">
    <font-awesome-icon v-if="!showInfo" icon="angle-right" class="arrow-icon" />
    <font-awesome-icon v-else icon="angle-down" class="arrow-icon" />
    <button
      id="info-button"
      @click="toggle"
      :aria-pressed="showInfo"
      :aria-expanded="showInfo"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    buttonText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showInfo: false,
    };
  },
  methods: {
    toggle() {
      this.showInfo = !this.showInfo;
      this.$emit("show-info", this.showInfo);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.arrow-icon {
  color: $background-bright-blue;
  font-size: $font-size-xl;
  padding-right: 0.5rem;
}

#button-wrapper {
  display: flex;
  align-items: center;
  padding: 0 7rem 0 7rem;
}

#info-button {
  font-family: "TitilliumWeb";
  color: $text-white;
  font-weight: bold;
  font-size: $font-size-l;
  letter-spacing: 0.02rem;
  margin: 0;
  padding: 0;
  background-color: $border-dark;
}
</style>
