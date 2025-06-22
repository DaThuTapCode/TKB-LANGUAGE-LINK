<script setup lang="ts">
import TimetableGrid from './components/TimetableGrid.vue'
import TimeTableElementPlus from './components/TimeTableElementPlus.vue'
import TableExample from './components/TableExample.vue'

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
    <br>
    <TimetableGrid/>
    <br>
    <TimeTableElementPlus/>
    <br>
    <TableExample/>
    <br>
  </div>
</template>

<style scoped>

</style>
