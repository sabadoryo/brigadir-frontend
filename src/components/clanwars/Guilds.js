import {useEffect, useState} from 'react';
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
    Spinner,
    Center,
    Image,
    Button
} from '@chakra-ui/react';
import {useSelector} from 'react-redux'
import secureFetch from '../../reusable/secureFetch';
import {selectUser} from '../../redux/slices/authSlice';
import {Link} from 'react-router-dom';

import set0 from '../../resources/img/sets/set-0.jpg'
import set1 from '../../resources/img/sets/set-1.jpg'

// const Testimonial = ({children}) => {
//     return <Box _hover={{
//         transform: 'translateY(2px)',
//         boxShadow: 'lg',
//     }}>{children}</Box>;
// };
//
// const TestimonialContent = ({children}) => {
//     return (
//         <Stack
//             boxShadow={'lg'}
//             p={8}
//             rounded={'xl'}
//             align={'center'}
//             bg={'rgba(256,256,256, 0.3);'}
//             pos={'relative'}
//             _after={{
//                 color: '#000505',
//                 content: `""`,
//                 bg: 'rgba(256,256,256, 0.3)',
//             }}>
//             {children}
//         </Stack>
//     );
// };
//
// const TestimonialHeading = ({children}) => {
//     return (
//         <Heading as={'h3'} fontSize={'xl'}>
//             {children}
//         </Heading>
//     );
// };
//
// const TestimonialAvatar = ({
//                                src,
//                                name,
//                                title,
//                            }) => {
//     return (
//         <Flex align={'center'} mt={8} direction={'column'}>
//             <Avatar src={src} alt={name} mb={2}/>
//             <Stack spacing={-1} align={'center'}>
//                 <Text fontWeight={600}>{name}</Text>
//                 <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
//                     {title}
//                 </Text>
//             </Stack>
//         </Flex>
//     );
// };

async function getUserGuilds(userId) {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/guilds/all/${userId}`)
        .then(res => res.json())
}

export default function WithSpeechBubbles() {
    const user = useSelector(selectUser);
    const [guilds, setGuilds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.id) {
            getUserGuilds(user.id).then(res => {
                setGuilds(res)
                setLoading(false)
            })
        }
    }, [user])

    return !loading ? (
            <Container maxW={'100vw'}>
                <Stack spacing={0} align={'center'} marginBottom={'10'}>
                    <Heading>Выберите гильдию из списка</Heading>
                    <Text>В списке указаны только те гильдии, в которых вы находитесь</Text>
                </Stack>
                <SimpleGrid columns={{base: 1, md: 3, lg: 3}} spacing={{base: 5, lg: 8}}>
                    {guilds.map((g, ind) => {
                        return (
                            <SocialProfileWithImage id={g.id}
                                                    name={g.name}
                                                    icon={g.iconUrl}
                                                    memberCount={g.memberCount}
                                                    ind={ind}/>
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
            />)
}

const SocialProfileWithImage = ({id, name, icon, memberCount, ind}) => {
    return (
        <Center py={6}>
            <Box
                maxW={'270px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                {/*{ind === 0 ?*/}
                {/*    <Image h={'120px'}*/}
                {/*           w={'full'}*/}
                {/*           src={set0}*/}
                {/*           objectFit={'cover'}/> */}
                {/*    :*/}
                {/*    <Image h={'120px'}*/}
                {/*           w={'full'}*/}
                {/*           src={set1}*/}
                {/*           objectFit={'cover'}/>*/}
                {/*}*/}
                <Image
                    h={'120px'}
                    w={'full'}
                    src={`set${ind}`}
                    objectFit={'cover'}
                />
                <Flex justify={'center'} mt={-12}>
                    <Avatar
                        size={'xl'}
                        src={icon}
                        alt={'icon'}
                        css={{
                            border: '2px solid white',
                        }}
                    />
                </Flex>

                <Box p={6}>
                    <Stack spacing={0} align={'center'} mb={5}>
                        <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                            {name}
                        </Heading>
                    </Stack>

                    <Stack direction={'row'} justify={'center'} spacing={6}>
                        <Stack spacing={0} align={'center'}>
                            <Text fontWeight={600}>{memberCount}</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Пользователей
                            </Text>
                        </Stack>
                    </Stack>

                    <Link to={`/clanwars/guilds/${id}`} key={name}>
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
                            Перейти
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Center>
    );
}