import React, {useEffect, useState} from 'react'
import {
    Avatar,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Text,
    TableCaption,
    Flex,
    Container,
    Button,
    Link,
    Box,
    Heading,
    Tooltip,
} from '@chakra-ui/react'

import {useParams} from 'react-router';
import secureFetch from '../../reusable/secureFetch';
import {useSelector} from 'react-redux';
import {CloseIcon, WarningTwoIcon} from '@chakra-ui/icons';

export const Queue = () => {
    const [queue, setQueue] = useState({
        users: {name: 'a'},
        name: '',
        voice_channel_id: '',
        channel: {name: ''},
        QueueMember: [{
            users: {name: ''}
        }],
        discipline: {
            name: ''
        },
        is_opened: true
    });
    const params = useParams();
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        getQueue(params.queue_id)
            .then(res => {
                setQueue(res)
            })
    }, [])

    return queue.is_opened ? (
            <Container marginTop={10}>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Flex direction={'column'} gap={'1px'}>
                        <Text fontSize={'xs'}>Канал сбора: <Link color={'teal.400'}
                                                                 onClick={() => openDiscordChannelPage(`https://discord.com/channels/${queue.guild_id}/${queue.channel.id}`)}>{queue.channel.name}</Link></Text>
                        <Text fontSize={'xs'}>Хост: {queue.users.name}</Text>
                        <Text fontSize={'xs'}>Дисциплина: {queue.discipline.name}</Text>
                    </Flex>
                    {!isAuthUserInQueue(queue.QueueMember, user) ? (
                        <Button size='lg' onClick={() => joinQueue(user, queue.id, setQueue)}
                                hidden={isAuthUserHost(queue, user)}>
                            Войти
                        </Button>
                    ) : (
                        <Button variant='outline' size='lg' onClick={() => leaveQueue(user, queue.id, setQueue)}
                                hidden={isAuthUserHost(queue, user)}>
                            Покинуть
                        </Button>
                    )}
                </Flex>
                <TableContainer>
                    <Table variant={'simple'}>
                        <TableCaption>
                            Войдите в канал сбора, чтобы подтвердить готовность
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Список очереди: {queue.name}</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {queue.QueueMember.map(m => {
                                return (
                                    <Tr key={m.id + 'lol'}>
                                        <Td>
                                            <Flex justify={'start'} gap={'5px'} alignItems={'center'}>
                                                <Avatar
                                                    src={`https://cdn.discordapp.com/avatars/${m.users.discord_id}/${m.users.avatar_hash}`}/>
                                                <Text>{m.users.name}</Text>
                                            </Flex>
                                        </Td>
                                        {isAuthUserHost(queue, user) && isNotHimself(m, user) ? (
                                                <Td onClick={() => kickUser(queue, m.users, setQueue)}>
                                                    <CloseIcon></CloseIcon>
                                                </Td>
                                            )
                                            :
                                            <Td></Td>
                                        }
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Flex justify={'space-between'}>
                    <Button onClick={() => closeQueue(params.queue_id, user, setQueue)}
                            hidden={!isAuthUserHost(queue, user)} variant='outline'>Закрыть очередь</Button>
                    <Tooltip label="Пока недопступно" shouldWrapChildren hasArrow mt='3'>
                        <Button isDisabled>Начать КВ</Button>
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

async function getQueue(queueId) {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${queueId}`)
        .then(res => res.json())
}


function isAuthUserInQueue(queueMembers, authUser) {
    const queueMemberIds = queueMembers.map(m => m.users.discord_id)
    return queueMemberIds.includes(authUser.id)
}

function joinQueue(user, queueId, setQueue) {
    const requestOptions = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            user_discord_id: user.id
        })
    }

    return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${queueId}/join`, requestOptions)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setQueue(res);
        })
}

function leaveQueue(user, queueId, setQueue) {
    const requestOptions = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            user_discord_id: user.id
        })
    }

    return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${queueId}/leave`, requestOptions)
        .then(res => res.json())
        .then(res => {
            setQueue(res);
        })
}

function openDiscordChannelPage(url) {
    window.open(url, "_blank")
}

function isAuthUserHost(queue, user) {
    return queue.users.discord_id === user.id
}

function kickUser(queue, user, setQueue) {
    const requestOptions = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            user_discord_id: user.discord_id
        })
    }

    return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${queue.id}/kick`, requestOptions)
        .then(res => res.json())
        .then(res => {
            setQueue(res);
        })
}

function isNotHimself(member, user) {
    return member.users.discord_id !== user.id
}

function closeQueue(queueId, user, setQueue) {
    console.log(user)
    const requestOptions = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            user_discord_id: user.discord_id
        })
    }

    return secureFetch(`${process.env.REACT_APP_API_URL}/api/queues/${queueId}/close`, requestOptions)
        .then(res => res.json())
        .then(res => {
            setQueue(res);
        })
}