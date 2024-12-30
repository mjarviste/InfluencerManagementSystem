import React, { useEffect, useState, ChangeEvent } from "react";
import Button from "../../components/button/Button";
import ListRow from "../../components/listrow/ListRow";
import './listPage.scss'
import { Account, Influencer, Manager } from '../../types/types';
import { Link } from "react-router-dom";
import api from "../../utils/api";

const ListPage: React.FC = () => {

    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [editActive, setEditActive] = useState(false);
    const [activeFirstName, setActiveFirstName] = useState('');
    const [activeLastName, setActiveLastName] = useState('');
    const [activeId, setActiveId] = useState('');
    const [activeManagerFirstName, setActiveManagerFirstName] = useState('');
    const [activeManagerLastName, setActiveManagerLastName] = useState('');
    const [activeUsername, setActiveUsername] = useState('');
    const [type, setType] = useState<'instagram' | 'tiktok' | "">("");
    const [activeAccounts, setActiveAccounts] = useState<Account[]>([]);
    const [accountEditActive, setAccountEditActive] = useState(false);


    const fetchInfluencers = async (): Promise<Influencer[]> => {
        console.log("Here")
        const response = await api.get('/api/influencers');
        console.log("Data:", response.data)
        return response.data;
    };

    const fetchManagers = async (): Promise<Manager[]> => {
        const response = await api.get('/api/managers');
        return response.data;
    };

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/api/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        }
    };

    const fetchInfluencerById = async (id: string): Promise<Influencer> => {
        const response = await api.get(`/api/influencers/${id}`);
        return response.data;
    }

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
        const influencer = await fetchInfluencerById(id);
        setActiveFirstName(influencer.firstName);
        setActiveLastName(influencer.lastName);
        setActiveManagerFirstName(influencer.manager.firstName);
        setActiveManagerLastName(influencer.manager.lastName);
        setActiveAccounts(influencer.accounts);
        setActiveId(influencer.id);
        console.log("Manager ID:", influencer.managerId)
        setEditActive(true);
        console.log("Influencer:", influencer);
    }

    const handleAddAccount = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        if (accounts.length === 0) {
            await fetchAccounts();
        }
        console.log('username:', activeUsername);
        if (!activeUsername || !type) {
            alert('Please provide both username and account type');
            return;
        }

        const accountExists = accounts.some(
            (account) => account.username === activeUsername && account.type === type
        );

        if (accountExists) {
            alert('This account already exists in the database');
            return;
        }
        if (activeAccounts.some((account) => account.username === activeUsername && account.type === type)) {
            alert('This account already exists in the list');
            return;
        }
        try {

            console.log("Username:", activeUsername)
            console.log("type:", type)
            console.log("id:", activeId)


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
            setType('');
        } catch (error) {
            console.error('Failed to add account:', error);
            alert('Failed to add account');
        }
    }

    const handleDeleteAccount = async (accountId: string): Promise<void> => {
        try {
            const response = await api.delete(`/api/accounts/${accountId}`);
            alert(response.data.message)
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
        console.log("ID", influencerId)
        try {
            const response = await api.delete(`/api/influencers/${influencerId}`);
            alert(response.data.message); // Notify the user
            setInfluencers((prevInfluencers) =>
                prevInfluencers.filter((influencer) => influencer.id !== influencerId)
            ); // Update the UI
            onEditBackClick();
        } catch (error) {
            console.error("Failed to delete influencer:", error);
            alert("Error deleting influencer. Please try again.");
        }
    }
    const handleManagerChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newManagerId = event.target.value;
        try {
            const response = await api.put(
                `/api/influencers/${activeId}`,
                { managerId: newManagerId }
            );
            alert(response.data.message);

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
        const getInfluencers = async () => {
            try {
                const data = await fetchInfluencers();
                setInfluencers(data);
            } catch (error) {
                console.error('Failed to fetch influencers:', error);
            }
        };
        const getManagers = async () => {
            try {
                const data = await fetchManagers();
                setManagers(data);
            } catch (error) {
                console.error('Failed to fetch managers:', error);
            }
        };
        getInfluencers();
        getManagers();
    }, []);

    return (
        <div id="list-page">
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
                        <select name="managers" id="list-filter" onChange={fetchInfluencersByManager} >
                            <option id="filter-placeholder" value="none" disabled selected hidden>Filter By Manager</option>
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
                        {influencers.map((influencer) => (
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
                            <select className='form-el' name="managersList" id="edit-managers-list" onChange={handleManagerChange}>
                                <option id="edit-managers-placeholder" value="none" disabled selected hidden>Choose Manager</option>
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
        </div>
    )
}

export default ListPage