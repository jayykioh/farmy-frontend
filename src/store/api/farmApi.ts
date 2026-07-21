import { baseApi } from './baseApi';
import type { FarmPlot, Diary, DiaryLog, Reminder } from '../../api/farm';
import type { PlantScanHistoryResponse, PlantScanResult } from '../../types/plantScan';

export const farmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Plots
    getPlots: builder.query<FarmPlot[], void>({
      query: () => ({ url: '/plots' }),
      transformResponse: (response: { data: FarmPlot[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Plot' as const, id: _id })),
              { type: 'Plot', id: 'LIST' },
            ]
          : [{ type: 'Plot', id: 'LIST' }],
    }),
    createPlot: builder.mutation<FarmPlot, Omit<FarmPlot, '_id' | 'user_id'>>({
      query: (plot) => ({
        url: '/plots',
        method: 'POST',
        data: plot,
      }),
      transformResponse: (response: { data: FarmPlot }) => response.data,
      invalidatesTags: [{ type: 'Plot', id: 'LIST' }],
    }),

    // 2. Diaries
    getDiaries: builder.query<Diary[], void>({
      query: () => ({ url: '/diaries' }),
      transformResponse: (response: { data: Diary[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Diary' as const, id: _id })),
              { type: 'Diary', id: 'LIST' },
            ]
          : [{ type: 'Diary', id: 'LIST' }],
    }),
    getDiaryDetail: builder.query<Diary, string>({
      query: (id) => ({ url: `/diaries/${id}` }),
      transformResponse: (response: { data: Diary }) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Diary', id }],
    }),
    createDiary: builder.mutation<Diary, { plot_id: string; crop_type: string; season: string; start_date: string }>({
      query: (diary) => ({
        url: '/diaries',
        method: 'POST',
        data: diary,
      }),
      transformResponse: (response: { data: Diary }) => response.data,
      invalidatesTags: [{ type: 'Diary', id: 'LIST' }],
    }),
    updateDiary: builder.mutation<Diary, { id: string; data: Partial<{ plot_id: string; crop_type: string; season: string; start_date: string; status: string }> }>({
      query: ({ id, data }) => ({
        url: `/diaries/${id}`,
        method: 'PUT',
        data,
      }),
      transformResponse: (response: { data: Diary }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Diary', id },
        { type: 'Diary', id: 'LIST' },
      ],
    }),
    deleteDiary: builder.mutation<void, string>({
      query: (id) => ({
        url: `/diaries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Diary', id },
        { type: 'Diary', id: 'LIST' },
      ],
    }),

    // 3. Diary Logs
    getDiaryLogs: builder.query<DiaryLog[], string>({
      query: (diaryId) => ({ url: `/diaries/${diaryId}/logs` }),
      transformResponse: (response: { data: DiaryLog[] }) => response.data,
      providesTags: (result, _error, diaryId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'DiaryLog' as const, id: _id })),
              { type: 'DiaryLog', id: `LIST_${diaryId}` },
            ]
          : [{ type: 'DiaryLog', id: `LIST_${diaryId}` }],
    }),
    createDiaryLog: builder.mutation<
      DiaryLog,
      {
        diaryId: string;
        log: { activity_type: string; content: string; image_url?: string; photo_urls?: string[] };
        idempotencyKey?: string;
        requestHash?: string;
      }
    >({
      query: ({ diaryId, log, idempotencyKey, requestHash }) => ({
        url: `/diaries/${diaryId}/logs`,
        method: 'POST',
        data: log,
        headers: {
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
          ...(requestHash ? { 'X-Request-Hash': requestHash } : {}),
        },
      }),
      transformResponse: (response: { data: DiaryLog }) => response.data,
      invalidatesTags: (_result, _error, { diaryId }) => [
        { type: 'DiaryLog', id: `LIST_${diaryId}` },
      ],
    }),
    deleteDiaryLog: builder.mutation<void, { diaryId: string; logId: string }>({
      query: ({ logId }) => ({
        url: `/diaries/logs/${logId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { diaryId }) => [
        { type: 'DiaryLog', id: `LIST_${diaryId}` },
      ],
    }),

    // 4. Reminders
    getPendingReminders: builder.query<Reminder[], void>({
      query: () => ({ url: '/reminders/pending' }),
      transformResponse: (response: { data: Reminder[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Reminder' as const, id: _id })),
              { type: 'Reminder', id: 'LIST' },
            ]
          : [{ type: 'Reminder', id: 'LIST' }],
    }),
    completeReminder: builder.mutation<Reminder, string>({
      query: (id) => ({
        url: `/reminders/${id}/complete`,
        method: 'PATCH',
      }),
      transformResponse: (response: { data: Reminder }) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: 'Reminder', id },
        { type: 'Reminder', id: 'LIST' },
      ],
    }),
    cancelReminder: builder.mutation<Reminder, string>({
      query: (id) => ({
        url: `/reminders/${id}/cancel`,
        method: 'PATCH',
      }),
      transformResponse: (response: { data: Reminder }) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: 'Reminder', id },
        { type: 'Reminder', id: 'LIST' },
      ],
    }),
    createReminder: builder.mutation<
      Reminder,
      { title: string; remind_at: string; diary_id: string; repeat?: 'none' | 'daily' | 'weekly' }
    >({
      query: (reminder) => ({
        url: '/reminders',
        method: 'POST',
        data: reminder,
      }),
      transformResponse: (response: { data: Reminder }) => response.data,
      invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
    }),


    // 5. Plant Scan
    uploadPlantScan: builder.mutation<PlantScanResult, FormData>({
      query: (formData) => ({
        url: '/plant-scans',
        method: 'POST',
        data: formData,
      }),
      transformResponse: (response: { data: PlantScanResult }) => response.data,
      invalidatesTags: [{ type: 'PlantScan', id: 'LIST' }],
    }),
    getPlantScans: builder.query<PlantScanHistoryResponse, void>({
      query: () => ({ url: '/plant-scans', params: { limit: 30 } }),
      transformResponse: (response: { data: PlantScanHistoryResponse }) => response.data,
      providesTags: [{ type: 'PlantScan', id: 'LIST' }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetPlotsQuery,
  useCreatePlotMutation,
  useGetDiariesQuery,
  useGetDiaryDetailQuery,
  useCreateDiaryMutation,
  useGetDiaryLogsQuery,
  useCreateDiaryLogMutation,
  useDeleteDiaryLogMutation,
  useGetPendingRemindersQuery,
  useCompleteReminderMutation,
  useCancelReminderMutation,
  useCreateReminderMutation,
  useUploadPlantScanMutation,
  useGetPlantScansQuery,
  useUpdateDiaryMutation,
  useDeleteDiaryMutation,
} = farmApi;
