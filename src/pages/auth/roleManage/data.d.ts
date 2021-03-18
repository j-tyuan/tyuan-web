export interface TableListItem {
  disabled: any;
  id: number;
  updateDate: Date;
  createDate: Date;

  name: string;
  href: string;
  target: string;
  sort?: any;
  parentId?: any;
  icon: string;
  isLeaf: boolean;
  isShow: boolean;
  permissionId?: any;
  children: Array;
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
