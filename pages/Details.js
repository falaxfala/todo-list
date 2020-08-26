import { useRouter } from 'next/router';
import { Box, Heading } from 'rebass';
import { useEffect, useState } from 'react';
import { _fetch } from '../components/_fetch';
import { useRecoilValue, useRecoilState, useSetRecoilState, atom, selector } from 'recoil';
import { apiState, newTaskState, newTaskCharCountState } from '../components/StateManagement';
import Loader from 'react-loader-spinner';
import { Textarea } from '@rebass/forms';

export default function Details(props) {
    const router = useRouter();
    const { id } = router.query;

    const { todoBaseApi } = useRecoilValue(apiState);
    const [taskData, setTaskData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [detailsState, setDetailsState] = useRecoilState(newTaskState);
    const { limit, charCount } = useRecoilValue(newTaskCharCountState);

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

        loadTaskData();
    }, [id]);

    const handleChangeTitle = ({ target: { value } }) => {
        setDetailsState(value);
    }

    if (isLoaded) {
        return (<Box
            sx={{
                fontFamily: 'body',
                maxWidth: 720,
                mx: 'auto',
                px: 3,
            }}
            variant="card">
            <Heading mb={3}>Szczegóły zadania: <strong>{title}</strong></Heading>

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