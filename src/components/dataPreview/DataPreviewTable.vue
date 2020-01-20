<template>
  <div>
    <div v-if="hasData">
      <strong>{{ $t(module.name) }}</strong>
      <span>{{ ` (${module.rowCount} ${$t("$rows")}) ` }}</span>
      <a :href="encodedFileUri" :download="$t(module.name) + '.csv'">{{$t("$downloadCSV")}}</a>
      <table>
        <tr>
          <th v-for="(name, index) in columnNames" :key="index">{{ name }}</th>
        </tr>
        <tr v-for="(row, index) in module.previewData" :key="index">
          <td v-for="(column, index) of row" :key="index">{{ column }}</td>
        </tr>
      </table>
    </div>
    <br />
    <div v-if="!hasData && isDataLoaded">
      <strong>{{ $t(module.name) }}</strong>
      - {{ $t("$noRowsFound") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAttributeModule } from '@/store/attributeModules/IAttributeModule';
@Component
export default class DataPreviewTable extends Vue {
  @Prop({ required: true })
  public module!: IAttributeModule;

  get isDataLoaded() {
    return this.module.data !== null;
  }

  get hasData() {
    return this.module.previewData.length > 0;
  }

  get columnNames() {
    return Object.keys(this.module.previewData[0]);
  }

  get encodedFileUri() {
    let csvContent = '';
    csvContent += this.columnNames.join(';') + ';\r\n';

    this.module.data!.forEach((row) => {
      const values = Object.keys(row).map((key) => (row as any)[key]);
      csvContent += values.join(';') + ';\r\n';
    });

    // https://stackoverflow.com/questions/23301467/javascript-exporting-large-text-csv-file-crashes-google-chrome
    const csvData = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    if (window.navigator.msSaveBlob) {
      navigator.msSaveBlob(csvData, this.module.name + '.csv');
    } else {
      return URL.createObjectURL(csvData);
    }
  }
}
</script>
