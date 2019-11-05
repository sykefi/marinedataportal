<template>
  <div>
    <div v-if="hasData">
      <strong>{{$t(module.name)}}</strong>
      <span>{{` (${module.rowCount} ${$t('$rows')})`}}</span>
      <button @click="downloadCsv">{{$t('$downloadCSV')}}</button>
      <table>
        <tr>
          <th v-for="(name,index) in columnNames" :key="index">{{name}}</th>
        </tr>
        <tr v-for="(row, index) in module.previewData" :key="index">
          <td v-for="(column,index) of row" :key="index">{{column}}</td>
        </tr>
      </table>
    </div>
    <div v-if="!hasData && isDataLoaded">
      <strong>{{$t(module.name)}}</strong>
      - {{$t('$noRowsFound')}}
    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { IAttributeModule } from '@/store/attributeModules/IAttributeModule';
  import i18n from '@/locale/i18n';
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

    public downloadCsv() {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += this.columnNames.join(';') + ';\r\n';

      this.module.data!.forEach((row) => {
        const values = Object.keys(row).map((key) => (row as any)[key]);
        csvContent += values.join(';') + ';\r\n';
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${i18n.t(this.module.name)}.csv`);

      link.click(); // This will download the data with the module name.
    }

  }
</script>

<style lang='scss' scoped>
</style>