import { Box, Button } from 'rebass';
import { Select } from "@rebass/forms";
import { useRecoilState } from 'recoil';
import { todoListFilterState } from './StateManagement';

export default function Filter(props) {

const [filter, setFilter] = useRecoilState(todoListFilterState);

const handleChangeFilter = ({target: {value}}) => {
    setFilter(value);
}

    return (<Box>
        <Select
            id='filter'
            name='filter'
            default='ShowAll'
            mb={2}
            onChange={handleChangeFilter}
        >
            <option value="ShowAll">Pokaż wszystkie</option>
            <option value="ShowCompleted">Pokaż ukończone</option>
            <option value="ShowUncompleted">Pokaż nieukończone</option>
        </Select>
    </Box>);
}