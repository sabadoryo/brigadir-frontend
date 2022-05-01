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
} from '@chakra-ui/react';
import Slider from '../slider/slider';

import {useSelector} from 'react-redux'
import secureFetch from '../../reusable/secureFetch';
import {selectUser} from '../../redux/slices/authSlice';
import {Link} from 'react-router-dom';

const Testimonial = ({children}) => {
    return <Box _hover={{
        transform: 'translateY(2px)',
        boxShadow: 'lg',
    }}>{children}</Box>;
};

const TestimonialContent = ({children}) => {
    return (
        <Stack
            boxShadow={'lg'}
            p={8}
            rounded={'xl'}
            align={'center'}
            bg={'rgba(256,256,256, 0.3);'}
            pos={'relative'}
            _after={{
                color: '#000505',
                content: `""`,
                bg: 'rgba(256,256,256, 0.3)',
            }}>
            {children}
        </Stack>
    );
};

const TestimonialHeading = ({children}) => {
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
                           }) => {
    return (
        <Flex align={'center'} mt={8} direction={'column'}>
            <Avatar src={src} alt={name} mb={2}/>
            <Stack spacing={-1} align={'center'}>
                <Text fontWeight={600}>{name}</Text>
                <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
                    {title}
                </Text>
            </Stack>
        </Flex>
    );
};

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
                            <Link to={`/clanwars/guilds/${g.id}`} key={g.name}>
                                <Testimonial>
                                    <TestimonialContent>
                                        <TestimonialHeading>{g.name}</TestimonialHeading>
                                    </TestimonialContent>
                                    <TestimonialAvatar
                                        src={g.iconUrl}
                                        name={`Пользователей: ${g.memberCount}`}
                                    />
                                </Testimonial>
                            </Link>
                        )
                    })}
                </SimpleGrid>
            </Container>
        ) :
        (
            <Slider/>)
}