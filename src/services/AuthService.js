import { config } from '../config';
import $ from 'jquery';
import jwtDecode from 'jwt-decode';

class AuthService {

    static verify() {

        if(localStorage.getItem('token') !== null && localStorage.getItem('id') !== null) {
            var result = false;
            
            $.ajax({
                type: 'POST',
                url: `${config.API_ROOT}/auth_verify`,
                data: ({ token:  localStorage.getItem('token'), id: localStorage.getItem('id') }),
                dataType: 'json',
                async: false,
                success: function(data) {
                    if(data.success === true)
                    {
                        result = true;
                    }else
                    {
                        console.log('Local storage removed for illicit use');
                        localStorage.clear();
                        result = false;
                    }
                    
                },
                error: function(e) {
                    console.log(e);
                }
            });

            return result;
        }

        return false;
        
    }

    static get() {

        if(localStorage.getItem('token') !== null && localStorage.getItem('id') !== null) {
            var result = false;
            
            $.ajax({
                type: 'POST',
                url: `${config.API_ROOT}/auth_verify`,
                data: ({ token:  localStorage.getItem('token'), id: localStorage.getItem('id') }),
                dataType: 'json',
                async: false,
                success: function(data) {

                    if(data.success === true)
                    {
                        result = JSON.parse(data.message);
                    }else
                    {
                        console.log('Local storage removed for illicit use');
                        localStorage.clear();
                        result = false;
                    }
                    
                },
                error: function(e) {
                    console.log(e);
                }
            });

            return result;
        }

        return false;
    }

    static isAdmin() {
        if(AuthService.verify()) {
            const infos = jwtDecode(localStorage.getItem('token'));
            return infos.rank === 2;
        }else {
            return false;
        }
    }

}

export default AuthService;