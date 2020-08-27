import { useRouter } from 'next/router';
import {
    Box,
    Heading,
    Flex, Button,
    Text
} from 'rebass';
import { useEffect, useState } from 'react';
import { _fetch } from '../components/_fetch';
import {
    useRecoilValue,
    useRecoilState,
    useRecoilCallback
} from 'recoil';
import {
    apiState,
    newTaskState,
    newTaskCharCountState,
    todoListState,
    setCompleted,
    setUncompleted,
    saveChanges
} from '../components/StateManagement';
import Loader from 'react-loader-spinner';
import { Textarea } from '@rebass/forms';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Details(props) {
    const router = useRouter();
    const { id } = router.query;

    const { todoBaseApi } = useRecoilValue(apiState);
    const [taskData, setTaskData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [changingStateLoaded, setChangingStateLoaded] = useState(false);
    const [detailsState, setDetailsState] = useRecoilState(newTaskState);
    const { limit, charCount } = useRecoilValue(newTaskCharCountState);
    const todoList = useRecoilValue(todoListState);

    const {
        completed,
        created_at,
        title,
        updated_at,
        user_id
    } = taskData;

    useEffect(() => {
        setIsLoaded(false);
        const loadTaskData = () => {
            if (id) {
                _fetch().get(todoBaseApi + id)
                    .then(res => {
                        setTaskData(res.data);
                        setIsLoaded(true);
                        return res;
                    })
                    .then(res => {
                        setDetailsState(res.data.title);
                    });
            }
        }

        loadTaskData();
    }, [id, todoList]);

    const handleChangeTitle = ({ target: { value } }) => {
        setDetailsState(value);
    }

    const setMeCompleted = useRecoilCallback(({ snapshot, set }) => elemId => {
        setChangingStateLoaded(true);
        snapshot.getPromise(setCompleted(elemId))
            .then(() => {

                //Unmutate list state object by making a copy
                const currentList = [...todoList];
                let index;
                //Find index of duplicate with the same id
                currentList.forEach((elem, i) => {
                    if (elem.id === elemId) {
                        index = i;
                    }
                });
                //Copy all values from original and modify 'completed' value
                let elem = {
                    ...currentList[index],
                    completed: true
                }

                setChangingStateLoaded(false);

                //Replace element locally to prevent unwanted data fetching and update list state to rerender view
                currentList[index] = elem;
                setTaskData({ ...taskData, completed: true });
                set(todoListState, currentList);
            });
    });

    const setMeUncompleted = useRecoilCallback(({ snapshot, set }) => elemId => {
        setChangingStateLoaded(true);
        snapshot.getPromise(setUncompleted(elemId))
            .then(() => {
                //Unmutate list state object by making a copy
                const currentList = [...todoList];
                let index;
                //Find index of duplicate with the same id
                currentList.forEach((elem, i) => {
                    if (elem.id === elemId) {
                        index = i;
                    }
                });
                //Copy all values from original and modify 'completed' value
                let elem = {
                    ...currentList[index],
                    completed: false
                }
                setChangingStateLoaded(false);
                //Replace element locally to prevent unwanted data fetching and update list state to rerender view
                currentList[index] = elem;
                setTaskData({ ...taskData, completed: false });
                set(todoListState, currentList);
            });
    });

    const saveMyChanges = useRecoilCallback(({ snapshot, set }) => elemData => {
        if (detailsState.length > 5) {
            const { updated_at, title, ...data } = elemData;
            snapshot.getPromise(saveChanges({ id, title: detailsState, ...data }))
                .then(res => {
                    if (res.code === 200) {
                        const currentList = [...todoList];
                        let index;
                        //Find index of duplicate with the same id
                        currentList.forEach((elem, i) => {
                            if (elem.id === id) {
                                index = i;
                            }
                        });
                        //Copy all values from original and modify 'completed' value
                        let elem = res.data;

                        //Replace element remotely
                        currentList[index] = elem;
                        set(todoListState, currentList);
                        setDetailsState('');
                    } else {
                        alert('Coś poszło nie tak');
                    }
                });
        }else{
            alert('Treść nie może być krótsza niż pięć znaków!');
        }
    })


    if (isLoaded) {
        return (<Box
            sx={{
                fontFamily: 'body',
                maxWidth: 720,
                mx: 'auto',
                px: 3,
            }}
            variant="card">
            <Button mt={1} mb={3} variant="smallButton" onClick={() => router.back()}>
                <FontAwesomeIcon icon={faArrowLeft}/> Wróć do listy zadań
            </Button>
            <Heading 
            mb={3}
            height="auto"
            >Szczegóły zadania: {title}</Heading>

            <Textarea
                value={detailsState}
                variant="newTaskTitle"
                maxLength={limit}
                onChange={handleChangeTitle}
                sx={{
                    resize: 'none',
                    fontFamily: 'body'
                }}
            />
            <Box variant="tinyText"
                sx={{
                    color: (charCount === limit) ? 'red' : 'grey',
                    fontWeight: (charCount === limit) ? 'bold' : 'body'
                }}>
                {charCount}/{limit} znaków
            </Box>

            <Flex mt={3}>
                <Box mr={1} variant="infoFrame" width={1 / 2}>
                    Data dodania: <Moment unix>{new Date(created_at).getTime() / 1000}</Moment>
                </Box>
                <Box ml={1} variant="infoFrame" width={1 / 2}>
                    Data ostatniej aktualizacji: <Moment unix>{new Date(updated_at).getTime() / 1000}</Moment>
                </Box>
            </Flex>


            <Flex mt={3}>
                <Button onClick={() => saveMyChanges(taskData)} sx={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }} width={1 / 2} variant="addButton">Zapisz zmiany</Button>

                {completed ?
                    <Button onClick={() => setMeUncompleted(id)} sx={{ borderTopLeftRadius: '0px', borderBottomLefttRadius: '0px' }} width={1 / 2} variant="addButton">
                        Cofnij zatwierdzenie <Loader
                            type="Oval"
                            color="red"
                            secondaryColol="grey"
                            height={10}
                            width={10}
                            visible={changingStateLoaded}
                        />
                    </Button> : <Button onClick={() => setMeCompleted(id)} sx={{ transitionDuration: '.3s', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', bg: 'primary', color: 'whitesmoke', ':hover': { color: 'text' } }} width={1 / 2} variant="addButton">
                        Oznacz jako zakończone
                        <Loader
                            type="Oval"
                            color="red"
                            secondaryColol="grey"
                            height={10}
                            width={10}
                            visible={changingStateLoaded}
                        />
                    </Button>
                }
            </Flex>
        </Box>);
    } else {
        return (<Loader
            type="Oval"
            color="#018786"
            secondaryColol="#800020"
            height={15}
            width={15}
            visible={isLoaded}
        />);
    }
}