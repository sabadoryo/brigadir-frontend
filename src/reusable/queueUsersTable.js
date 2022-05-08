import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Avatar, Flex, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Table } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import secureFetch from './secureFetch'

export const UsersTable = (props) => {
    const users = props.users
    const name = props.name
    const caption = props.caption
    const queue = props.queue
    const user = useSelector((state) => state.auth.user)
    const setQueue = props.setQueue

    return (
        <TableContainer>
                            <Table variant={'simple'}>
                                <TableCaption>
                                    {caption}
                                </TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>{name}</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users.map(m => {
                                        return (
                                            <Tr key={m.id + 'lol'}>
                                                <Td>
                                                    <Flex justify={'start'} gap={'5px'} alignItems={'center'}>
                                                        <CheckIcon marginRight={5} w={6} h={6} color={m.is_ready ? 'green' : 'grey'}></CheckIcon>
                                                        <Avatar
                                                            src={`https://cdn.discordapp.com/avatars/${m.users.discord_id}/${m.users.avatar_hash}`}/>
                                                        <Text>{m.users.name}</Text>
                                                    </Flex>
                                                </Td>
                                                {isAuthUserHost(queue, user) && isNotHimself(m, user) ? (
                                                        <Td onClick={() => kickUser(queue, m.users, setQueue)}>
                                                            <CloseIcon marginLeft={"100%"}></CloseIcon>
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
    )
}

function isAuthUserHost(queue, user) {
    return queue.users.discord_id === user.id
}

function isNotHimself(member, user) {
    return member.users.discord_id !== user.id
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