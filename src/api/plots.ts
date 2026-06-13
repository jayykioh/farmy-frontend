import { api, type ApiResponse } from './client';

export type Plot = {
  _id: string;
  user_id: string;
  name: string;
  area_size: number;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type CreatePlotPayload = {
  name: string;
  area_size: number;
  description?: string;
};

export type UpdatePlotPayload = Partial<CreatePlotPayload>;

export const fetchPlots = async () => {
  const { data } = await api.get<ApiResponse<Plot[]>>('/plots');
  return data.data;
};

export const fetchPlot = async (id: string) => {
  const { data } = await api.get<ApiResponse<Plot>>(`/plots/${id}`);
  return data.data;
};

export const createPlot = async (payload: CreatePlotPayload) => {
  const { data } = await api.post<ApiResponse<Plot>>('/plots', payload);
  return data.data;
};

export const updatePlot = async (id: string, payload: UpdatePlotPayload) => {
  const { data } = await api.put<ApiResponse<Plot>>(`/plots/${id}`, payload);
  return data.data;
};

export const deletePlot = async (id: string) => {
  await api.delete(`/plots/${id}`);
};
