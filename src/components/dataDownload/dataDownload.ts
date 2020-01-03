import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import { mainState } from '@/store/mainState';
import { validateSearchParameters } from '@/helpers';
import { searchParameterModule } from '@/store/searchParameterModule';
import { waterQualityModule } from '@/store/attributeModules/waterQualityModule';
@Component({
    components: {
        SelectionHeader,
        SelectionButton,
    },
})
export default class DataDownload extends Vue {

    public downloadData() {
        const errors = [...waterQualityModule.errors];
        errors.push(...validateSearchParameters(
            true,
            searchParameterModule.selectedSites,
            mainState.selectedAttributeModules,
            searchParameterModule.timeSpanStart,
            searchParameterModule.timeSpanEnd,
            searchParameterModule.periodStart,
            searchParameterModule.periodEnd),
        );

        if (errors.length === 0) {
            mainState.downloadData();
        }
        mainState.setErrorList(errors);
    }
}
