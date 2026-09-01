export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_INITIATED'
  | 'PAID'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED'

export interface Order {
  id: string
  order_ref: string
  name: string
  phone: string
  quantity: number
  location: string
  amount: number
  status: OrderStatus
  checkout_request_id: string | null
  merchant_request_id: string | null
  mpesa_receipt: string | null
  mpesa_code_submitted: string | null
  payment_method: 'stk' | 'till_manual'
  created_at: string
  updated_at: string
}

export interface CreateOrderResponse {
  message: string
  orderId: string
  orderRef: string
  checkoutRequestId?: string
}
