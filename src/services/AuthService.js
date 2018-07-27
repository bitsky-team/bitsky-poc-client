import $ from 'jquery';

class AuthService {

    static verify() {

        if(localStorage.getItem('token')) {
            return true;
        }

        return false;

    }

}

export default AuthService;