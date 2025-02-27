export interface User {
    id: string;
    email: string;
    subscription?: Subscription;
}

export interface Subscription {
    id: string;
    status: SubscriptionStatuses;
    type: SubscriptionTypes;
}

export type SubscriptionTypes = 'monthly' | 'ondemand';

export type SubscriptionStatuses = |
    'active' |
    'past_due' |
    'unpaid' |
    'canceled' |
    'incomplete' |
    'incomplete_expired' |
    'trialing' |
    'paused';

export interface Offerings {
    pairCode: PairCodeOffering | null;
    workshop: WorkshopOffering | null;
}

export interface PairCodeOffering {
    productId: string;
    productName: string;
    monthlyPrice: OfferingPrice;
    onDemandPrice?: OfferingPrice;
}

export interface WorkshopOffering {
    productId: string;
    productName: string;
    perSeatPrice: OfferingPrice;
}

export interface OfferingPrice {
    id: string;
    currency: string;
    unit_amount: number;
    lookup_key: string;
    nickname: string;
    formatted: string; // Added on client at load time
}

export type ClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
export type InputHandler = React.ChangeEventHandler<HTMLInputElement>;
export type SubmitHandler = React.FormEventHandler<HTMLFormElement>;