<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
// import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ AllCommunityModule ]);


const schedule = ref([
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
    wednesday: [
      {
        class: "11A1",
        teacher: "Cô E",
        teacherColor: "rgba(255,0,51,0.44)",
        assistant: "Thầy F",
        assistantColor: "#795548",
      }
    ],
  },
]);

// Tính toán số slot tối đa mỗi ngày
const daysWithMax = [
  { key: 'monday', label: 'Monday', max: calculateMaxSlots('monday') },
  { key: 'tuesday', label: 'Tuesday', max: calculateMaxSlots('tuesday') },
  { key: 'wednesday', label: 'Wednesday', max: calculateMaxSlots('wednesday') },
  { key: 'thursday', label: 'Thursday', max: calculateMaxSlots('thursday') },
  { key: 'friday', label: 'Friday', max: calculateMaxSlots('friday') },
  // Add other days...
]

function calculateMaxSlots(dayKey: string): number {
  let max = 0
  schedule.value.forEach(row => {
    const slots = row[dayKey]?.length || 0
    if (slots > max) max = slots
  })
  return max
}

// Custom cell renderer
const classCellRenderer = (params: any) => {
  const dayKey = params.colDef.dayKey
  const slotIndex = params.colDef.slotIndex
  const classData = params.data[dayKey]?.[slotIndex - 1]

  if (!classData) {
    return '<div style="padding: 10px; text-align: center; color: #999;">-</div>'
  }

  return `
    <div class="class-info" style="background-color: ${classData.teacherColor || 'transparent'}; padding: 8px;">
      <p style="margin: 0; font-weight: bold;">${classData.class || '-'}</p>
      <p class="teacher" style="margin: 0; font-size: 12px;">${classData.teacher || ''}</p>
      <p class="assistant" style="margin: 0; font-size: 12px; color: #666;">${classData.assistant || ''}</p>
    </div>
  `
}

// Tạo columnDefs
const columnDefs = ref([
  {
    headerName: 'Date/Time',
    field: 'time',
    pinned: 'left',
    width: 120,
    cellStyle: { textAlign: 'center' }
  }
])

// Thêm columns cho từng ngày
daysWithMax.forEach(day => {
  if (day.max > 0) {
    // Tạo header nhóm cho ngày
    const children = []

    // Tạo các cột slot con
    for (let i = 1; i <= day.max; i++) {
      children.push({
        headerName: `Slot ${i}`,
        dayKey: day.key,
        slotIndex: i,
        cellRenderer: classCellRenderer,
        autoHeight: true,
        cellStyle: { padding: '0' }
      })
    }

    columnDefs.value.push({
      headerName: day.label,
      marryChildren: true,
      children: children,
      headerClass: 'day-header'
    })
  } else {
    // Ngày không có tiết học
    columnDefs.value.push({
      headerName: day.label,
      field: 'empty',
      cellStyle: { textAlign: 'center', color: '#999' },
      cellRenderer: () => '-',
      headerClass: 'day-header'
    })
  }
})

const defaultColDef = {
  resizable: true,
  sortable: false,
  filter: false,
  autoHeight: true,
  suppressMovable: true
}

const gridOptions = {
  domLayout: 'autoHeight',
  suppressCellFocus: true,
  headerHeight: 50,
  suppressHorizontalScroll: true,
  suppressColumnVirtualisation: true,
  getRowHeight: () => null // Sử dụng autoHeight
}
</script>

<template>
  <div class="ag-theme-alpine" style="width: 100%;">
    <AgGridVue
        :columnDefs="columnDefs"
        :rowData="schedule"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"
    />
  </div>
</template>

<style>
.ag-theme-alpine {
  --ag-header-background-color: #f8f9fa;
  --ag-border-color: #dee2e6;
  --ag-cell-horizontal-padding: 0;
}

.day-header {
  background-color: #f0f2f5 !important;
  font-weight: bold !important;
}

.class-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid #dee2e6;
}

.class-info p {
  margin: 2px 0;
}
</style>