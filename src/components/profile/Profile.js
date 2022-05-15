import React, { useEffect, useState } from 'react'
import { Tab, Tabs, TabPanels, TabList, TabPanel,Flex, chakra, Spinner, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalBody, FormControl, FormLabel, Input, ModalFooter, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, FormHelperText, FormErrorMessage, Image, useToast} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { UserInfo } from './UserInfo';
import secureFetch from '../../reusable/secureFetch';
import coinsImg from '../../resources/img/coins.png';
import { useNavigate } from 'react-router';

export const Profile = () => {
  const user = useSelector((state) => state.auth.user)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [disciplines, setDisciplines] = useState([{name: null, id: null}])
  const [disciplineId, setDisciplineId] = useState();
  const isValidForm =  !disciplineId
  const [points, setPoints] = useState(1000)
  const navigate = useNavigate()


  const isDisciplineError = (disciplineId === undefined) || (disciplineId === null)

  const toast = useToast()
  const toastIdRef = React.useRef()

  useEffect(() => {
    getDisciplines().then(res => {
      setDisciplines(res)
    })
  }, [])

  function addToast(message, status = 'error') {
    toastIdRef.current = toast({description: message, status: status})
  }

  function getDisciplines() {
    return secureFetch(`${process.env.REACT_APP_API_URL}/api/disciplines`)
        .then(res => res.json())
  }
  
  function changeClanwarProfile() {
    const requestOptions = {
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({
          points,
          discipline_id: disciplineId
      })
  }

  secureFetch(`${process.env.REACT_APP_API_URL}/api/users/${user.id}/update-points`, requestOptions)
      .then(r => r.json())
      .then(res => {
          window.location.reload()
          onClose()
      })
      .catch(async (err) => {
          console.log(err)
          const error = await err.json();
          addToast(error.message, 'error')
      })
  }

  return (
    <Flex direction={'column'} gap={5}>
      {user.id ? (
        <UserInfo user={user}/>
      ) : (
        <Spinner margin={'0 auto'}></Spinner>
      )}
      <Tabs variant='enclosed-colored' isFitted defaultIndex={1}>
        <TabList>
          <Tab isDisabled>Статистика</Tab>
          <Tab>Перекалибровка</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>ты шо тут потерял чел</p>
          </TabPanel>
          <TabPanel>
            <Flex direction={'column'} justify={'center'} align={'center'} gap={10}>
            <Flex align={'center'}>
              Данная функция позволяет вам выставить новый ранк к определенной дисциплине. Стоимость данной услуги 500 
              <Image boxSize='15px' src={coinsImg} alt={'qurultay-icons'}/>
            </Flex>
            <div>
            <Button onClick={onOpen}>Перекалибровать</Button>
            </div>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Перекалибровка рейтинга</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4} isInvalid={isDisciplineError}>
                <Select onChange={(e) => setDisciplineId(e.target.value)}>
                    <option value={null}>Выберите дисциплину</option>
                    {disciplines.map(d => (
                        <option value={d.id} key={d.id}>{d.label ?? d.name}</option>
                    ))}
                </Select>
                {!isDisciplineError ? (
                    <FormHelperText>
                        Выберите дисциплину
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>Выбор дисциплины обязателен</FormErrorMessage>
                )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Новый рейтинг</FormLabel>
              <NumberInput onChange={(e) => setPoints(e)} defaultValue={1000} min={500} max={1000} keepWithinRange step={50}>
                <NumberInputField readOnly />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} isDisabled={isValidForm} onClick={changeClanwarProfile}>
              Изменить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
