import {
    atom,
    selector,
    useRecoilCallback,
    selectorFamily
} from 'recoil';
import { _fetch } from './_fetch';

const userID = 1610; //ID of user created in gorest API for limit response data
const todoUserAPI = 'https://gorest.co.in/public-api/users/' + userID + '/todos/';
const todoBaseApi = 'https://gorest.co.in/public-api/todos/';

export const apiState = atom({
    key: 'apiState',
    default: { todoUserAPI, todoBaseApi, userID }
});

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
        const { todoBaseApi } = get(apiState);
        return await _fetch().patch(todoBaseApi + id, {
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
        const { todoBaseApi } = get(apiState);
        return await _fetch()._delete(todoBaseApi + id)
            .then(res => {
                return res;
            })
            .catch(error => {
                console.log(error);
            });
    }
});

export const newTaskState = atom({
    key: 'addNewTaskState',
    default: ''
});

export const newTaskCharCountState = selector({
    key: 'newTaskCharCountState',
    get: ({ get }) => {
        const currentNewTaskState = get(newTaskState);
        const limit = 150; //Limit of characters

        return {
            charCount: currentNewTaskState.length,
            limit: limit
        };
    }
});

export const saveNewTaskState = selector({
    key: 'saveNewTaskState',
    get: async ({ get }) => {
        const { todoBaseApi, userID } = get(apiState);
        const title = get(newTaskState);

        const bodyObject = {
            user_id: userID,
            title: title,
            completed: false
        };

        return await _fetch().post(todoBaseApi, bodyObject)
            .then(res => {
                console.log(res);
                return res;
            })
    }
})
