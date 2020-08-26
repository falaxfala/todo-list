import { useRecoilValue } from 'recoil';
import { todoListStatsState, todoListFilterState } from './StateManagement';
import { Box, Flex, Text } from 'rebass';

export default function (props) {

    const {
        all,
        allCompleted,
        allUncompleted
    } = useRecoilValue(todoListStatsState);

    const currentFilter = useRecoilValue(todoListFilterState);

    return (<Flex mt={3} mb={3}>
        <Box sx={{fontWeight: currentFilter === 'ShowAll' ? 'bold': '400'}} width={1 / 3}>
            Wszystkie: {all}
        </Box>

        <Box sx={{fontWeight: currentFilter === 'ShowCompleted' ? 'bold': '400'}} width={1 / 3}>
            Ukończone: <span style={{color: '#018786'}}>{allCompleted}</span>
        </Box>

        <Box sx={{fontWeight: currentFilter === 'ShowUncompleted' ? 'bold': '400'}} width={1 / 3}>
            Nieukończone: <span style={{color: '#800020'}}>{allUncompleted}</span>
        </Box>
    </Flex>);

}