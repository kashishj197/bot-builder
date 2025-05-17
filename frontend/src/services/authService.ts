// services/authService.ts
import axios from "axios";
import { LoginRequest, LoginResponse } from "../types/models";

const API_URL = "http://localhost:8000";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};
