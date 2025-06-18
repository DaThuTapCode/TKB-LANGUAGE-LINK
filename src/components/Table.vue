<script setup lang="ts">
const schedule = [
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
];

const days2 = [
  {key: 'monday', label: 'Monday / Thứ Hai'},
  {key: 'tuesday', label: 'Tuesday / Thứ Ba'},
  {key: 'wednesday', label: 'Wednesday / Thứ Tư'},
  {key: 'thursday', label: 'Thursday / Thứ Năm'},
  {key: 'friday', label: 'Friday / Thứ Sáu'}
]


// Tính số lượng tiết học lớn nhất theo từng ngày
const getMaxSessionsPerDay = (schedule: any, days2: any) => {
  return days2.map((day: any) => {
    const max = Math.max(
        ...schedule.map((row: any) => (row[day.key]?.length || 0))
    );
    return {
      ...day,
      max
    };
  });
};

const daysWithMax = getMaxSessionsPerDay(schedule, days2);

const arraySpanMethod = ({row, column, rowIndex, columnIndex}: any) => {
  // Xử lý logic rowspan/colspan tại đây
  if (rowIndex === 0 && columnIndex === 0) {
    return {
      rowspan: 2,
      colspan: 1
    };
  }
  // Thêm các điều kiện khác nếu cần
}


</script>

<template>
  <table class="schedule-table">
    <thead>
    <tr>
      <th :rowspan="2">Date/Time</th>
      <template v-for="day in daysWithMax" :key="day.key">
        <th :colspan="day.max">{{ day.label }}</th>
      </template>
    </tr>
    </thead>

    <tbody>
    <template v-for="row in schedule" :key="row.time">
      <tr>
        <td style="border: 2px solid black;" rowspan="3">{{ row.time }}</td>
        <!-- Tên lớp -->
        <template v-for="day in daysWithMax" :key="day.key + '-class'">
          <template v-for="i in day.max">
            <td :style="{
                backgroundColor: row[day.key]?.[i - 1]?.teacherColor || 'transparent',
                borderRight: '2px solid black'
              }">
              {{ row[day.key]?.[i - 1]?.class || '' }}
            </td>
          </template>
          <!-- Nếu day.max === 0, render 1 ô trống để không mất cột -->
          <td v-if="day.max === 0" :style="{ borderRight: '2px solid black' }"></td>
        </template>
      </tr>

      <tr class="teacher-row">
        <template v-for="day in daysWithMax" :key="day.key + '-teacher'">
          <template v-for="i in day.max">
            <td :style="{
                backgroundColor: row[day.key]?.[i - 1]?.teacherColor || 'transparent',
                borderRight: '2px solid black'
              }">
              {{ row[day.key]?.[i - 1]?.teacher || '' }}
            </td>
          </template>
          <td v-if="day.max === 0" :style="{ borderRight: '2px solid black' }"></td>
        </template>
      </tr>

      <tr class="assistant-row">
        <template v-for="day in daysWithMax" :key="day.key + '-assistant'">
          <template v-for="i in day.max">
            <td :style="{
                backgroundColor: row[day.key]?.[i - 1]?.teacherColor || 'transparent',
                borderRight: '2px solid black',
                borderBottom: '2px solid black'
              }">
              {{ row[day.key]?.[i - 1]?.assistant || '' }}
            </td>
          </template>
          <td v-if="day.max === 0" :style="{ borderRight: '2px solid black', borderBottom: '2px solid black' }"></td>
        </template>
      </tr>
    </template>
    </tbody>
  </table>

  <br>
  <table class="schedule-table">
    <thead>
    <tr>
      <th :rowspan="2">Date/Time</th>
      <template v-for="day in daysWithMax" :key="day.key">
        <th :colspan="day.max">{{ day.label }}</th>
      </template>
    </tr>
    </thead>

    <tbody>
    <template v-for="row in schedule" :key="row.time">
      <tr>
        <td>{{ row.time }}</td>
        <!-- Tên lớp -->
        <template v-for="day in daysWithMax" :key="day.key + '-class'">
          <template v-for="i in day.max">
            <td>
              <p> {{ row[day.key]?.[i - 1]?.class || '' }} </p>
              <p> {{ row[day.key]?.[i - 1]?.teacher || '' }}</p>
              <p> {{ row[day.key]?.[i - 1]?.assistant || '' }}</p>
            </td>
          </template>
          <td v-if="day.max === 0"></td>
        </template>
      </tr>
    </template>
    </tbody>
  </table>

  <br>
  <el-table
      :data="schedule"
      border
      :span-method="arraySpanMethod"
      style="width: 100%"
  >
    <!-- Cột Date/Time với rowspan -->
    <el-table-column
        prop="time"
        label="Date/Time"
        width="120"
    />

    <!-- Các cột động theo ngày -->
    <template v-for="day in daysWithMax" :key="day.key">
      <el-table-column
          v-for="i in day.max"
          :key="`${day.key}-${i}`"
          :label="day.label"
      >
        <template #default="{ row }">
          <p>{{ row[day.key]?.[i - 1]?.class || '' }}</p>
          <p>{{ row[day.key]?.[i - 1]?.teacher || '' }}</p>
          <p>{{ row[day.key]?.[i - 1]?.assistant || '' }}</p>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<style scoped>

.schedule-table {
  border-collapse: collapse;
  width: 100%;
}

.schedule-table th,
.schedule-table td {
  /*border: 2px solid black;*/
  padding: 4px;
  text-align: center;
}

.schedule-table,
.schedule-table th {
  border: 2px solid black;
}
</style>