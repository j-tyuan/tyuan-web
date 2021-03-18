export interface TableListItem {
  userType: any | 0 | 1;
  disabled: any;
  id: number;
  updateDate: Date;
  createDate: Date;

  empNo: string,
  empName: string;
  empNameEn: string;
  instId: number;
  instName: string;

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
