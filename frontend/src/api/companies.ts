import { http } from './axios';
import type {
  ApiListResponse,
  ApiSingleResponse,
  Company,
  CompanySort,
} from '../types';

export interface CompanyQuery {
  search?: string;
  city?: string;
  sort?: CompanySort;
}

export interface CreateCompanyPayload {
  name: string;
  description?: string;
  address: string;
  city: string;
  foundedOn: string;
  logoText?: string;
  logoBgColor?: string;
}

export const fetchCompanies = async (
  params: CompanyQuery = {}
): Promise<Company[]> => {
  const { data } = await http.get<ApiListResponse<Company>>('/companies', {
    params,
  });
  return data.data;
};

export const fetchCompanyById = async (id: string): Promise<Company> => {
  const { data } = await http.get<ApiSingleResponse<Company>>(`/companies/${id}`);
  return data.data;
};

export const createCompany = async (
  payload: CreateCompanyPayload
): Promise<Company> => {
  const { data } = await http.post<ApiSingleResponse<Company>>(
    '/companies',
    payload
  );
  return data.data;
};
