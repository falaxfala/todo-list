
//Wrapper for fetchApi
export const _fetch = (options = {}, type = 'gorest') => {
    //My own token from GoRest
    const gorestToken = 'Bearer 8937b130025a7f1063378e9066ea56a0543d34acd159bc5ff7c9b6858a121c74';
    let token;
    switch (type) {
        case 'gorest':
            token = gorestToken;
            break;
        case 'unauth':
            token = null;
            break;
    }

    let headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers = {
            ...headers,
            'Authorization': token
        }
    }

    options = {
        ...options,
        mode: 'cors',
        headers: {
            ...options.headers,
            ...headers
        }
    }

    async function get(url) {
        return await fetch(url, {
            ...options,
            method: 'GET'
        })
            .then(res => res.json())
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(error => {
                return Promise.reject(error);
            });
    }

    async function post(url, body) {
        return await fetch(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(error => {
                return Promise.reject(error);
            });
    }

    async function patch(url, body) {
        return await fetch(url, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(error => {
                return Promise.reject(error);
            });
    }

    async function _delete(url) {
        return await fetch(url, {
            ...options,
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(error => {
                return Promise.reject(error);
            });
    }

    return {
        get,
        post,
        patch,
        _delete
    };
}

