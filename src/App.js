import {Routes, Route} from 'react-router-dom';
import {Welcome} from './components/welcome/Welcome'
import Header from './components/layout/header'
import React, {useEffect} from 'react';
import Login from './components/login/Login'
import hasToken from './components/login/isAuthenticated';
import {setUser, logout} from './redux/slices/authSlice';
import {useDispatch} from 'react-redux'
import {Profile} from './components/profile/Profile';
import {Clanwar} from './components/clanwars/Clanwar';
import secureFetch from './reusable/secureFetch';
import QueuesList from './components/clanwars/Guild';
import {Queue} from './components/clanwars/Queue';
import { Game } from './components/clanwars/Game';
import { Leaderboard } from './components/leaderboard/leaderboard';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router'

function App() {
    const dispatch = useDispatch()
    const toast = useToast()
    const navigate = useNavigate()

    function triggerToast(description) {
        toast({
            description
          })
    }

    useEffect(() => {
        if (hasToken()) {
            getUserInfo().then(res => {
                dispatch(setUser(res))
                secureFetch(`${process.env.REACT_APP_API_URL}/api/auth/check`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` , 'Content-Type': 'application/json'},
                    body: JSON.stringify(res)
                  })
            }).catch(err => {
                dispatch(logout())
                triggerToast("Re-login is required!")
                navigate("/")
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
                    <Route path="/games/:game_id" element={<Game/>}/>
                    <Route path="/leaderboard" element={<Leaderboard/>}/>
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
