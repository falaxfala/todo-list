import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  useRecoilValue,
  useRecoilState
} from 'recoil';
import { Box, Text } from 'rebass';
import { _fetch } from '../components/_fetch';
import {
  todoListState,
  todoFilterListSelector,
  apiState
} from '../components/StateManagement';
import Loader from 'react-loader-spinner';

const TodoElement = dynamic(() => import('../components/TodoElement'));
const Filter = dynamic(() => import('../components/Filter'));
const Stats = dynamic(() => import('../components/Stats'));
const AddNewTask = dynamic(() => import('../components/AddNewTask'));

export default function Main(props) {

  const { todoUserAPI } = useRecoilValue(apiState);
  const [defaultList, setDefaultList] = useRecoilState(todoListState);
  const filteredList = useRecoilValue(todoFilterListSelector);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFromAPI = async () => {
      if (defaultList.length === 0) {
        setIsLoading(true);
      }
      await _fetch().get(todoUserAPI)
        .then(res => {
          setDefaultList(res.data);
          setIsLoading(false);
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

    <AddNewTask />
    <Filter />
    <Stats />

    {!isLoading ?
      <Box variant="card">
        {(filteredList.length > 0) ?
          filteredList && filteredList.map((elem, key) =>
            <TodoElement element={elem} key={key} />
          ) : <Text m={3}>Brak zapisanych zadań</Text>
        }
      </Box> : <Box sx={{mx: 'auto', width: '100%', textAlign:'center', paddingTop: '2rem'}}>
        <Loader
          type="Oval"
          color="#018786"
          secondaryColol="#800020"
          height={60}
          width={60}
        />
      </Box>}

  </Box>);
}
