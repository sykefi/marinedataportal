import { Component, Vue, Watch } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import { CommonParameters } from '@/queries/commonParameters';
import { attributeModule } from '@/store/attributeModule';
import { mapping } from '@/queries/attributeMappingToQueries';
import { ValidatedInput } from '@/components/fileDownload/validatedInput';
@Component({
    components: {
        SelectionHeader,
        SelectionButton,
    },
})
export default class FileDownload extends Vue {
    public errorList = attributeModule.errorList;

    public downloadData() {
        const v = this.validateUserInput();
        this.$emit('download-clicked');
        if (v !== null) {
            const commonParameters = new CommonParameters(v.timeSpanStart, v.timeSpanEnd);
            v.attributes.forEach(async (a) => {
                const mapObject = mapping.find((m) => m.attribute === a);
                if (mapObject) {
                    const responses = await mapObject.function(commonParameters);
                    // console.log('r', responses);
                }
            });
        }
    }

    public validateUserInput() {
        const errorList = [];

        const v = new ValidatedInput();

        const attributesForQuery = [...attributeModule.selectedAttributes];
        this.removeNonQueriedAttributes(attributesForQuery);

        // Attribute validation
        attributesForQuery.length > 0
            ? v.attributes = attributesForQuery : errorList.push('$noAttributesSelected');

        // Time span validation
        attributeModule.timeSpanStart ? v.timeSpanStart = attributeModule.timeSpanStart : errorList.push('$missingTimeSpanStart');
        attributeModule.timeSpanEnd ? v.timeSpanEnd = attributeModule.timeSpanEnd
            : errorList.push('$missingTimeSpanEnd');
        if (attributeModule.timeSpanStart && v.timeSpanStart > v.timeSpanEnd) {
            errorList.push('$timeSpanStartAfterTimeSpanEnd');
        }

        // Time period validation
        if (attributeModule.periodStart && !attributeModule.periodEnd) {
            errorList.push('$missingPeriodEnd');
        } else if (!attributeModule.periodStart && attributeModule.periodEnd) {
            errorList.push('$missingPeriodStart');
        } else if (attributeModule.periodStart && attributeModule.periodEnd) {
            v.periodStart = attributeModule.periodStart;
            v.periodEnd = attributeModule.periodEnd;
            if (v.periodStart > v.periodEnd) {
                errorList.push('$periodStartAfterPeriodEnd');
            }
        }

        // Depth validation
        if (attributeModule.selectedDepth === 'depthInterval') {
            attributeModule.depthStart !== null ? v.depthStart = attributeModule.depthStart : errorList.push('$missingDepthStart');
            attributeModule.depthEnd !== null ? v.depthEnd = attributeModule.depthEnd : errorList.push('$missingDepthEnd');
            if (v.depthStart >= v.depthEnd) {
                errorList.push('$depthStartGreaterThanDepthEnd');
            }
        } else if (attributeModule.selectedDepth === 'surfaceLayer') {
            v.depthStart = 0;
            // TODO v.depthEnd
        } else if (attributeModule.selectedDepth === 'bottomLayer') {
            // TODO
        }

        // Site Validation

        attributeModule.setErrorList(errorList);
        this.errorList = errorList;
        if (errorList.length > 0) {
            return null;
        } else {
            return v;
        }
    }

    private removeNonQueriedAttributes(attributesForQuery: string[]) {
        const attributesToRemove = ['$surge', '$surfaceTemperature', '$waterQuality'];
        attributesToRemove.forEach((a) => {
            const index = attributesForQuery.findIndex((name) => name === a);
            if (index >= 0) {
                attributesForQuery.splice(index, 1);
            }
        });
    }
}
