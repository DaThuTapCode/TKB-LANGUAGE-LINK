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
  }
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
</script>

<template>
  <div style="margin: 0 auto; max-width: 1200px">
    <h3 style="color: red">Kim Dong Primary</h3>
    <h2 style="color: #646cff">2024-2025 TIMETABLE / THỜI KHÓA BIỂU</h2>
    <table>
      <thead>
      <tr>
        <th>Apply from:</th>
        <td>09/09/2024</td>
      </tr>
      <tr>
        <th>School address:</th>
        <td>No.1 Tran Huy Lieu - Giang Vo - Ba Đinh Dist- Ha Noi</td>
      </tr>
      <tr>
        <th>Map to school:</th>
        <td>https://maps.app.goo.gl/1CE8kNha2FWHNAmY9</td>
      </tr>
      <tr>
        <th>Pacing guides:</th>
        <td>KIM DONG PRI - Pacing Guides 2024-2025</td>
      </tr>
      </thead>
    </table>


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
  </div>

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
