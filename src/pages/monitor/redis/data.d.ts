export interface TableListItem {
  id: number;
  updateDate: Date;
  createDate: Date;

  value: string;
  label: string;
  type: boolean;
  sort?: any;
  parentId?: any;
  createBy: string;
  updateBy: string;
  remarks: string;
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
