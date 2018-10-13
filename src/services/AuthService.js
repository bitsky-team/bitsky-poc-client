import { config } from '../config';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import qs from 'qs';

class AuthService {
    static async verify(get = false) {
        if(localStorage.getItem('token') !== null || localStorage.getItem('id') !== null) {
            var result = false;
            const {data} = await axios.post(`${config.API_ROOT}/auth_verify`, qs.stringify({ token:  localStorage.getItem('token'), id: localStorage.getItem('id') }));
            result = data.success;
            if(!result) AuthService.clearStorage();
            if(get) { return JSON.parse(data.message); }
            else { return result; }
        }
        return false;
    }

    static isAdmin() {
        const infos = jwtDecode(localStorage.getItem('token'));
        return infos.rank === 2;
    }

    static clearStorage() {
        console.log('Local storage removed for illicit use');
        localStorage.clear();
    }
}

export default AuthService;