import { Link } from 'react-router-dom';
import './addInfluencerPage.scss'
import { useEffect, useState } from 'react';
import { Manager, Account } from '../../types/types';
import Button from '../../components/button/Button';
import api from '../../utils/api';

const AddInfluencerPage: React.FC = () => {

    const [managers, setManagers] = useState<Manager[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [managerId, setManagerId] = useState("");
    const [username, setUsername] = useState("");
    
    const [type, setType] = useState<'instagram' | 'tiktok' | "">("");
    const [newAccounts, setNewAccounts] = useState<{ username: string; type: 'instagram' | 'tiktok' }[]>([]);


    const fetchManagers = async () => {
        try {
            const response = await api.get('/api/managers');
            setManagers(response.data);
        } catch (error) {
            console.error('Failed to fetch managers:', error);
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

    const handleAddAccount = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        if (!username || !type) {
            alert('Please provide both username and account type');
            return;
        }

        const accountExists = accounts.some((account) => account.username === username && account.type === type);

        if (accountExists) {
            alert('This account already exists');
            return;
        }
        if (newAccounts.some((account) => account.username === username && account.type === type)) {
            alert('This account already exists');
            return;
        }

        setNewAccounts([...newAccounts, { username, type }]);
        setUsername('');
        setType('');
    }

    const handleDeleteAccount = (index: number): void => {
        const updateNewAccounts = newAccounts.filter((_, i) => i !== index)
        setNewAccounts(updateNewAccounts);
    }

    const handleAddInfluencer = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        if (!firstName || !lastName || !managerId) {
            alert('Please fill in all required fields: First Name, Last Name, and Manager.');
            return;
        }

        const newInfluencer = {
            firstName,
            lastName,
            managerId,
            accounts: newAccounts,
        };

        try {
            await api.post('/api/influencers', newInfluencer);
            alert('Influencer added successfully!');
            setFirstName('');
            setLastName('');
            setNewAccounts([]);
        } catch (error) {
            console.error('Failed to add influencer:', error);
            alert('Error adding influencer. Please try again.');
        }
    }

    const handleAddFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 50) {
            setFirstName(event.target.value)
        }
    }
    const handleAddLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 50) {
            setLastName(event.target.value)
        }
    }

    useEffect(() => {
        fetchManagers();
        fetchAccounts();
    }, []);

    return (
        <div id="add-influencer-page">
            <div id='add-influencer-back'>
                <Link to={"/"}>
                    <img src="./backImg.svg" alt="" />
                </Link>
            </div>
            <div id='add-influencer-heading'>
                <h1>Add Influencer</h1>
            </div>
            <div id='add-influencer-form-container'>
                <form>
                    <div id='first-name-container' className='form-el-container'>
                        <label htmlFor="firstName">First Name</label>
                        <input 
                            className='form-el' 
                            type="text" 
                            name='firstName' 
                            placeholder='John' 
                            value={firstName} 
                            onChange={handleAddFirstName} 
                        />
                    </div>
                    <div id='last-name-container' className='form-el-container'>
                        <label htmlFor="lastName">Last Name</label>
                        <input 
                            className='form-el' 
                            type="text" 
                            name='lastName' 
                            placeholder='Doe' 
                            value={lastName} 
                            onChange={handleAddLastName} 
                        />
                    </div>
                    <div id='managers-list-container' className='form-el-container'>
                        <label htmlFor="managersList">Manager</label>
                        <select className='form-el' name="managersList" id="managers-list" onChange={(e) => {
                            setManagerId(e.target.value)
                        }}>
                            <option id="managers-placeholder" value="none" disabled selected hidden>Choose Manager</option>
                            {managers.map((manager) => (
                                <option key={manager.id} value={manager.id}>{manager.firstName} {manager.lastName}</option>
                            ))}
                        </select>
                    </div>
                    <div id='username-container'>
                        <label htmlFor="username">Add Social Media Account</label>
                        <div id="username-details-container">
                            <input className='form-el' id="accont-username" type="text" name='username' placeholder='johndoe123' value={username} onChange={(e) => setUsername(e.target.value)} />
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
                            <Button className='add-btn' label='Add' variant='secondary' icon='./plusImg.svg' onClick={handleAddAccount} />
                        </div>
                    </div>
                    <div id="accounts-list-container" className={newAccounts.length > 0 ? 'active' : ''}>
                        {newAccounts.map((account, index) => (
                            <div className='new-account' key={index}>
                                <div className='username-container'>
                                    <span>{index + 1}. </span>
                                    <span>{account.username}</span>
                                </div>
                                <div className="new-account-imgs">
                                    <div className='social-logo-wrapper'>
                                        {account.type === "tiktok" ?
                                            (<img src='./tiktokLogo.svg' />) :
                                            (<img src='./instagramLogo.svg' />)}
                                    </div>
                                    <div className='delete-img-wrapper' onClick={() => handleDeleteAccount(index)}>
                                        <img src="./deleteImg.svg" alt="white delete X" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button className='add-influencer-btn' label='Add Influencer' onClick={handleAddInfluencer} />
                </form>
            </div>
        </div>
    )
}

export default AddInfluencerPage;