
import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import DetailsButton from '@/components/common/detailsButton/DetailsButton.vue';
import DatePicker from '@/components/common/datePicker/DatePicker.vue';
import { attributeModule } from '@/store/attributeModule';
@Component({
  components: {
    SelectionHeader,
    DetailsButton,
    DatePicker,
  },
})
export default class TimeSpanSelection extends Vue {
  public timeSpanStart: Date | null = attributeModule.timeSpanStart;
  public timeSpanEnd: Date | null = attributeModule.timeSpanEnd;
  public periodStart: Date | null = attributeModule.periodStart;
  public periodEnd: Date | null = attributeModule.periodEnd;

  public storeTimeSpanStart(y: number, m: number, d: number) {
    attributeModule.setTimeSpanStart(new Date(y + '-' + m + '-' + d));
  }

  public storeTimeSpanEnd(y: number, m: number, d: number) {
    attributeModule.setTimeSpanEnd(new Date(y + '-' + m + '-' + d));
  }

  public storePeriodStart(y: number, m: number, d: number) {
    // Year is not picked in period selection, it can be any
    attributeModule.setPeriodStart(new Date('2000' + '-' + m + '-' + d));
  }

  public storePeriodEnd(y: number, m: number, d: number) {
    attributeModule.setPeriodEnd(new Date('2000' + '-' + m + '-' + d));
  }
}
