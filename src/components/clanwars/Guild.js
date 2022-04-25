import { ReactNode, useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux'
import secureFetch from '../../reusable/secureFetch';
import { selectUser } from '../../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

const Testimonial = ({ children }) => {
  return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
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
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} alt={name} mb={2} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
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
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    
      getUserGuilds(params.id).then(res => {
          setQueues(res)
      })
    
  }, [params])

  return (
    <Container maxW={'80vw'} marginTop={100}>
        <Stack spacing={0} align={'center'} marginBottom={'10'}>
          <Heading size={'lg'}>Выберите интересующую очередь из списка</Heading>
        </Stack>
        <SimpleGrid 
          columns={{ base: 1, md: 3, lg: 3 }} 
          spacing={{ base: 5, lg: 8 }}
        >
            {queues.map(q => {
              return (
                <Link to={`/clanwars/guilds/${q.guild_id}/queues/${q.id}`} key={q.name}>
                  <Testimonial key={q.name}>
                    <TestimonialContent>
                      <TestimonialHeading>{q.name}</TestimonialHeading>
                    </TestimonialContent>
                    <TestimonialAvatar
                    src={
                      `${process.env.REACT_APP_API_URL}/${q.discipline.icon_path}`
                    }
                    name={q.discipline.name}
                    title={`Всего присоеденившихся: ${q.QueueMember.length}`}
                  />
                </Testimonial>
              </Link>
              )
            })}
        </SimpleGrid>
      </Container>
  );
}
