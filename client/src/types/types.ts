export enum AccountType {
    TIKTOK = 'tiktok',
    INSTAGRAM = 'instagram',
}
export interface Influencer {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    managerId: string;
    manager: Manager;
    accounts: Account[];
    addedAt: Date;
}
export interface Manager {
    id: string;
    firstName: string;
    lastName: string;
    influencers?: Influencer[];
}
export interface Account {
    id: string;
    username: string;
    type: AccountType;
    influencerId: string;
    influencer?: Influencer;
}