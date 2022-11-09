import { TransactionSide, TransactionStatus } from '../enums';

export interface Transaction {
  id: string;
  uuid: string;
  token: string;
  side: TransactionSide;
  amount: number;
  tx_id: string;
  fee: number;
  trans_status: TransactionStatus;
  created_time: number;
  updated_time: number;
}
