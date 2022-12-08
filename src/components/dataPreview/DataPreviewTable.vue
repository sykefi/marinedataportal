<template>
  <div>
    <div v-if="hasData">
      <strong>{{ $t(module.name) }}</strong>
      <span>{{ ` (${module.rowCount} ${$t("$rows")}) ` }}</span>
      <a
        :href="encodedFileUri"
        :download="$t(module.name) + '.csv'"
      >{{ $t("$downloadCSV") }}</a>
      <table>
        <tr>
          <th
            v-for="(name, i) in columnNames"
            :key="i"
          >
            {{ name }}
          </th>
        </tr>
        <tr
          v-for="(row, j) in module.previewData"
          :key="j"
        >
          <td
            v-for="(column, k) of row"
            :key="k"
          >
            {{ column }}
          </td>
        </tr>
      </table>
    </div>
    <br>
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
      type: 'text/csv;charset=utf-8;',
    });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(csvData, this.module.name + '.csv');
    } else {
      return URL.createObjectURL(csvData);
    }
  }
}

// https://stackoverflow.com/questions/69485778/new-typescript-version-does-not-include-window-navigator-mssaveblob
declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean
    }
}

</script>
