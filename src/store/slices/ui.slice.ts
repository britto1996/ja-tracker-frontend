import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortOrder = 'deadline-asc' | 'deadline-desc' | 'created-desc' | 'created-asc' | 'status';

export interface UIState {
  modalOpen: boolean;
  drawerOpen: boolean;
  globalLoading: boolean;
  filterStatus: string[];
  searchQuery: string;
  sortOrder: SortOrder;
  reminders: Array<{ id: string; type: 'due-soon' | 'overdue' | 'auto-archive'; message: string }>; // right rail
  // Pagination
  page: number;
  pageSize: number;
  // Reminders behavior
  autoArchiveEnabled: boolean;
}

const initialState: UIState = {
  modalOpen: false,
  drawerOpen: false,
  globalLoading: false,
  filterStatus: [],
  searchQuery: '',
  sortOrder: 'created-desc',
  reminders: [],
  page: 1,
  pageSize: 10,
  autoArchiveEnabled: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload;
    },
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.drawerOpen = action.payload;
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    setFilterStatus(state, action: PayloadAction<string[]>) {
      state.filterStatus = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.sortOrder = action.payload;
    },
    setReminders(
      state,
      action: PayloadAction<UIState['reminders']>,
    ) {
      state.reminders = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload);
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = Math.max(1, action.payload);
      state.page = 1; // reset to first page when size changes
    },
    setAutoArchiveEnabled(state, action: PayloadAction<boolean>) {
      state.autoArchiveEnabled = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
