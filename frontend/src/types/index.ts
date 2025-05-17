import { store } from "../app/store";
export type ExampleType = {
  id: number;
  name: string;
  description?: string;
};

export interface RootState {
  example: ExampleType[];
}

export type AppDispatch = typeof store.dispatch;
