class DateService {
    static timeSince(date) {
        var seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " ans";
        }

        interval = Math.floor(seconds / 2592000);  
        if (interval > 1) {
            return interval + " mois";
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " jours";
        }

        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " heures";
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }

        return Math.floor(seconds) + " secondes";
    }
}

export default DateService;