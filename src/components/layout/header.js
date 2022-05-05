import React, {ReactNode} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import {
    FiMenu,
    // FiBell,
    FiChevronDown,
} from 'react-icons/fi';

import {IconType} from 'react-icons';
import {ReactText} from 'react';

import swords from '../../resources/img/icons/swords.svg';
import home from '../../resources/img/icons/home.svg';

import logo from '../../resources/img/kurultay-img.svg';
import logoText from '../../resources/img/logo-text.svg';

interface LinkItemProps {
    name: string;
    icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
    {name: 'Главная', icon: home, custom: true, url: '/'},
    {name: 'Clan Wars', icon: swords, custom: true, url: 'clanwars'},
];

export default function SidebarWithHeader({children}: {
    children: ReactNode;
}) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                display={{base: 'none', md: 'block'}}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} isOpen={isOpen}/>
                </DrawerContent>
            </Drawer>

            <MobileNav onOpen={onOpen}/>
            <Box ml={{base: 0, md: 60}} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({onClose, isOpen, ...rest}: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{base: 'full', md: 60}}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="40" paddingTop="20px" alignItems="flex-start" mx="8" justifyContent="space-between">
                <img src={logo} alt="" style={isOpen ? {width: '100px'} : null}/>
                <CloseButton display={{base: 'flex', md: 'none'}} onClick={onClose}/>
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} custom={link.custom} url={link.url}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText;
}

const NavItem = ({icon, custom, url, children, ...rest}: NavItemProps) => {
    return (
        <Link to={url} as={RouterLink} style={{textDecoration: 'none'}} _focus={{boxShadow: 'none'}}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {custom ? (
                    <img src={icon} alt="" style={{width: '24px', marginRight: '1rem'}}/>
                ) : icon && (
                    <Icon
                        mr="4"
                        fontSize="24"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

const MobileNav = ({onOpen, ...rest}: MobileProps) => {
    const user = useSelector((state) => state.auth.user)

    function logOut() {
        localStorage.removeItem('token');
        window.location.reload(false);
    }

    return (
        <Flex
            ml={{base: 0, md: 60}}
            px={{base: 4, md: 4}}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{base: 'space-between', md: 'flex-end'}}
            {...rest}>
            <IconButton
                display={{base: 'flex', md: 'none'}}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu/>}
            />

            <Box display={{md: 'none'}}>
                <img src={logoText} alt="" style={{width: '120px'}}/>
            </Box>

            <HStack spacing={{base: '0', md: '6'}}>
                {/*Пока без уведомлений*/}
                {/*<IconButton*/}
                {/*    size="lg"*/}
                {/*    variant="ghost"*/}
                {/*    aria-label="open menu"*/}
                {/*    icon={<FiBell/>}*/}
                {/*/>*/}
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{boxShadow: 'none'}}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        user.id ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : ''
                                    }
                                />
                                <VStack
                                    display={{base: 'none', md: 'flex'}}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{user.name}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {user.role}
                                    </Text>
                                </VStack>
                                <Box display={{base: 'none', md: 'flex'}}>
                                    <FiChevronDown/>
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <RouterLink to="/profile">
                                <MenuItem>
                                    Профиль
                                </MenuItem>
                            </RouterLink>
                            <MenuDivider/>
                            <MenuItem onClick={logOut}>Выйти</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};