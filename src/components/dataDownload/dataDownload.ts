import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import { mainState } from '@/store/mainState';
import { validateSearchParameters } from '@/helpers';
@Component({
    components: {
        SelectionHeader,
        SelectionButton,
    },
})
export default class DataDownload extends Vue {

    public downloadData() {
        if (validateSearchParameters(true)) {
            mainState.downloadData();
        }
    }
}
