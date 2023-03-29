import { IAttributeModuleWithOptions } from "@/store/attributeModules/IAttributeModuleWithOptions";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    header: {
      type: String,
      required: true,
    },
    module: {
      type: Object as PropType<IAttributeModuleWithOptions>,
      required: true,
    },
    twoColumns: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      showPhosphorusMessage: false,
    };
  },
  computed: {
    isWaterQualityModule() {
      return this.module.name === "$waterQuality";
    },
    selectedIds: {
      get() {
        return this.module.selectedIds;
      },
      set(e: number[]) {
        this.showPhosphorusMessage = this.includesPhosphorus(e);
        this.module.setSelectedOptions(e);
      },
    },
    availableOptions() {
      return this.module.availableOptions;
    },
    selectAll: {
      get() {
        return this.selectedIds
          ? this.selectedIds.length === this.module.availableOptions.length
          : false;
      },
      set(value: boolean) {
        if (value) {
          this.module.selectAll();
          if (this.includesPhosphorus(this.selectedIds)) {
            this.showPhosphorusMessage = true;
          }
        } else {
          this.module.deSelectAll();
          this.showPhosphorusMessage = false;
        }
      },
    },
    cssVars() {
      return {
        "--length": Math.ceil(this.module.availableOptions.length / 2),
      };
    },
  },
  methods: {
    includesPhosphorus(ids: number[]) {
      if (this.module.name === "$waterQuality") {
        return ids.some((id) => [20, 33, 44, 55].includes(id));
      }
      return false;
    },
  },
});
