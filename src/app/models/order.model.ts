export interface Order {
  id: string;
  recipientName: string;
  address: {
    street: string;
    city: string;
    state: string;
    neighborhood: string;
    number: string;
    zipCode?: string;
  };
  status: 'Pendente' | 'Entregue';
  createdAt: Date;
  deliveredAt?: Date;
  deliveryProofImage?: string;
}
