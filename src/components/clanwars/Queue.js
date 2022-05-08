import React, {useEffect, useRef, useState} from 'react'
import {
    Text,
    Flex,
    Container,
    Button,
    Link,
    Box,
    Heading,
    Tooltip,
    Select,
    Icon,
} from '@chakra-ui/react'
import {UsersTable} from '../../reusable/queueUsersTable';

import {useParams, useNavigate} from 'react-router';
import secureFetch from '../../reusable/secureFetch';
import {useSelector} from 'react-redux';
import {WarningTwoIcon} from '@chakra-ui/icons';
import io from "socket.io-client"

const queueId = window.location.href.split("/queues/")[1]
const socket = io(process.env.REACT_APP_API_URL,{ query: { queueId : queueId }})

export const Queue = () => {
    const [queue, setQueue] = useState({
        users: {name: 'a'},
        name: '',
        voice_channel_id: '',
        channel: {name: ''},
        QueueMember: [{
            users: {name: ''},
            is_ready: false,
        }],
        discipline: {
            name: ''
        },
        is_opened: true
    });
    const params = useParams();
    const user = useSelector((state) => state.auth.user)
    const [algorithm, setAlgorithm] = useState("random")
    const navigate = useNavigate()

    let isGameReady = (queue.QueueMember.length !== queue.QueueMember.filter(m => m.is_ready).length)

    useEffect(() => {
        socket.on('updateQueue', payload => {
            console.log('keklol')
            setQueue(payload);
        });
        socket.on('clanwarStarted', payload => {
            navigate(`/games/${payload.id}`)
        })
        getQueue(params.queue_id)
            .then(res => {
                setQueue(res)
            })
        return () => {
            console.log('connection removed')
            socket.disconnect({
                query: {
                    queueId : queueId
                  }
            })
        }
    }, [])

    async function getQueue() {
        return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${params.queue_id}`)
            .then(res => res.json())
    }
    
    
    function isAuthUserInQueue() {
        const queueMemberIds = queue.QueueMember.map(m => m.users.discord_id)
        return queueMemberIds.includes(user.id)
    }
    
    function joinQueue() {
        const requestOptions = {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                user_discord_id: user.id
            })
        }
    
        return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${queue.id}/join`, requestOptions)
            .then(res => res.json())
            .then(res => {
                setQueue(res);
                console.log(res);
                socket.emit('updateQueue', {
                    queueId: queue.id
                })
            })
    }
    
    function leaveQueue() {
        const requestOptions = {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                user_discord_id: user.id
            })
        }
    
        return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${queue.id}/leave`, requestOptions)
            .then(res => res.json())
            .then(res => {
                setQueue(res);
                socket.emit('updateQueue', {
                    queueId: queue.id
                })
            })
    }
    
    function openDiscordChannelPage(url) {
        window.open(url, "_blank")
    }
    
    function isAuthUserHost() {
        return queue.users.discord_id === user.id
    }
    
    function closeQueue() {
        const requestOptions = {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                user_discord_id: user.discord_id
            })
        }

        socket.on('updateQueue', payload => {
            setQueue(payload);
        });
    
        return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${queue.id}/close`, requestOptions)
            .then(res => res.json())
            .then(res => {
                setQueue(res);
                socket.emit('updateQueue', {
                    queueId: queue.id
                })
            })
    }

    async function handleGameStart() {
        const requestOptions = {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                user_discord_id: user.id,
                queue_id: queue.id,
            })
        }
    
        const clanwar = await secureFetch(`${process.env.REACT_APP_API_URL}/api/games`, requestOptions)
            .then(res => res.json());

        socket.emit('startClanwar',{
            queueId: queue.id,
            clanwarId: clanwar.id,
        });
    }

    return queue.is_opened ? (
            <Container marginTop={10} maxWidth={700}>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Flex direction={'column'} gap={'1px'}>
                        <Text fontSize={'xs'}>Канал сбора: <Link color={'teal.400'}
                                                                 onClick={() => openDiscordChannelPage(`https://discord.com/channels/${queue.guild_id}/${queue.channel.id}`)}>{queue.channel.name}</Link></Text>
                        <Text fontSize={'xs'}>Хост: {queue.users.name}</Text>
                        <Text fontSize={'xs'}>Дисциплина: {queue.discipline.name}</Text>
                    </Flex>
                    <Select maxW={200} hidden={!isAuthUserHost()} variant='outline'>
                        <option value="random">Рандомные команды</option>
                        <option value="teams" disabled>Готовые команды</option>
                    </Select>
                    {!isAuthUserInQueue(queue.QueueMember, user) ? (
                        <Button size='lg' onClick={() => joinQueue()}
                                hidden={isAuthUserHost()}>
                            Войти
                        </Button>
                    ) : (
                        <Button variant='outline' size='lg' onClick={() => leaveQueue()}
                                hidden={isAuthUserHost()}>
                            Покинуть
                        </Button>
                    )}
                    <Button onClick={() => closeQueue()}
                            hidden={!isAuthUserHost()} variant='outline'>Закрыть очередь</Button>
                </Flex>
                {algorithm === "random" ? (
                    <UsersTable users={queue.QueueMember} caption={`Выбран алгоритм: ${algorithm}, участники будут распределны рандомно`} name={`Список очереди: ${queue.name}`} queue={queue} setQueue={setQueue}></UsersTable>
                ) : (
                                    
                    <Flex gap={10}>              
                        {/* <UsersTable users={teamA.members} caption={``} name={`Список очереди: ${queue.name}`} queue={queue} setQueue={setQueue}></UsersTable>
                        <UsersTable users={teamB.members} caption={``} name={`Список очереди: ${queue.name}`} queue={queue} setQueue={setQueue}></UsersTable> */}

                    </Flex>
                )}
                <Flex justify={'center'}>
                    <Tooltip label="Все участники должны быть на голосовом канале где проходит сбор, чтобы начать Clan War" shouldWrapChildren hasArrow mt='3'>
                        <Button isDisabled={isGameReady} onClick={handleGameStart}><img alt="swords" src='/static/media/swords.456584b5e521bba48a9e6319434c60ef.svg' width={'30px'}></img></Button>
                    </Tooltip>
                </Flex>
            </Container>
        ) :
        (
            <Box textAlign="center" py={10} px={6}>
                <WarningTwoIcon boxSize={'50px'} color={'orange.300'}/>
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Эта очередь была закрыта!
                </Heading>
                <Text color={'gray.500'}>
                    Вы пытаетесь зайти на закрытую очередь, пожалуйста перепровертьте ссылку!
                </Text>
            </Box>
        )
}