export interface TableListItem {
  id: number;
  requestId: string;
  updateDate: Date;
  createDate: Date;
  type: string;
  title: string;
  userName: string;
  userId: any;
  remoteAddr: string;
  userAgent: string;
  requestUri: string;
  method: string;
  exception: string;
  duration:any;

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
