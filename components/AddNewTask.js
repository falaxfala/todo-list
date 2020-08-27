import { Flex, Box, Text, Button } from 'rebass';
import { Textarea } from '@rebass/forms';
import { newTaskCharCountState, newTaskState, saveNewTaskState, todoListState } from './StateManagement';
import { useRecoilValue, useRecoilState, useRecoilCallback } from 'recoil';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AddNewTask(props) {

    const [todoList, setTodoList] = useRecoilState(todoListState);
    const [title, setTitle] = useRecoilState(newTaskState);
    const { charCount, limit } = useRecoilValue(newTaskCharCountState);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    //Reset value on component loading
    useEffect(() => {
        setTitle('');
    }, []);

    //Handle changing input to state
    const handleInput = (event) => {
        setTitle(event.target.value);
    }

    //Save callback
    const saveNewTask = useRecoilCallback(({ snapshot, set }) => () => {
        setIsLoading(true);
        return snapshot.getPromise(saveNewTaskState)
            .then(res => {
                if (res.code !== 422) {
                    const currentList = [...todoList];
                    currentList.push(res.data);
                    set(todoListState, currentList);
                    return res;
                } else {
                    router.push('/AddUser');
                }
            })
            .catch(error => {
                alert(error);
            });
    });

    //Validation
    const tryToSave = () => {
        if (!title || title.length < 5) {
            alert('Treść nie może być krótsza niż pięć znaków!');
            return;
        }
        saveNewTask()
            .then(() => {
                setIsLoading(false);
                setTitle('');
                setShowForm(false);
            });
    }

    if (showForm) {
        return (<Box mt={3} mb={3}>
            <Flex variant="newTaskBox">
                <Box width={[3 / 5, 3 / 4, 3 / 4]}>
                    <Textarea
                        id="newTaskTitle"
                        name="newTaskTitle"
                        variant="newTaskTitle"
                        placeholder="Treść zadania"
                        maxLength={limit}
                        onInput={handleInput}
                        value={title}
                        sx={{
                            resize: 'none',
                            fontFamily: 'body',
                            borderTopRightRadius: '0px',
                            borderBottomRightRadius: '0px'
                        }}
                    />
                </Box>

                <Box width={[2 / 5, 1 / 4, 1 / 4]}>
                    <Button
                        disabled={isLoading}
                        onClick={tryToSave}>
                        {isLoading ? 'Zapisuję...' : 'Zapisz zadanie'}
                    </Button>
                </Box>
            </Flex>
            <Box variant="tinyText"
                sx={{
                    color: (charCount === limit) ? 'red' : 'grey',
                    fontWeight: (charCount === limit) ? 'bold' : 'body'
                }}>
                {charCount}/{limit} znaków
            </Box>
        </Box>);
    } else {
        return (<Button variant="addButton" mb={3} mt={3} onClick={() => setShowForm(true)}>Dodaj nowe zadanie</Button>)
    }
}