import {
    atom,
    selector,
    useRecoilCallback,
    selectorFamily
} from 'recoil';
import { _fetch } from './_fetch';

const todoAPI = 'https://gorest.co.in/public-api/todos';

export const todoListState = atom({
    key: 'todoListState',
    default: []
});

export const todoListFilterState = atom({
    key: 'todoListFilterState',
    default: 'ShowAll',
});

export const todoFilterListSelector = selector({
    key: 'todoFilterListSelector',
    get: ({ get }) => {
        const filter = get(todoListFilterState);
        const list = get(todoListState);

        switch (filter) {
            case 'ShowAll':
                return list;
            case 'ShowCompleted':
                return list.filter((elem) => elem.completed);
            case 'ShowUncompleted':
                return list.filter((elem) => !elem.completed);
            default:
                return list;
        }
    }
});

export const todoListStatsState = selector({
    key: 'todoListStatsState',
    get: ({ get }) => {
        const todoList = get(todoListState);
        const all = todoList.length;
        const allCompleted = todoList.filter((elem) => elem.completed).length;
        const allUncompleted = todoList.filter((elem) => !elem.completed).length;

        return {
            all,
            allCompleted,
            allUncompleted
        };
    }
});


export const setCompleted = selectorFamily({
    key: 'setCompleted',
    get: id => async ({ get }) => {
        return await _fetch().patch('https://gorest.co.in/public-api/todos/' + id, {
            completed: true
        })
            .then(res => {
                if (res.code === 200) {
                    return res;
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
});

export const setDeleted = selectorFamily({
    key: 'setDeleted',
    get: id => async ({ get }) => {
        return await _fetch()._delete('https://gorest.co.in/public-api/todos/' + id)
            .then(res => {
                return res;

            })
            .catch(error => {
                console.log(error);
            });
    }
})
