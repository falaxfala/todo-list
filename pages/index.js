import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  atom,
  selector,
  useRecoilValue,
  useSetRecoilState,
  useRecoilState
} from 'recoil';
import { Box, Flex, Button } from 'rebass';
import { Textarea } from '@rebass/forms';
import { _fetch } from '../components/_fetch';
import { todoListState, todoFilterListSelector } from '../components/StateManagement';

const TodoElement = dynamic(() => import('../components/TodoElement'));
const Filter = dynamic(() => import('../components/Filter'));
const Stats = dynamic(() => import('../components/Stats'));

export default function Main(props) {

  const [defaultList, setDefaultList] = useRecoilState(todoListState);
  const filteredList = useRecoilValue(todoFilterListSelector);

  useEffect(() => {
    const loadFromAPI = async () => {
      await _fetch().get(props.todoAPI)
        .then(res => {
          setDefaultList(res.data);
          return res;
        });
    }

    loadFromAPI();
  }, []);

  return (<Box
    sx={{
      fontFamily: 'body',
      maxWidth: 720,
      mx: 'auto',
      px: 3,
    }}>
    <Flex mb={4} mt={2} variant="newTaskBox">
      <Box width={[3 / 5, 3 / 4, 3 / 4]}>
        <Textarea
          id='newTaskTitle'
          name='newTaskTitle'
          variant='newTaskTitle'
          placeholder='Treść zadania'
          sx={{
            resize: 'none',
            fontFamily: 'body'
          }}
        />
      </Box>

      <Box width={[2 / 5, 1 / 4, 1 / 4]}>
        <Button>
          Zapisz zadanie
        </Button>
      </Box>
    </Flex>

    <Filter />

    <Stats />

    <Box variant='card'>
      {filteredList && filteredList.map((elem, key) =>
        <TodoElement element={elem} key={key} />
      )}
    </Box>

  </Box>);
}
