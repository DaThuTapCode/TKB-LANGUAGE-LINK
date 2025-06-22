<template>
  <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 400px"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
  />
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { AgGridVue } from 'ag-grid-vue3'
import { ref } from 'vue'

const rowData = [
  {
    period: 'Ca 1',
    class: 'Toán 10A1',
    teacher: 'Thầy Nam',
    assistant: 'Cô Hoa'
  },
  {
    period: 'Ca 2',
    class: 'Lý 11A2',
    teacher: 'Cô An',
    assistant: 'Thầy Bảo'
  }
]

const columnDefs = ref([
  { headerName: 'Ca học', field: 'period', pinned: 'left' },
  {
    headerName: 'Thông tin buổi học',
    children: [
      { headerName: 'Lớp học', field: 'class' },
      { headerName: 'Giáo viên', field: 'teacher' },
      { headerName: 'Trợ giảng', field: 'assistant' }
    ]
  }
])

const defaultColDef = {
  resizable: true,
  sortable: true
}
</script>
