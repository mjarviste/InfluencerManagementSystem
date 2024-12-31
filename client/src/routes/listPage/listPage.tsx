import React, { useEffect, useState, ChangeEvent } from "react";
import Button from "../../components/button/Button";
import ListRow from "../../components/listrow/ListRow";
import './listPage.scss'
import { Account, Influencer, Manager } from '../../types/types';
import { Link } from "react-router-dom";
import api from "../../utils/api";

const ListPage: React.FC = () => {

    const [influencers, setInfluencers] = useState<Influencer[] | null>(null);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activeAccounts, setActiveAccounts] = useState<Account[]>([]);

    const [editActive, setEditActive] = useState(false);
    const [accountEditActive, setAccountEditActive] = useState(false);
    const [loading, setLoading] = useState(true);

    const [activeFirstName, setActiveFirstName] = useState('');
    const [activeLastName, setActiveLastName] = useState('');
    const [activeId, setActiveId] = useState('');
    const [activeManagerId, setActiveManagerId] = useState('');
    const [activeManagerFirstName, setActiveManagerFirstName] = useState('');
    const [activeManagerLastName, setActiveManagerLastName] = useState('');
    const [activeUsername, setActiveUsername] = useState('');
    const [type, setType] = useState<'instagram' | 'tiktok' | "">("");

    const fetchInfluencers = async (): Promise<Influencer[]> => {
        const response = await api.get('/api/influencers');
        return response.data;
    };

    const getInfluencers = async () => {
        try {
            setLoading(true);
            const data = await fetchInfluencers();
            setInfluencers(data);
            const uniqueManagers: Manager[] = [];
            const seenIds = new Set();
            data.map((influencer) => influencer.manager).forEach(manager => {
                if (!seenIds.has(manager.id)) {
                    seenIds.add(manager.id);
                    uniqueManagers.push(manager);
                }
            });

            setManagers(uniqueManagers)
        } catch (error) {
            console.error('Failed to fetch influencers:', error);
        } finally {
            setLoading(false);
        }

    };

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/api/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        }
    };

    const fetchInfluencersByManager = async (event: ChangeEvent<HTMLSelectElement>): Promise<void> => {
        const managerId = event.target.value;
        if (managerId === "all") {
            setInfluencers(await fetchInfluencers());
        }
        else {
            const response = await api.get('/api/influencers/by-manager', {
                params: { managerId },
            });
            setInfluencers(response.data);
        }
    };

    const fetchSearchInfluencers = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const searchTerm = event.target.value;
        if (searchTerm.length >= 2) {
            try {
                const response = await api.get('/api/influencers/search', {
                    params: { name: searchTerm },
                });
                setInfluencers(response.data);
            } catch (error) {
                console.error('Failed to fetch search results:', error);
            }
        } else {
            setInfluencers(await fetchInfluencers());
        }
    };

    const onInfluencerClick = async (id: string): Promise<void> => {
        setEditActive(true);
        const influencer = influencers?.find((influencer) => influencer.id === id);

        if (influencer) {
            setActiveFirstName(influencer.firstName);
            setActiveLastName(influencer.lastName);
            setActiveManagerFirstName(influencer.manager.firstName);
            setActiveManagerLastName(influencer.manager.lastName);
            setActiveManagerId(influencer.manager.id);
            setActiveAccounts(influencer.accounts);
            setActiveId(influencer.id);
        }
        else {
            alert("Influencer not found!")
            console.error("Influencer not found!");
            setActiveFirstName("");
            setActiveLastName("");
            setActiveManagerFirstName("");
            setActiveManagerLastName("");
            setActiveId("");
        }
    }

    const handleAddAccount = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        if (accounts.length === 0) {
            await fetchAccounts();
        }
        if (!activeUsername || !type) {
            alert('Please provide both username and account type');
            return;
        }
        const accountExists = accounts.some(
            (account) => account.username === activeUsername && account.type === type
        );
        if (accountExists) {
            alert('This account already exists');
            return;
        }
        if (activeAccounts.some((account) => account.username === activeUsername && account.type === type)) {
            alert('This account already exists');
            return;
        }
        try {
            const response = await api.post(
                `/api/accounts`,
                {
                    influencerId: activeId,
                    username: activeUsername,
                    type: type,
                }
            );
            setActiveAccounts([...activeAccounts, response.data]);
            setActiveUsername('');
            setInfluencers(await fetchInfluencers());
            setType('');
        } catch (error) {
            console.error('Failed to add account:', error);
            alert('Failed to add account');
        }
    }

    const handleDeleteAccount = async (accountId: string): Promise<void> => {
        try {
            await api.delete(`/api/accounts/${accountId}`);
            setActiveAccounts((prevActiveAccounts) => prevActiveAccounts.filter(
                (account) => account.id !== accountId))
            setInfluencers(await fetchInfluencers());
        } catch (error) {
            console.error("Failed to delete account:", error);
            alert("Error deleting account. Please try again.");
        }
    }

    const onEditBackClick = async () => {
        setEditActive(false);
        setAccountEditActive(false);
        setAccounts([]);
    }

    const handleDeleteInfluencer = async (influencerId: string) => {
        try {
            await api.delete(`/api/influencers/${influencerId}`);
            setInfluencers((prevInfluencers) =>
                prevInfluencers ? prevInfluencers.filter((influencer) => influencer.id !== influencerId) : []
            );
            alert("Influencer Deleted!");
            onEditBackClick();
        } catch (error) {
            console.error("Failed to delete influencer:", error);
            alert("Error deleting influencer. Please try again.");
        }
    }

    const handleManagerChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newManagerId = event.target.value;
        setActiveManagerId(newManagerId);
        try {
            await api.put(`/api/influencers/${activeId}`,
                { managerId: newManagerId }
            );
            const newManager = managers.find((manager) => manager.id === newManagerId);
            setActiveManagerFirstName(newManager!.firstName);
            setActiveManagerLastName(newManager!.lastName);
            setInfluencers(await fetchInfluencers());

            alert("Manager updated successfully!");
        } catch (error) {
            console.error("Failed to update manager:", error);
            alert("Error updating manager. Please try again.");
        }
    }

    useEffect(() => {
        getInfluencers();
    }, []);

    return (
        <div id="list-page">
            {loading ? (
                <div id="loader-wrapper">
                    <div id="loader"></div>
                </div>
            ) : (
                <>
                    <div id="list-contents-container" className={editActive ? 'hidden' : ''}>
                        <div id="list-heading-container">
                            <h1>Influencers list</h1>
                            <Link to={'/add-influencer'}>
                                <Button className="add-influencer-btn" label="Add Influencer" />
                            </Link>
                        </div>
                        <div id="list-search-filter-container">
                            <div id="list-search-wrapper">
                                <input id="list-search" type="text" placeholder="Search" onChange={fetchSearchInfluencers} />
                            </div>
                            <div id="list-filter-wrapper">
                                <select name="managers" id="list-filter" defaultValue="none" onChange={fetchInfluencersByManager} >
                                    <option id="filter-placeholder" value="none" disabled hidden>Filter By Manager</option>
                                    <option id="filter-show-all" value="all">Show All</option>
                                    {managers.map((manager) => (
                                        <option key={manager.id} value={manager.id}>{manager.firstName} {manager.lastName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div id="list-influencers">
                            <div id="list-influencers-container">
                                <div id="list-influencers-header">
                                    <div id='header-influencer-details'>
                                        <div id='header-influencer-name-wrapper'>
                                            <span id='header-influencer-name'>Influencer</span>
                                        </div>
                                        <div id='header-influencer-added-wrapper'>
                                            <span id='header-influencer-added'>Added</span>
                                        </div>
                                        <div id='header-tiktok-accounts-wrapper'>
                                            <span id='header-tiktok-accounts'>Tiktok</span>
                                        </div>
                                        <div id='header-instagram-accounts-wrapper'>
                                            <span id='header-instagram-accounts'>Instagram</span>
                                        </div>
                                    </div>
                                    <div id='header-manager-details'>
                                        <div id='header-manager-wrapper'>
                                            <span id='header-manager-name'>Manager</span>
                                        </div>
                                    </div>
                                </div>
                                {influencers?.map((influencer) => (
                                    <ListRow
                                        key={influencer.id}
                                        influencerFirstName={influencer.firstName}
                                        influencerLastName={influencer.lastName}
                                        managerFirstName={influencer.manager.firstName}
                                        managerLastName={influencer.manager.lastName}
                                        addedDate={influencer.addedAt}
                                        accounts={influencer.accounts}
                                        onClick={() => onInfluencerClick(influencer.id)}>
                                    </ListRow>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div id="edit-influencer" className={editActive ? "active" : ""}>
                        <div id="edit-influencer-content">
                            <div id="close-edit-influencer" onClick={onEditBackClick}>
                                <img src="./deleteImg.svg" alt="Close window X" />
                            </div>
                            <div id="edit-influencer-details">
                                <div id="influencer-details-container">
                                    <h2>{activeFirstName} {activeLastName}</h2>
                                    <h4>Manager: {activeManagerFirstName} {activeManagerLastName}</h4>
                                </div>
                                <Button className="edit-btn" label={accountEditActive ? "Done" : "Edit"} onClick={() => setAccountEditActive(!accountEditActive)} />
                            </div>
                            <div className='username-container'>
                                <h4>Accounts</h4>
                                <div className="accounts-list-container">
                                    {activeAccounts.map((account, index) => (
                                        <div className="new-account-container" key={index}>
                                            <div className="new-account">
                                                <span>{index + 1}. {account.username}</span>
                                                <div className="new-account-imgs">
                                                    <div className='social-logo-wrapper'>
                                                        {account.type === "tiktok" ?
                                                            (<img src='./tiktokLogo.svg' />) :
                                                            (<img src='./instagramLogo.svg' />)}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className={accountEditActive ? 'delete-btn active' : 'delete-btn'} label={"Delete"} variant="tertiary" onClick={() => handleDeleteAccount(account.id)} />
                                        </div>
                                    ))}
                                </div>
                                <label id="new-username-label" className={accountEditActive ? 'active' : ''} htmlFor="active-username">Add Social Media Account</label>
                                <div className={accountEditActive ? 'username-details-container active' : 'username-details-container'}>
                                    <input className='form-el' id="accont-username" type="text" name='active-username' placeholder='johndoe123' value={activeUsername} onChange={(e) => setActiveUsername(e.target.value)} />
                                    <div className='radio-btn-container'>
                                        <img src='./instagramLogoGrey.svg' alt='Instagram logo' />
                                        <input
                                            type='radio'
                                            id="instagram-radio"
                                            name="instagram-radio"
                                            value="instagram"
                                            checked={type === "instagram"}
                                            onChange={() => setType("instagram")}>
                                        </input>
                                    </div>
                                    <div className='radio-btn-container'>
                                        <img src='./tiktokLogoGrey.svg' alt='Tiktok logo' />
                                        <input
                                            type='radio'
                                            id="tiktok-radio"
                                            name="tiktok-radio"
                                            value="tiktok"
                                            checked={type === "tiktok"}
                                            onChange={() => setType("tiktok")}>
                                        </input>
                                    </div>
                                    <Button className="add-account-btn" label='Add' variant='secondary' icon='./plusImg.svg' onClick={handleAddAccount} />
                                </div>
                                <div className={accountEditActive ? 'managers-list-container form-el-container active' : 'managers-list-container form-el-container'}>
                                    <label className={accountEditActive ? 'active' : ''} htmlFor="managersList">Change Manager</label>
                                    <select className='form-el' name="managersList" value={activeManagerId} id="edit-managers-list" onChange={handleManagerChange}>
                                        {managers.map((manager) => (
                                            <option key={manager.id} value={manager.id}>{manager.firstName} {manager.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div id="delete-influencer" className={accountEditActive ? 'active' : ''}>
                                    <h3>Delete Influencer</h3>
                                    <Button className="delete-influencer-btn" label="Delete Influencer" variant="tertiary" onClick={() => handleDeleteInfluencer(activeId)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}

export default ListPage