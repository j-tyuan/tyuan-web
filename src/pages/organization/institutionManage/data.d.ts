export interface TableListItem {
  id: number;
  parentId: number;
  instName: string;
  instCode: string;
  instType: number;
  instStatus: number;
  instDesc: string;
  ownerUserId:number;
  updateTime: Date;
  createTime: Date;
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
