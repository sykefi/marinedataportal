import { Component, Vue, Watch } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import { CommonParameters } from '@/queries/commonParameters';
import { searchParameterModule } from '@/store/searchParameterModule';
import { ValidatedInput } from '@/components/dataDownload/validatedInput';
import { mainState } from '@/store/mainState';
@Component({
    components: {
        SelectionHeader,
        SelectionButton,
    },
})
export default class DataDownload extends Vue {
    get errorList() {
        return mainState.errorList;
    }

    public downloadData() {
        const v = this.validateUserInput();
        if (v !== null) {
            const commonParameters = new CommonParameters(v.timeSpanStart, v.timeSpanEnd);
            mainState.downloadData(commonParameters);
        }
    }

    public validateUserInput() {
        const errorList = [];

        const v = new ValidatedInput();

        // Attribute validation
        if (mainState.selectedAttributeModules.length === 0) {
            errorList.push('$noAttributesSelected');
        }

        // Time span validation
        searchParameterModule.timeSpanStart ? v.timeSpanStart = searchParameterModule.timeSpanStart : errorList.push('$missingTimeSpanStart');
        searchParameterModule.timeSpanEnd ? v.timeSpanEnd = searchParameterModule.timeSpanEnd
            : errorList.push('$missingTimeSpanEnd');
        if (searchParameterModule.timeSpanStart && v.timeSpanStart > v.timeSpanEnd) {
            errorList.push('$timeSpanStartAfterTimeSpanEnd');
        }

        // Time period validation
        if (searchParameterModule.periodStart && !searchParameterModule.periodEnd) {
            errorList.push('$missingPeriodEnd');
        } else if (!searchParameterModule.periodStart && searchParameterModule.periodEnd) {
            errorList.push('$missingPeriodStart');
        } else if (searchParameterModule.periodStart && searchParameterModule.periodEnd) {
            v.periodStart = searchParameterModule.periodStart;
            v.periodEnd = searchParameterModule.periodEnd;
            if (v.periodStart > v.periodEnd) {
                errorList.push('$periodStartAfterPeriodEnd');
            }
        }

        // Depth validation
        if (searchParameterModule.selectedDepth === 'depthInterval') {
            searchParameterModule.depthStart !== null
                ? v.depthStart = searchParameterModule.depthStart
                : errorList.push('$missingDepthStart');
            searchParameterModule.depthEnd !== null
                ? v.depthEnd = searchParameterModule.depthEnd
                : errorList.push('$missingDepthEnd');
            if (v.depthStart >= v.depthEnd) {
                errorList.push('$depthStartGreaterThanDepthEnd');
            }
        } else if (searchParameterModule.selectedDepth === 'surfaceLayer') {
            v.depthStart = 0;
            // TODO v.depthEnd
        } else if (searchParameterModule.selectedDepth === 'bottomLayer') {
            // TODO
        }

        // Site Validation

        mainState.setErrorList(errorList);
        if (errorList.length > 0) {
            return null;
        } else {
            return v;
        }
    }
}
