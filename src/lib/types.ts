import { Prisma } from "@prisma/client";

export interface ModifiedRow {
  index: number;
  data: any[];
  isNew: boolean;
}

export interface DeletedRow {
  id: string | number; // Assuming each row has a unique identifier
}

export type OrderInput = Prisma.OrderCreateInput;