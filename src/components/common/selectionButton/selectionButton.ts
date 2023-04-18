import { IAttributeStoreProperties } from 'pinia';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    store: {
      type: Object as PropType<IAttributeStoreProperties>,
      required: true,
    },
    expandable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selected() {
      return this.store.isSelected;
    },
  },
  methods: {
    onClick() {
      this.store.toggleSelected();
    },
  },
});
