import { IAttributeModule } from "@/store/attributeModules/IAttributeModule";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    module: {
      type: Object as PropType<IAttributeModule>,
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
      return this.module.isSelected;
    },
  },
  methods: {
    onClick() {
      this.module.toggleSelected();
    },
  },
});
