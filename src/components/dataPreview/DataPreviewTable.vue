<template>
  <div>
    <div v-if="hasData">
      <strong>{{ $t(store.name) }}</strong>
      <span>{{ ` (${store.rowCount} ${$t('$rows')}) ` }}</span>
      <a :href="encodedFileUri" :download="$t(store.name) + '.csv'">
        {{ $t('$downloadCSV') }}
      </a>
      <table>
        <tr>
          <th v-for="(name, i) in columnNames" :key="i">
            {{ name }}
          </th>
        </tr>
        <tr v-for="(row, j) in store.previewData" :key="j">
          <td v-for="(column, k) of row" :key="k">
            {{ column }}
          </td>
        </tr>
      </table>
    </div>
    <br />
    <div v-if="!hasData && isDataLoaded">
      <strong>{{ $t(store.name) }}</strong>
      - {{ $t('$noRowsFound') }}
    </div>
  </div>
</template>

<script lang="ts">
import { IAttributeStoreProperties } from 'pinia'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    store: {
      type: Object as PropType<IAttributeStoreProperties>,
      required: true,
    },
  },
  computed: {
    isDataLoaded() {
      return this.store.data !== null
    },
    hasData() {
      return this.store.previewData.length > 0
    },
    columnNames() {
      return Object.keys(this.store.previewData[0])
    },
    encodedFileUri() {
      let csvContent = ''
      csvContent += this.columnNames.join(';') + ';\r\n'

      this.store.data!.forEach((row) => {
        const values = Object.keys(row).map((key) => (row as any)[key])
        csvContent += values.join(';') + ';\r\n'
      })

      // https://stackoverflow.com/questions/23301467/javascript-exporting-large-text-csv-file-crashes-google-chrome
      const csvData = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      })

      return URL.createObjectURL(csvData)
    },
  },
})
</script>
