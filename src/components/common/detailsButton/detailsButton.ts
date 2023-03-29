import { defineComponent } from "vue";

export default defineComponent({
  props: {
    contentKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      shown: false,
      rightOverFlow: false,
    };
  },
});
