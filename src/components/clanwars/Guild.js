import React, {useEffect, useState} from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Stack,
    Container,
    SimpleGrid,
    Avatar,
    useColorModeValue,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    Input,
    ModalFooter,
    Select,
    useToast,
    FormHelperText,
    FormErrorMessage,
    Center,
    Image,
} from '@chakra-ui/react';
import Slider from '../slider/slider';

import {useSelector} from 'react-redux'
import secureFetch from '../../reusable/secureFetch';
import {Link} from 'react-router-dom';
import {useNavigate, useParams} from 'react-router';
import Moment from 'react-moment';

async function getUserGuilds(guildId) {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/guilds/${guildId}/queues`)
        .then(res => res.json())
}

export default function QueuesList() {
    const params = useParams();
    const [queues, setQueues] = useState([{discipline: {name: ''}, QueueMember: []}]);
    const [name, setName] = useState('')
    const [disciplineId, setDisciplineId] = useState();
    const [voiceChannelId, setVoiceChannelId] = useState();
    const [disciplines, setDisciplines] = useState([{name: null, id: null}])
    const [voiceChannels, setVoiceChannels] = useState([{name: null, id: null}])
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const toast = useToast()
    const toastIdRef = React.useRef()
    const [loading, setLoading] = useState(true);
    const [textChannelId, setTextChannelId] = useState();
    const [textChannels, setTextChannels] = useState([{name: null, id: null}])


    const {isOpen, onOpen, onClose} = useDisclosure()

    const isNameError = name === ''
    const isDisciplineError = disciplineId === undefined
    const isVoiceChannelsError = voiceChannelId === undefined
    const isTextChannelsError = textChannelId === undefined
    const isValidForm = !name || !disciplineId || !voiceChannelId || !textChannelId

    useEffect(() => {

        getUserGuilds(params.id).then(res => {
            setQueues(res)
            setLoading(false);
        })

        getDisciplines().then(res => {
            setDisciplines(res)
        })

        getVoiceChannels(params.id).then(res => {
            setVoiceChannels(res)
        })

        getTextChannels(params.id).then(res => {
            setTextChannels(res)
          })

    }, [params])

    function addToast(message, status = 'error') {
        toastIdRef.current = toast({description: message, status: status})
    }

    function getTextChannels() {
        return secureFetch(`${process.env.REACT_APP_API_URL}/api/guilds/${params.id}/channels?type=text`)
          .then(res => res.json())
    } 

    return !loading ? (
            <Container maxW={'100vw'} paddingTop={'20px'}>
                <Flex justify={'center'} align={'center'} direction={'column'} gap={5} mb={10}>
                    <Heading size={'lg'} marginBottom={'10px'}>Выберите интересующую очередь из списка</Heading>
                    <Button size='lg' onClick={onOpen} variant='outline'>Создать</Button>
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay/>
                        <ModalContent>
                            <ModalHeader>Создайти свою очередь</ModalHeader>
                            <ModalCloseButton/>
                            <ModalBody pb={6}>
                                <FormControl isInvalid={isNameError}>
                                    <Input placeholder='Название' onChange={(e) => setName(e.target.value)} value={name}/>

                                    {!isNameError ? (
                                        <FormHelperText>
                                            Введите уникальное название для вашей очереди!
                                        </FormHelperText>
                                    ) : (
                                        <FormErrorMessage>Название обязательное поле</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl mt={4} isInvalid={isDisciplineError}>
                                    <Select onChange={(e) => setDisciplineId(e.target.value)}>
                                        <option value={null}>Выберите дисциплину</option>
                                        {disciplines.map(d => (
                                            <option value={d.id} key={d.id}>{d.name}</option>
                                        ))}
                                    </Select>
                                    {!isDisciplineError ? (
                                        <FormHelperText>
                                            Выберите дисциплину, по которой хотите создать очередь
                                        </FormHelperText>
                                    ) : (
                                        <FormErrorMessage>Выбор дисциплины обязателен</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl mt={4} isInvalid={isVoiceChannelsError}>
                                    <Select onChange={(e) => setVoiceChannelId(e.target.value)}>
                                        <option value={null}>Выберите канал сбора</option>
                                        {voiceChannels.map(v => (
                                            <option value={v.id} key={v.id}>{v.name}</option>
                                        ))}
                                    </Select>
                                    {!isVoiceChannelsError ? (
                                        <FormHelperText>
                                            Выберите канал на котором будет проходить сбор участников очереди
                                        </FormHelperText>
                                    ) : (
                                        <FormErrorMessage>Выбор канала обязателен</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl mt={4} isInvalid={isTextChannelsError}>
                                    <Select onChange={(e) => setTextChannelId(e.target.value)}>
                                        <option value={null}>Выберите канал оповещения</option>
                                        {textChannels.map(v => (
                                        <option value={v.id} key={v.id}>{v.name}</option>
                                        ))}
                                    </Select>
                                    {!isTextChannelsError ? (
                                        <FormHelperText>
                                            Выберите канал на котором будет анонс игры!
                                        </FormHelperText>
                                    ) : (
                                        <FormErrorMessage>Выбор канала обязателен</FormErrorMessage>
                                    )}
                                </FormControl>

                            </ModalBody>

                            <ModalFooter>
                                <Button mr={3}
                                        onClick={() => createQueue(name, disciplineId, voiceChannelId, textChannelId, params.id, user, navigate, addToast)}
                                        isDisabled={isValidForm}
                                >
                                    Создать
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
                <SimpleGrid
                    columns={{base: 1, md: 3, lg: 3}}
                    spacing={{base: 5, lg: 8}}
                >
                    {queues.map(q => {
                        return (
                            <SocialProfileWithImage
                                guildId={q.guild_id}
                                id={q.id}
                                name={q.name}
                                discipline={q.discipline}
                                memberCount={q.QueueMember.length}
                                date={q.created_at}
                                key={q.id + 'id'}
                            />
                        )
                    })}

                </SimpleGrid>
            </Container>
        ) :
        (
            <Slider/>);
}


function createQueue(name, discipline_id, voice_channel_id, text_channel_id,guild_id, user, navigate, addToast) {
    const requestOptions = {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            host_discord_id: user.id,
            name,
            discipline_id,
            voice_channel_id,
            text_channel_id,
            guild_id,
        })
    }

    secureFetch(`${process.env.REACT_APP_API_URL}/api/queues`, requestOptions)
        .then(r => r.json())
        .then(res => {
            navigate(`/clanwars/guilds/${guild_id}/queues/${res.id}`)
        })
        .catch(async (err) => {
            const error = await err.json();
            addToast(error.message, 'error')
        })
}

function getDisciplines() {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/disciplines`)
        .then(res => res.json())
}

function getVoiceChannels(guildId) {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/guilds/${guildId}/channels?type=voice`)
        .then(res => res.json())
}

const SocialProfileWithImage = ({id, guildId, name, memberCount, discipline, date}) => {
    return (
        <Center py={6}>
            <Box
                maxW={'270px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                <Image
                    h={'120px'}
                    w={'full'}
                    src={
                        `${process.env.REACT_APP_API_URL}/${discipline.icon_path}`
                    }
                    objectFit={'cover'}
                />
                <Flex justify={'center'} mt={-12}>
                    <Avatar
                        size={'xl'}
                        src={
                            `${process.env.REACT_APP_API_URL}/${discipline.icon_path}`
                        }
                        alt={'icon'}
                        css={{
                            border: '2px solid white',
                        }}
                    />
                </Flex>

                <Box p={6}>
                    <Stack spacing={0} align={'center'} mb={5}>
                        <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                            {discipline.name}
                        </Heading>
                        <Text color={'gray.500'}>
                            <Moment format='MM/DD/YY-HH:mm:ss'>{date}</Moment>
                        </Text>
                    </Stack>

                    <Stack direction={'row'} justify={'center'} spacing={6}>
                        <Stack spacing={0} align={'center'}>
                            <Text fontWeight={600}>{memberCount}</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Присоединившихся
                            </Text>
                        </Stack>
                    </Stack>

                    <Link to={`/clanwars/guilds/${guildId}/queues/${id}`} key={id}>
                        <Button
                            w={'full'}
                            mt={8}
                            bg={useColorModeValue('#151f21', 'gray.900')}
                            color={'white'}
                            rounded={'md'}
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}>
                            Присоединиться
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Center>
    );
}