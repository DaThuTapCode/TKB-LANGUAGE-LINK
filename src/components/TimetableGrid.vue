<script setup lang="ts">
// Import theme kiểu legacy
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);

import { AgGridVue } from 'ag-grid-vue3'
import { ref } from 'vue'

// Renderer custom để hiển thị danh sách lớp & giáo viên
const cellRenderer = (params: any) => {
  const data = params.value
  if (!Array.isArray(data)) return ''

  return data
      .map(item => {
        const className = item.class || ''
        const teacher = item.teacher || ''
        const assistant = item.assistant || ''
        return `
        <div style="margin-bottom: 6px">
          <strong>${className}</strong><br/>
          <span style="font-size: 12px">${teacher}</span><br/>
          <span style="font-size: 12px; color: gray">${assistant}</span>
        </div>
      `
      })
      .join('')
}


// Cột hiển thị theo thứ trong tuần
const columnDefs = ref([
  { headerName: 'Time', field: 'time', pinned: 'left' },
  { headerName: 'Monday', field: 'monday', cellRenderer },
  { headerName: 'Tuesday', field: 'tuesday', cellRenderer },
  { headerName: 'Wednesday', field: 'wednesday', cellRenderer },
  { headerName: 'Thursday', field: 'thursday', cellRenderer },
  { headerName: 'Friday', field: 'friday', cellRenderer }
])

// Dữ liệu mẫu cho thời khóa biểu
const rowData = ref([
  {
    time: "08:00-08:35",
    monday: [
      {
        class: "12A1",
        teacher: "Thầy A",
        teacherColor: "rgba(76,175,80,0.29)",
        assistant: "Cô B",
        assistantColor: "#E91E63",
      },
      {
        class: "12A2",
        teacher: "Thầy C",
        teacherColor: "#2196F3",
        assistant: "Cô D",
        assistantColor: "#FF9800",
      },
    ],
    tuesday: [
      {
        class: "12A1",
        teacher: "Thầy A",
        teacherColor: "rgba(76,175,80,0.29)",
        assistant: "Cô B",
        assistantColor: "#E91E63",
      },
      {
        class: "12A2",
        teacher: "Thầy C",
        teacherColor: "#2196F3",
        assistant: "Cô D",
        assistantColor: "#FF9800",
      },
      {
        class: "11A1",
        teacher: "Cô E",
        teacherColor: "rgba(255,0,51,0.44)",
        assistant: "Thầy F",
        assistantColor: "#795548",
      },
    ]
  },
  {
    time: "08:35-09:10",
    monday: [
      {
        class: "12A1",
        teacher: "Thầy A",
        teacherColor: "rgba(76,175,80,0.29)",
        assistant: "Cô B",
        assistantColor: "#E91E63",
      }
    ],
    tuesday: [
      {
        class: "11A1",
        teacher: "Cô E",
        teacherColor: "rgba(255,0,51,0.44)",
        assistant: "Thầy F",
        assistantColor: "#795548",
      }
    ]
  },
  {
    time: "09:35-10:10",
    monday: [
      {
        class: "12A1",
        teacher: "Thầy A",
        teacherColor: "rgba(76,175,80,0.29)",
        assistant: "Cô B",
        assistantColor: "#E91E63",
      },
    ],
    tuesday: [
      {
        class: "11A1",
        teacher: "Cô E",
        teacherColor: "rgba(255,0,51,0.44)",
        assistant: "Thầy F",
        assistantColor: "#795548",
      }
    ],
    friday: [
      {
        class: "11A1",
        teacher: "Cô E",
        teacherColor: "rgba(255,0,51,0.44)",
        assistant: "Thầy F",
        assistantColor: "#795548",
      }
    ],
  }
])

// Tùy chọn chung cho các cột
const defaultColDef = {
  resizable: true,
  wrapText: true,
  autoHeight: true
}
</script>

<template>
  <div class="ag-theme-alpine" style="width: 100%; height: auto;">
    <AgGridVue
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :domLayout="'autoHeight'"
        :theme="'legacy'"
    />
  </div>
</template>
