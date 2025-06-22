<template>
  <div class="schedule-container">
    <!-- Toolbar với các action chính -->
    <div class="schedule-toolbar">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">Thêm tiết học</el-button>
        <el-button type="success" icon="el-icon-upload" @click="handleImport">Import Excel</el-button>
        <el-button type="warning" icon="el-icon-download" @click="handleExport">Export PDF</el-button>
      </el-button-group>

      <div class="toolbar-right">
        <el-button-group>
          <el-button :disabled="!canUndo" icon="el-icon-refresh-left" @click="undo"></el-button>
          <el-button :disabled="!canRedo" icon="el-icon-refresh-right" @click="redo"></el-button>
        </el-button-group>

        <el-radio-group v-model="viewMode" size="mini" @change="changeViewMode">
          <el-radio-button label="daily">Theo ngày</el-radio-button>
          <el-radio-button label="weekly">Theo tuần</el-radio-button>
          <el-radio-button label="teacher">Theo GV</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- Bảng thời khóa biểu chính -->
    <el-table
        :data="filteredSchedule"
        border
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center', color: 'black' }"
        :row-class-name="tableRowClassName"
        @cell-mouse-enter="handleCellHover"
        @cell-mouse-leave="handleCellLeave"
    >
      <!-- Cột thời gian -->
      <el-table-column
          prop="time"
          label="Thời gian"
          width="120"
          fixed
      />

      <!-- Các cột theo ngày -->
      <template v-for="day in daysWithMax" :key="day.key">
        <template v-if="day.max > 0">
          <el-table-column
              :label="day.label"
              header-align="center"
          >
            <el-table-column
                v-for="i in day.max"
                :key="`${day.key}-${i}`"
                :label="`Tiết ${i}`"
                align="center"
            >
              <template #default="{ row }">
                <div
                    class="schedule-cell"
                    :class="{ 'empty-slot': !row[day.key]?.[i - 1], 'conflict-slot': hasConflict(row[day.key]?.[i - 1]) }"
                    :style="getCellStyle(row[day.key]?.[i - 1])"
                    @click="handleClickDetail(row[day.key]?.[i - 1])"
                    @contextmenu.prevent="handleContextMenu($event, row, day.key, i - 1)"
                    draggable="true"
                    @dragstart="handleDragStart($event, day.key, i - 1, row)"
                    @dragover.prevent
                    @drop="handleDrop($event, day.key, i - 1, row)"
                >
                  <div v-if="row[day.key]?.[i - 1]" class="class-info">
                    <p class="class-name">{{ row[day.key][i - 1].class }}</p>
                    <p class="teacher">{{ row[day.key][i - 1].teacher }}</p>
                    <p class="assistant">{{ row[day.key][i - 1].assistant }}</p>
                    <div class="class-meta">
                      <el-tag v-if="row[day.key][i - 1].room" size="mini">{{ row[day.key][i - 1].room }}</el-tag>
                      <el-tag v-if="row[day.key][i - 1].type" size="mini" type="info">{{ row[day.key][i - 1].type }}</el-tag>
                    </div>
                  </div>
                  <div v-else class="empty-slot-content">
                    <span>Trống</span>
                  </div>

                  <div class="schedule-actions" v-show="hoveredCell === `${row.time}-${day.key}-${i}`">
                    <el-button
                        icon="el-icon-plus"
                        circle
                        size="mini"
                        @click.stop="showAddDialog(row.time, day.key, i - 1)">
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </template>

        <template v-else>
          <el-table-column
              :label="day.label"
              prop="empty"
              align="center"
          >
            <el-table-column align="center">
              <template #header>
                <span style="color: red; font-weight: bold;">Không có lịch</span>
              </template>
              <template #default="{ row }">
                <div
                    class="empty-day-cell"
                    @click.stop="showAddDialog(row.time, day.key, 0)"
                >
                  <span>-</span>
                  <el-button
                      v-show="hoveredCell === `${row.time}-${day.key}-0`"
                      icon="el-icon-plus"
                      circle
                      size="mini"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </template>
      </template>
    </el-table>

    <!-- Context Menu -->
    <div
        v-show="contextMenu.visible"
        class="context-menu"
        :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
        @click.stop
    >
      <div class="menu-item" @click="editSchedule">Sửa tiết học</div>
      <div class="menu-item" @click="deleteSchedule">Xóa tiết học</div>
      <div class="menu-item" @click="duplicateSchedule">Nhân bản</div>
      <div class="menu-divider"></div>
      <div class="menu-item" @click="checkConflicts">Kiểm tra xung đột</div>
    </div>

    <!-- Dialog thêm/sửa tiết học -->
    <el-dialog
        :title="`${isEditing ? 'Sửa' : 'Thêm'} tiết học`"
        :visible.sync="dialogVisible"
        width="50%"
    >
      <el-form :model="form" label-width="120px" :rules="rules" ref="form">
        <el-form-item label="Môn học" prop="class">
          <el-select v-model="form.class" filterable placeholder="Chọn môn">
            <el-option
                v-for="item in classOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Giáo viên" prop="teacher">
          <el-select v-model="form.teacher" filterable placeholder="Chọn giáo viên">
            <el-option
                v-for="teacher in teacherOptions"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Trợ giảng" prop="assistant">
          <el-select v-model="form.assistant" filterable placeholder="Chọn trợ giảng">
            <el-option
                v-for="assistant in assistantOptions"
                :key="assistant.id"
                :label="assistant.name"
                :value="assistant.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Phòng học" prop="room">
              <el-input v-model="form.room"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Loại tiết" prop="type">
              <el-select v-model="form.type" placeholder="Chọn loại">
                <el-option label="Lý thuyết" value="theory"></el-option>
                <el-option label="Thực hành" value="practice"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Ghi chú" prop="note">
          <el-input type="textarea" v-model="form.note"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="saveSchedule">Lưu</el-button>
      </div>
    </el-dialog>

    <!-- Dialog xem trước -->
    <el-dialog title="Xem trước thời khóa biểu" :visible.sync="previewDialogVisible" width="70%">
      <div class="preview-container">
        <div v-for="day in days" :key="day.key" class="preview-day">
          <h3>{{ day.label }}</h3>
          <div v-for="(slot, index) in previewData[day.key]" :key="index" class="preview-slot">
            <span class="time">{{ slot.time }}</span>
            <span class="class">{{ slot.class }} ({{ slot.teacher }})</span>
            <span class="room">{{ slot.room }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TimeTableElementPlusPlus',
  data() {
    return {
      schedule: [
        // Mẫu dữ liệu
        {
          time: '07:00 - 08:30',
          mon: [
            { class: 'Toán', teacher: 'Nguyễn Văn A', assistant: 'Trần Thị B', room: '101', type: 'theory', color: '#f0f9ff' }
          ],
          tue: [],
          wed: [
            { class: 'Văn', teacher: 'Phạm Văn C', assistant: '', room: '202', type: 'theory', color: '#fff7f0' },
            { class: 'Anh', teacher: 'Lê Thị D', assistant: 'Nguyễn Văn E', room: '303', type: 'practice', color: '#f6ffed' }
          ],
          thu: [],
          fri: [],
          sat: [],
          sun: []
        },
        // Thêm các khung giờ khác...
      ],
      daysWithMax: [
        { key: 'mon', label: 'Thứ 2', max: 1 },
        { key: 'tue', label: 'Thứ 3', max: 0 },
        { key: 'wed', label: 'Thứ 4', max: 2 },
        { key: 'thu', label: 'Thứ 5', max: 0 },
        { key: 'fri', label: 'Thứ 6', max: 0 },
        { key: 'sat', label: 'Thứ 7', max: 0 },
        { key: 'sun', label: 'CN', max: 0 }
      ],
      hoveredCell: null,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        row: null,
        day: null,
        slot: null
      },
      dialogVisible: false,
      isEditing: false,
      form: {
        class: '',
        teacher: '',
        assistant: '',
        room: '',
        type: '',
        note: ''
      },
      rules: {
        class: [{ required: true, message: 'Vui lòng chọn môn học', trigger: 'blur' }],
        teacher: [{ required: true, message: 'Vui lòng chọn giáo viên', trigger: 'blur' }]
      },
      classOptions: [
        { value: 'Toán', label: 'Toán học' },
        { value: 'Văn', label: 'Ngữ văn' },
        { value: 'Anh', label: 'Tiếng Anh' }
        // Thêm các môn khác...
      ],
      teacherOptions: [
        { id: 't1', name: 'Nguyễn Văn A' },
        { id: 't2', name: 'Phạm Văn C' },
        { id: 't3', name: 'Lê Thị D' }
        // Thêm GV khác...
      ],
      assistantOptions: [
        { id: 'a1', name: 'Trần Thị B' },
        { id: 'a2', name: 'Nguyễn Văn E' }
        // Thêm TG khác...
      ],
      viewMode: 'weekly',
      scheduleHistory: [],
      currentHistoryIndex: -1,
      previewDialogVisible: false,
      previewData: {}
    }
  },
  computed: {
    filteredSchedule() {
      // Lọc dữ liệu theo viewMode
      return this.schedule;
    },
    canUndo() {
      return this.currentHistoryIndex > 0;
    },
    canRedo() {
      return this.currentHistoryIndex < this.scheduleHistory.length - 1;
    },
    days() {
      return this.daysWithMax.filter(day => day.max > 0);
    }
  },
  created() {
    this.saveHistory();
  },
  methods: {
    getCellStyle(slot) {
      if (!slot) return { backgroundColor: '#f9f9f9' };
      return {
        backgroundColor: slot.color || '#ffffff',
        borderLeft: `4px solid ${this.getStatusColor(slot)}`
      };
    },
    getStatusColor(slot) {
      // Logic xác định màu theo trạng thái
      return '#409EFF';
    },
    hasConflict(slot) {
      if (!slot) return false;
      // Logic kiểm tra xung đột
      return false;
    },
    handleCellHover(row, column, cell, event) {
      const [day, slot] = this.parseCellId(column.id);
      this.hoveredCell = `${row.time}-${day}-${slot}`;
    },
    handleCellLeave() {
      this.hoveredCell = null;
    },
    parseCellId(columnId) {
      // Phân tích ID cột để lấy thông tin ngày và slot
      const parts = columnId.split('_');
      return [parts[1], parseInt(parts[2]) + 1];
    },
    handleClickDetail(slot) {
      if (slot) {
        this.form = { ...slot };
        this.isEditing = true;
        this.dialogVisible = true;
      }
    },
    handleContextMenu(event, row, day, slotIndex) {
      this.contextMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        row,
        day,
        slot: slotIndex
      };
    },
    handleDragStart(event, day, slotIndex, row) {
      if (!row[day][slotIndex]) return;

      event.dataTransfer.setData('text/plain', JSON.stringify({
        day,
        slotIndex,
        time: row.time,
        data: row[day][slotIndex]
      }));
    },
    handleDrop(event, day, slotIndex, row) {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));

      // Kiểm tra xung đột
      if (this.checkConflict(row.time, day, slotIndex, data.data)) {
        this.$message.error('Xung đột lịch dạy!');
        return;
      }

      // Di chuyển dữ liệu
      this.$set(row[day], slotIndex, data.data);
      this.$set(data.row[data.day], data.slotIndex, null);

      this.saveHistory();
    },
    checkConflict(time, day, slotIndex, newData) {
      // Logic kiểm tra xung đột
      return false;
    },
    showAddDialog(time, day, slotIndex) {
      this.form = {
        time,
        day,
        slotIndex,
        class: '',
        teacher: '',
        assistant: '',
        room: '',
        type: '',
        note: ''
      };
      this.isEditing = false;
      this.dialogVisible = true;
    },
    saveSchedule() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { day, slotIndex } = this.form;
          const time = this.form.time;

          // Tìm row tương ứng với thời gian
          const row = this.schedule.find(r => r.time === time);
          if (row) {
            this.$set(row[day], slotIndex, { ...this.form });
            this.saveHistory();
            this.dialogVisible = false;
            this.$message.success('Lưu thành công!');
          }
        }
      });
    },
    editSchedule() {
      if (this.contextMenu.row && this.contextMenu.day && this.contextMenu.slot !== null) {
        const slot = this.contextMenu.row[this.contextMenu.day][this.contextMenu.slot];
        if (slot) {
          this.form = { ...slot };
          this.isEditing = true;
          this.dialogVisible = true;
        }
      }
      this.contextMenu.visible = false;
    },
    deleteSchedule() {
      if (this.contextMenu.row && this.contextMenu.day && this.contextMenu.slot !== null) {
        this.$set(this.contextMenu.row[this.contextMenu.day], this.contextMenu.slot, null);
        this.saveHistory();
        this.$message.success('Đã xóa tiết học');
      }
      this.contextMenu.visible = false;
    },
    duplicateSchedule() {
      // Logic nhân bản tiết học
      this.contextMenu.visible = false;
    },
    checkConflicts() {
      // Logic kiểm tra xung đột
      this.contextMenu.visible = false;
    },
    saveHistory() {
      this.scheduleHistory = this.scheduleHistory.slice(0, this.currentHistoryIndex + 1);
      this.scheduleHistory.push(JSON.parse(JSON.stringify(this.schedule)));
      this.currentHistoryIndex = this.scheduleHistory.length - 1;
    },
    undo() {
      if (this.canUndo) {
        this.currentHistoryIndex--;
        this.schedule = JSON.parse(JSON.stringify(this.scheduleHistory[this.currentHistoryIndex]));
      }
    },
    redo() {
      if (this.canRedo) {
        this.currentHistoryIndex++;
        this.schedule = JSON.parse(JSON.stringify(this.scheduleHistory[this.currentHistoryIndex]));
      }
    },
    changeViewMode() {
      // Logic thay đổi chế độ xem
    },
    handleImport() {
      // Logic import từ Excel
    },
    handleExport() {
      // Logic export PDF
      this.generatePreviewData();
      this.previewDialogVisible = true;
    },
    generatePreviewData() {
      // Tạo dữ liệu xem trước
      this.previewData = {};
      this.daysWithMax.forEach(day => {
        if (day.max > 0) {
          this.previewData[day.key] = [];
          this.schedule.forEach(row => {
            for (let i = 0; i < day.max; i++) {
              if (row[day.key] && row[day.key][i]) {
                this.previewData[day.key].push({
                  time: row.time,
                  ...row[day.key][i]
                });
              }
            }
          });
        }
      });
    },
    tableRowClassName({ row }) {
      // Thêm class cho row nếu cần
      return '';
    }
  }
}
</script>

<style scoped>
.schedule-container {
  padding: 20px;
}

.schedule-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.schedule-cell {
  position: relative;
  height: 100%;
  min-height: 100px;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.schedule-cell:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.empty-slot {
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot-content {
  color: #999;
}

.conflict-slot {
  animation: pulse 1.5s infinite;
  border: 2px dashed red;
}

.class-info {
  margin-bottom: 8px;
}

.class-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.teacher, .assistant {
  font-size: 12px;
  color: #666;
  margin: 2px 0;
}

.class-meta {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.schedule-actions {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.empty-day-cell {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.context-menu {
  position: fixed;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 2000;
  padding: 5px 0;
}

.menu-item {
  padding: 8px 20px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-divider {
  height: 1px;
  background-color: #ebeef5;
  margin: 5px 0;
}

.preview-container {
  display: flex;
  gap: 20px;
}

.preview-day {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

.preview-day h3 {
  margin-top: 0;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.preview-slot {
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.preview-slot .time {
  display: block;
  font-size: 12px;
  color: #666;
}

.preview-slot .class {
  font-weight: bold;
}

.preview-slot .room {
  font-size: 12px;
  color: #409EFF;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 0.4; }
  100% { opacity: 0.8; }
}
</style>