import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink} from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css'

const Links = [
  {
    name: 'Clanwars',
    url : 'clanwars'
  }
];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    as={RouterLink}
    rounded={'md'}
    to={children.url}
    color={'gray.200'}
    _hover={{
      textDecoration: 'none',
      // bg: useColorModeValue('gray.200', 'gray.700'),
      color: useColorModeValue('gray.200', 'gray.700')
    }}>
    {children.name}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.auth.user)
 
    return (
      <Box className='header-wrapper' bg={'gray.900'} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <NavLink>{{url: '/', name: 'Logo'}}</NavLink>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
             <NavLink key={link.name}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}>
              <Avatar
                size={'sm'}
                src={
                  user.id ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : ''
                }
              />
            </MenuButton>
            <MenuList>
              <RouterLink to="/profile">
                <MenuItem>
                  Profile
                </MenuItem>
              </RouterLink>
              <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
             <NavLink key={link.name}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
    )
}