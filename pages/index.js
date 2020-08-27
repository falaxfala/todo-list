import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  useRecoilValue,
  useRecoilState,
  useSetRecoilState
} from 'recoil';
import { Box, Text } from 'rebass';
import { _fetch } from '../components/_fetch';
import {
  todoListState,
  todoFilterListSelector,
  apiState,
  todoListTitleFilterState
} from '../components/StateManagement';
import Loader from 'react-loader-spinner';
import { useRouter } from 'next/router';

const TodoElement = dynamic(() => import('../components/TodoElement'));
const Filter = dynamic(() => import('../components/Filter'));
const Stats = dynamic(() => import('../components/Stats'));
const AddNewTask = dynamic(() => import('../components/AddNewTask'));

export default function Main(props) {

  const { todoUserApi, userBaseApi } = useRecoilValue(apiState);
  const [api, setApi] = useRecoilState(apiState);
  const [defaultList, setDefaultList] = useRecoilState(todoListState);
  const filteredList = useRecoilValue(todoListTitleFilterState);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const localUserId = localStorage.getItem('todoUserId');

      if (localUserId) {
        return await _fetch().get(userBaseApi + localUserId)
          .then(res => {
            //No user in database - redirect to create user
            if (res.code === 404) {
              router.push('/AddUser');
            }
            return res;
          })
          .then(res => {
            //Set new data only if state is empty
            if (api.userID === '' && api.todoUserApi === '') {
              const id = res.data.id;
              setApi({ ...api, userID: id, todoUserApi: 'https://gorest.co.in/public-api/users/' + id + '/todos/' });
              return res;
            }
            return res;
          })
          .then(res => loadFromAPI(res.data.id)); //Load tasks when user is valid
      } else {
        router.push('/AddUser');
      }
    }


    const loadFromAPI = async (userId) => {
      if (defaultList.length === 0) {
        setIsLoading(true);
      }
      await _fetch().get('https://gorest.co.in/public-api/users/' + userId + '/todos/')
        .then(res => {
          setDefaultList(res.data);
          setIsLoading(false);
          return res;
        });
    }

    
    checkUser();
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
          ) : <Text m={3}>Brak zadań</Text>
        }
      </Box> : <Box sx={{ mx: 'auto', width: '100%', textAlign: 'center', paddingTop: '2rem' }}>
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
