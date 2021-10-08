export interface TableListItem {
  id: number;
  updateTime: Date;
  createTime: Date;

  dictValue: string;
  dictLabel: string;
  dictType: boolean;
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
