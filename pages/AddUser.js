import { Heading, Box, Text, Flex, Button } from "rebass";
import { Input, Select } from "@rebass/forms";
import { useState } from "react";
import { _fetch } from '../components/_fetch';
import { useRecoilValue, useRecoilState } from "recoil";
import { apiState } from "../components/StateManagement";
import { useRouter } from "next/router";

/*
I'm decided to check if GoRestApi has user with id which is saved 
in localStorage(), because remote users accounts are temporary.
Here I'm not playing with recoil (with adding user), because there's no need to.
*/

export default function AddUser(props) {
    const [userData, setUserData] = useState({
        email: '',
        name: '',
        gender: '',
        status: 'Active'
    });
    const { userBaseApi } = useRecoilValue(apiState);
    const [api, setApi] = useRecoilState(apiState);
    const router = useRouter();

    const handleChangeUserData = ({ target: { value, name } }) => {
        setUserData({ ...userData, [name]: value });
    }

    const saveNewUser = (event) => {
        event.preventDefault();

        if (userData.email !== '' && userData.name !== '' && userData.gender !== '') {
            _fetch().post(userBaseApi, userData)
                .then(res => {
                    //User successfully created
                    if (res.code === 201) {
                        //refresh userId
                        localStorage.setItem('todoUserId', res.data.id);
                        setApi({...api, userID: res.data.id, todoUserApi: 'https://gorest.co.in/public-api/users/' + res.data.id + '/todos/'});
                        router.push('/');
                    } else {
                        let error = '';
                        res.data.forEach(err => {
                            error += err.field + ' ' + err.message + '. ';
                        });
                        alert(error);
                    }
                });
        } else {
            alert('Proszę wypełnić wszystkie dane');
        }
    }

    return (<Box
        variant="card"
        sx={{
            fontFamily: 'body',
            maxWidth: 720,
            mx: 'auto',
            px: 3,
        }}>
        <Heading>Nie znaleziono użytkownika w GoRestApi</Heading>
        <Text>Proszę stworzyć użytkownika do poprawnego działania sesji</Text>
        <form onSubmit={saveNewUser}>
            <Flex
                mb={3}
                mt={3}
                sx={{
                    flexWrap: 'wrap',
                    width: '100%'
                }}
            >
                <Box width={1 / 2}>
                    <Input
                        name="email"
                        placeholder="Adres e-mail"
                        onChange={handleChangeUserData}
                        value={userData.email}
                    />
                </Box>

                <Box width={1 / 2}>
                    <Input
                        name="name"
                        placeholder="Imię"
                        onChange={handleChangeUserData}
                        value={userData.name}
                    />
                </Box>
            </Flex>

            <Flex
                mb={3}
                mt={3}
                sx={{
                    flexWrap: 'wrap',
                    width: '100%'
                }}
            >
                <Box width={1}>
                    <Select
                        name="gender"
                        value={userData.gender}
                        onChange={handleChangeUserData}
                    >
                        <option value="">Wybierz płeć</option>
                        <option value="Male">Mężczyzna</option>
                        <option value="Female">Kobieta</option>
                    </Select>
                </Box>
            </Flex>

            <Flex>
                <Box width={1}>
                    <Button
                        type="submit"
                        variant="addButton"
                    >
                        Zapisz użytkownika
                </Button>
                </Box>
            </Flex>
        </form>
    </Box>);
}