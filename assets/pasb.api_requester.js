export default class APIRequester {
    constructor(url) {
        this.base_url = 'http://localhost:5678/api';
        this.request_headers = {
            'Accept': '*/*'
        }
    }

    getCategories() {
        return new Promise((resolve, reject) => {
            this.__request('/categories', 'GET')
            .then((data) => resolve(data))
            .catch(reject);
        });
    }

    getWorks() {
        return new Promise((resolve, reject) => {
            this.__request('/works', 'GET')
            .then((data) => resolve(data))
            .catch(reject);
        });
    }

    createWork(data) {
        return new Promise((resolve, reject) => {
            if (!this.__isConnected()) { reject(new Error('Vous n\'êtes pas connecté !')); }
            
            this.__request('/works', 'POST', data)
            .then((data) => resolve(data))
            .catch(reject);
        });
    }

    deleteWork(workId) {
        return new Promise((resolve, reject) => {
            if (!this.__isConnected()) { reject(new Error('Vous n\'êtes pas connecté !')); }

            this.__request('/works/' + workId, 'DELETE')
            .then((data) => resolve(data))
            .catch(reject);
        });
    }

    __isConnected() {
        const is_connected = localStorage.getItem('is_connected');
        if (!is_connected || is_connected !== 'true') { return false; }
        else { return true; }
    }

    __updateHeaders() {
        if (this.__isConnected()) {
            const user_data = localStorage.getItem('user_data');
            if (!user_data) { return; }
            const token = JSON.parse(user_data).token;
            this.request_headers.Authorization = 'Bearer ' + token;
        }
    }

    __request(endpoint, method = 'GET', data = {}) {
        return new Promise((resolve, reject) => {
            this.__updateHeaders();

            if (method.toLowerCase() === 'get') { data = undefined; }
            
            fetch(this.base_url + endpoint, {
                method,
                headers: this.request_headers,
                body: data,
            })
            .then((res) => {
                if (res.status === 204) {
                    return resolve({});
                }
                resolve(res.json())
            })
            .catch(reject);
        });
    }
};