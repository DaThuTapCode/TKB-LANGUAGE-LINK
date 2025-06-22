<template>
  <div class="schedule-container">
    <el-table
        :data="processedSchedule"
        border
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center', color: 'black' }"
    >
      <!-- Cột thời gian -->
      <el-table-column
          prop="time"
          label="Thời gian"
          width="120"
          fixed
      />

      <!-- Các cột theo ngày -->
      <el-table-column
          v-for="day in days"
          :key="day.key"
          :label="day.label"
          header-align="center"
      >
        <el-table-column
            v-for="(slot, index) in Array(day.maxSlots)"
            :key="`${day.key}-${index}`"
            :label="`Tiết ${index + 1}`"
            align="center"
        >
          <template #default="{ row }">
            <div
                class="schedule-cell"
                :style="getCellStyle(row[day.key]?.[index])"
                @click="handleSlotClick(row[day.key]?.[index])"
                @contextmenu.prevent="(e) => handleContextMenu(e, row, day.key, index)"
            >
              <template v-if="row[day.key]?.[index]">
                <div class="class-info">
                  <p class="class-name">{{ row[day.key][index].class }}</p>
                  <p class="teacher">{{ row[day.key][index].teacher }}</p>
                  <p class="assistant">{{ row[day.key][index].assistant }}</p>
                </div>
                <div v-if="isHovered(row.time, day.key, index)" class="slot-actions">
                  <el-button
                      circle
                      size="small"
                      type="primary"
                      @click.stop="handleEditSlot(row[day.key][index])"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button
                      circle
                      size="small"
                      type="danger"
                      @click.stop="handleDeleteSlot(row, day.key, index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </template>
              <div v-else class="empty-slot">
                <el-button
                    v-if="isHovered(row.time, day.key, index)"
                    circle
                    size="small"
                    type="success"
                    @click.stop="handleAddSlot(row, day.key, index)"
                >
                  <el-icon><Plus /></el-icon>
                </el-button>
                <span v-else>-</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <!-- Dialog thêm/sửa tiết học -->
    <el-dialog
        v-model="dialogVisible"
        :title="`${isEditing ? 'Sửa' : 'Thêm'} tiết học`"
        width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="Lớp học">
          <el-input v-model="form.class" />
        </el-form-item>
        <el-form-item label="Giáo viên">
          <el-input v-model="form.teacher" />
        </el-form-item>
        <el-form-item label="Trợ giảng">
          <el-input v-model="form.assistant" />
        </el-form-item>
        <el-form-item label="Màu GV">
          <el-color-picker v-model="form.teacherColor" />
        </el-form-item>
        <el-form-item label="Màu TG">
          <el-color-picker v-model="form.assistantColor" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'

interface ScheduleItem {
  time: string
  monday?: ClassSlot[]
  tuesday?: ClassSlot[]
  wednesday?: ClassSlot[]
  thursday?: ClassSlot[]
  friday?: ClassSlot[]
  saturday?: ClassSlot[]
  sunday?: ClassSlot[]
}

interface ClassSlot {
  class: string
  teacher: string
  teacherColor: string
  assistant: string
  assistantColor: string
}

interface DayConfig {
  key: string
  label: string
  maxSlots: number
}

// Props
const props = defineProps<{
  schedule: ScheduleItem[]
}>()

// State
const hoveredCell = ref<string | null>(null)
const dialogVisible = ref(false)
const isEditing = ref(false)
const currentEditInfo = ref<{
  rowIndex: number
  dayKey: string
  slotIndex: number
} | null>(null)

const form = reactive({
  class: '',
  teacher: '',
  teacherColor: '',
  assistant: '',
  assistantColor: ''
})

// Days configuration
const days = computed<DayConfig[]>(() => [
  { key: 'monday', label: 'Thứ 2', maxSlots: maxSlots.value.monday },
  { key: 'tuesday', label: 'Thứ 3', maxSlots: maxSlots.value.tuesday },
  { key: 'wednesday', label: 'Thứ 4', maxSlots: maxSlots.value.wednesday },
  { key: 'thursday', label: 'Thứ 5', maxSlots: maxSlots.value.thursday },
  { key: 'friday', label: 'Thứ 6', maxSlots: maxSlots.value.friday },
  { key: 'saturday', label: 'Thứ 7', maxSlots: maxSlots.value.saturday },
  { key: 'sunday', label: 'Chủ nhật', maxSlots: maxSlots.value.sunday }
])

// Tính toán số slot tối đa cho mỗi ngày
const maxSlots = computed(() => {
  const result = {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0
  }

  props.schedule.forEach(item => {
    Object.keys(result).forEach(day => {
      const dayKey = day as keyof typeof result
      if (item[dayKey] && item[dayKey]!.length > result[dayKey]) {
        result[dayKey] = item[dayKey]!.length
      }
    })
  })

  return result
})

// Xử lý dữ liệu schedule để đảm bảo mỗi ngày có đủ slot
const processedSchedule = computed(() => {
  return props.schedule.map(item => {
    const newItem: any = { ...item }
    days.value.forEach(day => {
      if (!newItem[day.key] || newItem[day.key].length < day.maxSlots) {
        newItem[day.key] = [...(newItem[day.key] || []), ...Array(day.maxSlots - (newItem[day.key]?.length || 0)).fill(null)]
      }
    })
    return newItem
  })
})

// Helper functions
const isHovered = (time: string, dayKey: string, slotIndex: number) => {
  return hoveredCell.value === `${time}-${dayKey}-${slotIndex}`
}

const getCellStyle = (slot: ClassSlot | null) => {
  if (!slot) return { backgroundColor: '#f9f9f9' }
  return { backgroundColor: slot.teacherColor }
}

// Event handlers
const handleSlotClick = (slot: ClassSlot | null) => {
  if (slot) {
    console.log('Slot clicked:', slot)
  }
}

const handleContextMenu = (event: MouseEvent, row: any, dayKey: string, slotIndex: number) => {
  if (row[dayKey][slotIndex]) {
    // Hiển thị menu ngữ cảnh nếu có slot
    console.log('Context menu:', row[dayKey][slotIndex])
  }
}

const handleAddSlot = (row: any, dayKey: string, slotIndex: number) => {
  isEditing.value = false
  form.class = ''
  form.teacher = ''
  form.teacherColor = '#ffffff'
  form.assistant = ''
  form.assistantColor = '#ffffff'
  currentEditInfo.value = {
    rowIndex: processedSchedule.value.findIndex(item => item.time === row.time),
    dayKey,
    slotIndex
  }
  dialogVisible.value = true
}

const handleEditSlot = (slot: ClassSlot) => {
  isEditing.value = true
  form.class = slot.class
  form.teacher = slot.teacher
  form.teacherColor = slot.teacherColor
  form.assistant = slot.assistant
  form.assistantColor = slot.assistantColor
  dialogVisible.value = true
}

const handleDeleteSlot = (row: any, dayKey: string, slotIndex: number) => {
  const scheduleIndex = processedSchedule.value.findIndex(item => item.time === row.time)
  if (scheduleIndex >= 0) {
    // Emit event hoặc xử lý xóa slot
    console.log('Delete slot:', { scheduleIndex, dayKey, slotIndex })
  }
}

const handleSubmit = () => {
  if (currentEditInfo.value) {
    const { rowIndex, dayKey, slotIndex } = currentEditInfo.value
    const newSlot: ClassSlot = {
      class: form.class,
      teacher: form.teacher,
      teacherColor: form.teacherColor,
      assistant: form.assistant,
      assistantColor: form.assistantColor
    }

    // Emit event hoặc cập nhật dữ liệu
    console.log('Save slot:', { rowIndex, dayKey, slotIndex, newSlot })
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.schedule-container {
  padding: 20px;
}

.schedule-cell {
  position: relative;
  height: 100px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.schedule-cell:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.class-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.class-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.teacher, .assistant {
  font-size: 12px;
}

.empty-slot {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.slot-actions {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
}
</style>