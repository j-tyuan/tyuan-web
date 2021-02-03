import { Request, Response } from 'express';
const getNotices = (req: Request, res: Response) => {
  res.json([{
    "label":"aaa",
    "value":123
  }])
}
export default {
  'GET /api/sys/dict/getTypes1': getNotices,
};
