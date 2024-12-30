import React from 'react';
import './ListRow.scss';
import { Account } from '../../types/types';

interface ListRowProps {
    influencerFirstName: string;
    influencerLastName: string;
    managerFirstName: string;
    managerLastName: string;
    avatar?: string;
    addedDate: Date;
    accounts: Account[];
    onClick: (...args: any[]) => void;  
}

const ListRow: React.FC<ListRowProps> = ({influencerFirstName, influencerLastName, managerFirstName, avatar, addedDate, managerLastName, accounts, onClick}) => {
    return (
        <div className='list-row' onClick={onClick}>
            <div className='influencer-details'>
                <div className='influencer-container'>
                    <span className='influencer-name'>{influencerFirstName} {influencerLastName}</span>
                </div>
                <div className='influencer-added'>
                    <span>{new Date(addedDate).toLocaleDateString()}</span>
                </div>
                <div className='tiktok-accounts'>
                    <span>{accounts.filter((account) => account.type === "tiktok").length}</span>
                    <img src='./tiktokLogo.svg' alt='Tiktok logo'/>
                </div>
                <div className='instagram-accounts'>
                    <span>{accounts.filter((account) => account.type === "instagram").length}</span>
                    <img src='./instagramLogo.svg' alt='Instagram logo'/>
                </div>
            </div>
            <div className='manager-details'>
                <div className='manager-container'>
                    <span className='manager-name'>{managerFirstName} {managerLastName}</span>
                </div>
            </div>
        </div>
    );
}
export default ListRow;