class RankService {

    static translate(id) {
        switch(id) {
            case 1: return 'Utilisateur'
            case 2: return 'Administrateur'
            default: return 'Utilisateur'
        }
    }

}

export default RankService