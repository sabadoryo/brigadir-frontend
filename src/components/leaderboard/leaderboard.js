import { Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

export const Leaderboard = () => {
  return (
    <TableContainer>
      <Table variant='simple'>
          <TableCaption>Top</TableCaption>
          <Thead>
            <Tr>
              <Th>username</Th>
              <Th isNumeric>sr</Th>
            </Tr>
          </Thead>
        <Tbody>
            <Tr>
              <Td>test</Td>
              <Td isNumeric>10000</Td>
            </Tr>
          </Tbody>
      </Table>
  </TableContainer>
  )
}
