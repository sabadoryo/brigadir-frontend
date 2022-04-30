import {Routes, Route} from 'react-router-dom';
import {Welcome} from './components/welcome/Welcome'
import Header from './components/layout/header'
import React, {useEffect} from 'react';
import Login from './components/login/Login'
import hasToken from './components/login/isAuthenticated';
import {setUser} from './redux/slices/authSlice';
import {useDispatch} from 'react-redux'
import {Profile} from './components/profile/Profile';
import {Clanwar} from './components/clanwars/Clanwar';
import secureFetch from './reusable/secureFetch';
import QueuesList from './components/clanwars/Guild';
import {Queue} from './components/clanwars/Queue';

function App() {
    const dispatch = useDispatch()


    useEffect(() => {
        if (hasToken()) {
            getUserInfo().then(res => {
                dispatch(setUser(res))
            })
        }
    }, [dispatch])

    if (!hasToken()) {
        return (<Login/>)
    }

    return (
        <div>
            <Header>
                <Routes>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/clanwars" element={<Clanwar/>}/>
                    <Route path="/clanwars/guilds/:id" element={<QueuesList/>}/>
                    <Route path="/clanwars/guilds/:guild_id/queues/:queue_id" element={<Queue/>}/>
                    <Route path="/" element={<Welcome/>}/>
                </Routes>
            </Header>
        </div>
    );
}

async function getUserInfo() {
    return secureFetch("https://discordapp.com/api/users/@me", {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
        .then(res => res.json())
}

export default App;
