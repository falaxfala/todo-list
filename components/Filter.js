import { Box, Button, Flex } from 'rebass';
import { Select, Input } from "@rebass/forms";
import { useRecoilState } from 'recoil';
import { todoListFilterState, titleFilterState } from './StateManagement';

export default function Filter(props) {

    const [filter, setFilter] = useRecoilState(todoListFilterState);
    const [titleFilter, setTitleFilter] = useRecoilState(titleFilterState);

    const handleChangeFilter = ({ target: { value } }) => {
        setFilter(value);
    }

    const handleChangeTitleFilter = ({ target: { value } }) => {
        setTitleFilter(value);
    }

    return (<Flex>
        <Box width={3 / 5}>
            <Input
                type="text"
                placeholder="Szukaj według nazwy"
                value={titleFilter}
                onChange={handleChangeTitleFilter}
                id="titleFilter"
                name="titleFilter"
                sx={{
                    lineHeight: '1.3rem',
                    transitionDuration: '.3s',
                    ':focus': {
                        boxShadow: 'hardShort'
                    }
                }}
            />
        </Box>

        <Box width={2 / 5}>
            <Select
                id="filter"
                name="filter"
                default="ShowAll"
                mb={2}
                onChange={handleChangeFilter}
            >
                <option value="ShowAll">Pokaż wszystkie</option>
                <option value="ShowCompleted">Pokaż ukończone</option>
                <option value="ShowUncompleted">Pokaż nieukończone</option>
            </Select>
        </Box>
    </Flex>);
}