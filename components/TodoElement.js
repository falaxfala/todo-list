import {
    useRecoilState,
    useSetRecoilState,
    useRecoilCallback,
    useRecoilValue
} from 'recoil';
import Link from 'next/link';
import { Heading, Button, Box, Flex, Text } from 'rebass';
import Moment from 'react-moment';

//FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faMinusCircle, faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { setCompleted, setDeleted, todoListState } from './StateManagement';

export default function TodoElement({ element }) {

    const {
        completed,
        created_at,
        id,
        title,
        updated_at,
        user_id
    } = element;

    const defaultStatus = completed ? 'Ukończone' : 'Nieukończone';
    const statusIcon = completed ? <FontAwesomeIcon color="#018786" icon={faCheck} /> : <FontAwesomeIcon color="#800020" icon={faBan} />;

    //Link href={{ pathname: '/details', query: { id: id } }} passHref

    //Use callback to handle one-shot async action
    //Setting element 'completed' value after response from server
    const todoList = useRecoilValue(todoListState);
    const setMeCompleted = useRecoilCallback(({ snapshot, set }) => elemId => {
        snapshot.getPromise(setCompleted(elemId));

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
        //Replace element locally to prevent unwanted data fetching and update list state to rerender view
        currentList[index] = elem;
        set(todoListState, currentList);
    });

    const setMeDeleted = useRecoilCallback(({ snapshot, set }) => elemId => {
        snapshot.getPromise(setDeleted(elemId));

        //Unmutate list state object by making a copy
        const currentList = [...todoList];
        let index;
        //Find index of duplicate with the same id
        currentList.forEach((elem, i) => {
            if (elem.id === elemId) {
                index = i;
            }
        });

        //Splice array to remove item with selected index
        currentList.splice(index, 1);
        //Replace element locally to prevent unwanted data fetching and update list state to rerender view
        set(todoListState, currentList);
    });

    return (<Flex variant="todoElem" title="Kliknij aby zobaczyć szczegóły">
        <Box width={[3 / 5, 3 / 4, 3 / 4]} variant="todoElemLeft">
            <Heading
                sx={{
                    fontFamily: 'heading',
                    fontSize: '1rem'
                }}>
                {title}
            </Heading>

            <Text mt={3} fontWeight="bold">
                {defaultStatus} {statusIcon}
            </Text>

            <Box variant="momentDate">
                Dodano &nbsp;
                <Moment unix>
                    {new Date(created_at).getTime() / 1000}
                </Moment>
            </Box>
        </Box>
        <Flex width={[2 / 5, 1 / 4, 1 / 4]} variant="todoElemRight">
            <Button onClick={() => setMeDeleted(id)} title="Usuń" variant="todosActions">
                <FontAwesomeIcon icon={faMinusCircle} />
            </Button>

            {!completed &&
                <Button onClick={() => setMeCompleted(id)} color="#018786" title="Oznacz jako ukończone" variant="todosActions">
                    <FontAwesomeIcon icon={faCheck} />
                </Button>
            }
        </Flex>
    </Flex>)
}