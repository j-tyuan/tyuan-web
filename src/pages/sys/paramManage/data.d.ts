export interface TableListItem {
  id?: number;
  paramVal: string;
  remarks?: string;
  isSys: boolean;
  paramKey: Sring;
  paramName: Sring;
  updateTime?: Date;
  createTime?: Date;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
