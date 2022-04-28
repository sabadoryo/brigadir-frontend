import React, { ReactNode, useEffect, useState } from 'react';
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
  FormLabel,
  Input,
  ModalFooter,
  NumberInputField,
  NumberInput,
  Select,
  useToast,
  FormHelperText,
  FormErrorMessage,
  Spinner,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux'
import secureFetch from '../../reusable/secureFetch';
import { selectUser } from '../../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import Moment from 'react-moment';

const Testimonial = ({ children }) => {
  return <Box _hover={{
    transform: 'translateY(2px)',
    boxShadow: 'lg',
  }}>{children}</Box>;
};

const TestimonialContent = ({ children }) => {
  return (
    <Stack
    boxShadow={'lg'}
    p={8}
    rounded={'xl'}
    align={'center'}
    bg={'rgba(256,256,256, 0.3);'}
    pos={'relative'}
    _after={{
      color:'#000505',
      content: `""`,
      bg:'rgba(256,256,256, 0.3)',
    }}>
      {children}
    </Stack>
  );
};

const TestimonialHeading = ({ children }) => {
  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  );
};

const TestimonialAvatar = ({
  src,
  name,
  title,
  date,
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} alt={name} mb={2} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text><Moment format='MM/DD/YY-HH:mm:ss'>{date}</Moment>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

async function getUserGuilds(guildId) {
  return secureFetch(`${process.env.REACT_APP_API_URL}/api/guilds/${guildId}/queues`)
    .then(res => res.json())
}

export default function QueuesList() {
  const params = useParams();
  const [queues, setQueues] = useState([{discipline: {name: ''}, QueueMember: []}]);
  const [name, setName] =  useState('')
  const [disciplineId, setDisciplineId] =  useState();
  const [voiceChannelId, setVoiceChannelId] =  useState();
  const [disciplines, setDisciplines] = useState([{name: null, id: null}])
  const [voiceChannels, setVoiceChannels] = useState([{name: null, id: null}])
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const toast = useToast()
  const toastIdRef = React.useRef()
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isNameError = name === ''
  const isDisciplineError = disciplineId === undefined
  const isVoiceChannelsError = voiceChannelId === undefined
  const isValidForm = !name || !disciplineId || !voiceChannelId
  
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

  }, [params])

  function addToast(message, status = 'error') {
    toastIdRef.current = toast({ description: message, status: status })
  }

  return !loading ? (
    <Container maxW={'80vw'} marginTop={100}>
        <Flex justify={'center'} align={'center'} direction={'column'} gap={5} mb={10}>
          <Heading size={'md'}>Выберите интересующую очередь из списка</Heading>
          <Button colorScheme='teal' onClick={onOpen}>Создать</Button>
          <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Создайти свою очередь</ModalHeader>
          <ModalCloseButton />
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
              <option value={null}>Выберите дисциплину</option>
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

          </ModalBody>
        
          <ModalFooter>
            <Button mr={3} 
            colorScheme={'teal'} 
            onClick={() => createQueue(name, disciplineId, voiceChannelId, params.id, user, navigate, addToast)}
            isDisabled={isValidForm}
            >
              Создать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </Flex>
        <SimpleGrid 
          columns={{ base: 1, md: 3, lg: 3 }} 
          spacing={{ base: 5, lg: 8 }}
        >
            {queues.map(q => {
              return (
                <Link to={`/clanwars/guilds/${q.guild_id}/queues/${q.id}`} key={q.name + 'lol'}>
                  <Testimonial>
                    <TestimonialContent>
                      <TestimonialHeading>{q.name}</TestimonialHeading>
                    </TestimonialContent>
                    <TestimonialAvatar
                    src={
                      `${process.env.REACT_APP_API_URL}/${q.discipline.icon_path}`
                    }
                    name={q.discipline.name}
                    title={`Всего присоеденившихся: ${q.QueueMember.length}`}
                    date={q.created_at}
                  />
                </Testimonial>
              </Link>
              )
            })}
        </SimpleGrid>
      </Container>
    ) :
    (
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
        marginLeft={'50%'}
      />);
}


function createQueue(name, discipline_id, voice_channel_id, guild_id, user, navigate, addToast) {
  const requestOptions = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` ,'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({ 
      host_discord_id: user.id,
      name,
      discipline_id,
      voice_channel_id,
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