import { config } from '../config';
import $ from 'jquery';

class AuthService {

    static verify() {

        if(localStorage.getItem('token') !== null) {
            var result = false;
            
            $.ajax({
                type: 'POST',
                url: `${config.API_ROOT}/auth_verify`,
                data: ({ token:  localStorage.getItem('token')}),
                dataType: 'json',
                async: false,
                success: function(data) {

                    if(data.success === true)
                    {
                        result = true;
                    }else
                    {
                        console.log('Token removed for illicit use');
                        localStorage.removeItem('token');
                        result = false;
                    }
                    
                },
                error: function() {
                    alert('Error occured');
                }
            });

            return result;
        }

        return false;

    }

    static get() {

        if(localStorage.getItem('token') !== null) {
            var result = false;
            
            $.ajax({
                type: 'POST',
                url: `${config.API_ROOT}/auth_verify`,
                data: ({ token:  localStorage.getItem('token')}),
                dataType: 'json',
                async: false,
                success: function(data) {

                    if(data.success === true)
                    {
                        result = JSON.parse(data.message);
                    }else
                    {
                        console.log('Token removed for illicit use');
                        localStorage.removeItem('token');
                        result = false;
                    }
                    
                },
                error: function() {
                    alert('Error occured');
                }
            });

            return result;
        }

        return false;

    }

}

export default AuthService;