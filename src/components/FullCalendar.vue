<!-- FullTimetable.vue -->
<template>
  <FullCalendar
      :options="calendarOptions"
      style="max-width: 1000px; margin: auto;"
  />
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { ref } from 'vue'

// Dữ liệu thô bạn cung cấp
const rawSchedule = [
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
]

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

// Mapping từ weekday sang ngày cụ thể để hiển thị (ví dụ giả định tuần 09/09/2024)
const weekDates = {
  monday: '2024-09-09',
  tuesday: '2024-09-10',
  wednesday: '2024-09-11',
  thursday: '2024-09-12',
  friday: '2024-09-13'
}

// Hàm convert dữ liệu rawSchedule sang events cho FullCalendar
const convertToEvents = () => {
  const events: any[] = []

  rawSchedule.forEach((slot) => {
    const [startTime, endTime] = slot.time.split('-')

    weekdays.forEach((day) => {
      const lessons = slot[day]
      if (lessons && lessons.length > 0) {
        lessons.forEach((lesson: any) => {
          events.push({
            title: `${lesson.class} - ${lesson.teacher} (${lesson.assistant})`,
            start: `${weekDates[day]}T${startTime}`,
            end: `${weekDates[day]}T${endTime}`,
            backgroundColor: lesson.teacherColor,
            borderColor: lesson.teacherColor
          })
        })
      }
    })
  })

  return events
}

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridWeek',
  headerToolbar: {
    left: '',
    center: 'title',
    right: ''
  },
  events: convertToEvents(),
  allDaySlot: false,
  editable: false,
  height: 'auto',
  firstDay: 1
})
</script>
