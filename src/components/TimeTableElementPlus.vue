<script setup lang="ts">


// Modal state
import {ref} from "vue";

const showModal = ref(false)
const selectedClass = ref<any>(null)


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

const handleClickDetail = (data: any) => {
  console.log('data', data);
  showModal.value = true;
  selectedClass.value = data
}

const days = [
  {key: 'monday', label: 'Monday / Thứ Hai'},
  {key: 'tuesday', label: 'Tuesday / Thứ Ba'},
  {key: 'wednesday', label: 'Wednesday / Thứ Tư'},
  {key: 'thursday', label: 'Thursday / Thứ Năm'},
  {key: 'friday', label: 'Friday / Thứ Sáu'}
]

// Tính số lượng tiết học lớn nhất theo từng ngày
const getMaxSessionsPerDay = (schedule: any, days: any) => {
  return days.map((day: any) => {
    const max = Math.max(
        ...schedule.map((row: any) => (row[day.key]?.length || 0))
    );
    return {
      ...day,
      max
    };
  });
};

const daysWithMax = getMaxSessionsPerDay(schedule, days);

</script>

<template>
  <el-table
      :data="schedule"
      border
      style="width: 100%"
      :header-cell-style="{ textAlign: 'center', color: 'black' }"
  >
    <!-- Cột Date/Time -->
    <el-table-column
        prop="time"
        label="Date/Time"
        width="120"
        fixed
    />

    <!-- Các cột theo ngày -->
    <template v-for="day in daysWithMax" :key="day.key">
      <!-- Trường hợp có tiết học -->
      <template v-if="day.max > 0">
        <el-table-column
            :label="day.label"
            header-align="center"
        >
          <el-table-column
              v-for="i in day.max"
              :key="`${day.key}-${i}`"
              :label="`Slot ${i}`"
              align="center"
          >
            <template #default="{ row }">
              <div :style="{backgroundColor: row[day.key]?.[i - 1]?.teacherColor}"
                   @click="handleClickDetail(row[day.key]?.[i - 1])">
                <p>{{ row[day.key]?.[i - 1]?.class || '-' }}</p>
                <p class="teacher">{{ row[day.key]?.[i - 1]?.teacher || '' }}</p>
                <p class="assistant">{{ row[day.key]?.[i - 1]?.assistant || '' }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
      <!-- Trường hợp không có tiết học -->
      <template v-else>
        <el-table-column
            :label="day.label"
            prop="empty"
            align="center"
        >
          <el-table-column
              align="center"
          >
            <template #header>
              <span style="color: red; font-weight: bold;">Không có lịch dạy</span>
            </template>
            <template #default>-</template>
          </el-table-column>
        </el-table-column>
      </template>
    </template>
  </el-table>

  <!-- Modal chi tiết -->
  <el-dialog v-model="showModal" title="Chi tiết tiết học" width="30%">
    <div v-if="selectedClass" class="class-detail">
      <p><strong>Thời gian:</strong> {{ selectedClass.time }}</p>
      <p><strong>Slot:</strong> {{ selectedClass.day }}</p>
      <p><strong>Lớp:</strong> {{ selectedClass.class }}</p>
      <p><strong>Giáo viên:</strong> {{ selectedClass.teacher }}</p>
      <p><strong>Trợ giảng:</strong> {{ selectedClass.assistant }}</p>
    </div>
    <template #footer>
      <el-button @click="showModal = false">Đóng</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>