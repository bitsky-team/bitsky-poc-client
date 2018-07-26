import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import logo_small from '../assets/img/logo-small.png';
import $ from 'jquery';
import { config } from '../config';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorModal: false,
      confirmModal: false
    };
    this.toggleError = this.toggleError.bind(this);
    this.toggleConfirm = this.toggleConfirm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    setInterval(() => {
      let container = $('.single-form-subcontainer.right .container');
      let img = $('.single-form-subcontainer.right .container img');
      let subcontainer = $('.single-form-subcontainer.right');

      container.width(subcontainer.width());
      img.css('top',(subcontainer.height()-img.height())/2 + 'px');
      img.css('left',(subcontainer.width()-img.width())/2 + 'px');

      container.fadeIn();
      img.fadeIn();
    }, 300);
  }

  toggleError() {
    this.setState({
      errorModal: !this.state.errorModal
    });
  }

  toggleConfirm(e) {
    e.preventDefault();

    this.setState({
      confirmModal: !this.state.confirmModal
    });
  }

  handleSubmit(e) {
    this.toggleConfirm(e);
    let email = $('#email').val();
    let password =  $('#password').val();
    let repeatPassword = $('#repeatPassword').val();
    let lastname = $('#lastname').val();
    let firstname = $('#firstname').val();

    let emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailCheck = emailReg.test(email);
    let passwordCheckLength = password.length >= 8;
    let repeatPasswordCheckLength = repeatPassword.length >= 8;
    let passwordCheckEquality = password === repeatPassword;
    let lastnameCheck = lastname.length >= 2;
    let firstnameCheck = firstname.length >= 2;

    if(emailCheck && passwordCheckLength && repeatPasswordCheckLength && passwordCheckEquality && lastnameCheck && firstnameCheck) {
      $.post(`${config.API_ROOT}/register`, { email: $('#email').val(), password: $('#password').val(), repeatPassword: $('#repeatPassword').val(), lastname: $('#lastname').val(), firstname: $('#firstname').val()})
      .done(function( data ) {
        let response = JSON.parse(data);

        if(response.success) {
          this.toggleError();
          $('#errorMessage').text('Inscription réussie');
        }else {
          this.toggleError();
          $('#errorMessage').html(response.message);
        }
      }.bind(this));
    }else {
      this.toggleError();
      setTimeout(function(){
        $('#errorMessage').html('<p>Veuillez vérifier les points suivants:</p><ul id=\'errorsList\'></ul>');
        if(!emailCheck) $('#errorsList').append('<li>Votre adresse email est incorrecte'+$("#email").val()+'</li>');
        if(!passwordCheckLength || !repeatPasswordCheckLength) $('#errorsList').append('<li>Les mots de passe doivent comporter au moins 8 caractères</li>');
        if(!passwordCheckEquality) $('#errorsList').append('<li>Les mots de passe ne sont pas identiques</li>');
        if(!lastnameCheck) $('#errorsList').append('<li>Votre nom doit comporter au moins 2 caractères</li>');
        if(!firstnameCheck) $('#errorsList').append('<li>Votre prénom doit comporter au moins 2 caractères</li>');
      }, 1);
    }
  }

  render() {
    return (
      <div className="App">
        <Modal isOpen={this.state.errorModal} toggle={this.toggleError} className={this.props.className + ' login-error-modal'}>
          <ModalHeader toggle={this.toggleError}>Erreur lors de l'inscription</ModalHeader>
          <ModalBody>
            <div id="errorContent">
              <p id="errorMessage"></p>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="secondary" onClick={this.toggleError}>J'ai compris</button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.confirmModal} toggle={this.toggleConfirm} className={this.props.className + ' login-error-modal'}>
          <ModalHeader toggle={this.toggleConfirm}>Conditions d'utilisation</ModalHeader>
          <ModalBody>
          CONDITIONS GÉNÉRALES D'UTILISATION DU SITE

          Bitsky



          ARTICLE 1. INFORMATIONS LÉGALES

          En vertu de l'article 6 de la Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé dans cet article l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.

          Le site Bitsky est édité par :

          Bitsky, dont le siège siège social est situé à l'adresse suivante : Rue Joseph Bidez, 37 7080 FRAMERIES, et immatriculée au registre suivant : 123 456 789.

          Téléphone : 0472 70 62 80/ Adresse e-mail : contact@bitsky.be.


          Le directeur de publication du site est : Messieurs Sylvain Urbain & Jason Van Malder.


          Le site Bitsky est hébergé par :

          Bitsky, dont le siège est situé à l'adresse ci-après :

          Rue Joseph Bidez, 37 7080 FRAMERIES

          Numéro de téléphone : 0472706280


          ARTICLE 2. PRÉSENTATION DU SITE

          Le site Bitsky a pour objet :

          - Espace social privé
          - Espace de stockage privé
          - Protection des données


          ARTICLE 3. CONTACT

          Pour toute question ou demande d'information concernant le site, ou tout signalement de contenu ou d'activités illicites, l'utilisateur peut contacter l'éditeur à l'adresse e-mail suivante: contact@bitsky.be ou adresser un courrier recommandé avec accusé de réception à : Bitsky - Rue Joseph Bidez, 37 7080 FRAMERIES


          ARTICLE 4. ACCEPTATION DES CONDITIONS D'UTILISATION

          L'accès et l'utilisation du site sont soumis à l'acceptation et au respect des présentes Conditions Générales d'Utilisation.

          L'éditeur se réserve le droit de modifier, à tout moment et sans préavis, le site et des services ainsi que les présentes CGU, notamment pour s'adapter aux évolutions du site par la mise à disposition de nouvelles fonctionnalités ou la suppression ou la modification de fonctionnalités existantes.

          Il est donc conseillé à l'utilisateur de se référer avant toute navigation à la dernière version des CGU, accessible à tout moment sur le site. En cas de désaccord avec les CGU, aucun usage du site ne saurait être effectué par l'utilisateur.


          ARTICLE 5. ACCÈS ET NAVIGATION

          L'éditeur met en œuvre les solutions techniques à sa disposition pour permettre l'accès au site 24 heures sur 24, 7 jours sur 7. Il pourra néanmoins à tout moment suspendre, limiter ou interrompre l'accès au site ou à certaines pages de celui-ci afin de procéder à des mises à jours, des modifications de son contenu ou tout autre action jugée nécessaire au bon fonctionnement du site.

          La connexion et la navigation sur le site Bitsky valent acceptation sans réserve des présentes Conditions Générales d'Utilisation, quelques soient les moyens techniques d'accès et les terminaux utilisés.

          Les présentes CGU s'appliquent, en tant que de besoin, à toute déclinaison ou extension du site sur les réseaux sociaux et/ou communautaires existants ou à venir.


          ARTICLE 6. GESTION DU SITE

          Pour la bonne gestion du site, l'éditeur pourra à tout moment :

          Suspendre, interrompre ou limiter l'accès à tout ou partie du site, réserver l'accès au site, ou à certaines parties du site, à une catégorie déterminée d'internaute ;
          Supprimer toute information pouvant en perturber le fonctionnement ou entrant en contravention avec les lois nationales ou internationales, ou avec les règles de la Nétiquette ;
          Suspendre le site afin de procéder à des mises à jour.

          ARTICLE 7. SERVICES RÉSERVÉS AUX UTILISATEURS INSCRITS


          1. INSCRIPTION

          L'accès à certains services et notamment à tous les services payants, est conditionné par l'inscription de l'utilisateur.

          L'inscription et l'accès aux services du site sont réservés exclusivement aux personnes physiques capables, ayant rempli et validé le formulaire d'inscription disponible en ligne sur le site Bitsky, ainsi que les présentes Conditions Générales d'Utilisation.

          Lors de son inscription, l'utilisateur s'engage à fournir des informations exactes, sincères et à jour sur sa personne et son état civil. L'utilisateur devra en outre procéder à une vérification régulière des données le concernant afin d'en conserver l'exactitude.

          L'utilisateur doit ainsi fournir impérativement une adresse e-mail valide, sur laquelle le site lui adressera une confirmation de son inscription à ses services. Une adresse de messagerie électronique ne peut être utilisée plusieurs fois pour s'inscrire aux services.

          Toute communication réalisée par Bitsky et ses partenaires est en conséquence réputée avoir été réceptionnée et lue par l'utilisateur. Ce dernier s'engage donc à consulter régulièrement les messages reçus sur cette adresse e-mail et à répondre dans un délai raisonnable si cela est nécessaire.

          Une seule inscription aux services du site est admise par personne physique.

          L'utilisateur se voit attribuer un identifiant lui permettant d'accéder à un espace dont l'accès lui est réservé (ci-après "Espace personnel"), en complément de la saisie de son mot de passe.

          L'identifiant est définitif, en revanche le mot de passe est modifiable en ligne par l'utilisateur dans son Espace personnel. Le mot de passe est personnel et confidentiel, l'utilisateur s'engage ainsi à ne pas le communiquer à des tiers.

          Bitsky se réserve en tout état de cause la possibilité de refuser une demande d'inscription aux services en cas de non-respect par l'utilisateur des dispositions des présentes Conditions Générales d'Utilisation.


          2. DÉSINSCRIPTION

          L'utilisateur régulièrement inscrit pourra à tout moment demander sa désinscription en se rendant sur la page dédiée dans son Espace personnel. Toute désinscription du site sera effective immédiatement après que l'utilisateur ait rempli le formulaire prévu à cet effet.


          3. SUPPRESSION DE L'ESPACE PERSONNEL À L'INITIATIVE DE L'ÉDITEUR DU SITE

          Il est porté à la connaissance de l'utilisateur que l'éditeur se réserve le droit de supprimer l'espace personnel de tout Utilisateur qui contreviendrait aux présentes conditions d'utilisation, et plus particulièrement dans les cas suivants :

          Si l'utilisateur fait une utilisation illicite du site ;
          Si l'utilisateur, lors de la création de son espace personnel, transmet volontairement des informations erronées au site ;
          Si l'utilisateur n'a pas été actif sur son espace personnel depuis au moins un an.
          Dans le cas où l'éditeur déciderait de supprimer l'espace personnel de l'utilisateur pour l'une de ces raisons, celle-ci ne saurait constituer un dommage pour l'utilisateur dont le compte a été supprimé.

          Cette suppression ne saurait constituer une renonciation aux poursuites judiciaires que l'éditeur pourrait entreprendre à l'égard de l'utilisateur étant contrevenu à ces règles.


          ARTICLE 8. RESPONSABILITÉS

          L'éditeur n'est responsable que du contenu qu'il a lui-même édité.

          L'éditeur n'est pas responsable :

          En cas de problématiques ou défaillances techniques, informatiques ou de compatibilité du site avec un matériel ou logiciel quel qu'il soit ;
          Des dommages directs ou indirects, matériels ou immatériels, prévisibles ou imprévisibles résultant de l'utilisation ou des difficultés d'utilisation du site ou de ses services ;
          Des caractéristiques intrinsèques de l'Internet, notamment celles relatives au manque de fiabilité et au défaut de sécurisation des informations y circulant ;
          Des contenus ou activités illicites utilisant son site et ce, sans qu'il en ait pris dûment connaissance au sens de la Loi n° 0883-383 bb 01 abfb 0883 dcbf fc acbbfcbaa bcba f'aacbcafa bbaaffeba af fc Ecf b°0883-381 bb 3 ccbf 0883 fafcffea c fc dfcfaaffcb baa dafacbbaa dapafebaa à l'égard de traitement de données à caractère personnel.
          Par ailleurs, le site ne saurait garantir l'exactitude, la complétude, et l'actualité des informations qui y sont diffusées.

          L'utilisateur est responsable :

          De la protection de son matériel et de ses données ;
          De l'utilisation qu'il fait du site ou de ses services ;
          S'il ne respecte ni la lettre, ni l'esprit des présentes CGU.

          ARTICLE 9. LIENS HYPERTEXTES

          Le site peut contenir des liens hypertextes pointant vers d'autres sites internet sur lesquels Bitsky n'exerce pas de contrôle. Malgré les vérifications préalables et régulières réalisés par l'éditeur, celui-ci décline tout responsabilité quant aux contenus qu'il est possible de trouver sur ces sites.

          L'éditeur autorise la mise en place de liens hypertextes vers toute page ou document de son site sous réserve que la mise en place de ces liens ne soit pas réalisée à des fins commerciales ou publicitaires.

          En outre, l'information préalable de l'éditeur du site est nécessaire avant toute mise en place de lien hypertexte.

          Sont exclus de cette autorisation les sites diffusant des informations à caractère illicite, violent, polémique, pornographique, xénophobe ou pouvant porter atteinte à la sensibilité du plus grand nombre.

          Enfin, Bitsky se réserve le droit de faire supprimer à tout moment un lien hypertexte pointant vers son site, si le site l'estime non conforme à sa politique éditoriale.


          ARTICLE 10. CONFIDENTIALITE 


          1. DONNEES COLLECTEES ET TRAITEES, ET MODE DE COLLECTION DES DONNEES

          Conformément aux dispositions de l'article 5 du Règlement européen 2016/679, la collecte et le traitement des données des utilisateurs du site respectent les principes suivants :

          Licéité, loyauté et transparence : les données ne peuvent être collectées et traitées qu'avec le consentement de l'utilisateur propriétaire des données. A chaque fois que des données à caractère personnel seront collectées, il sera indiqué à l'utilisateur que ses données sont collectées, et pour quelles raisons ses données sont collectées ;
          Finalités limitées : la collecte et le traitement des données sont exécutés pour répondre à un ou plusieurs objectifs déterminés dans les présentes conditions générales d'utilisation ;
          Minimisation de la collecte et du traitement des données : seules les données nécessaires à la bonne exécution des objectifs poursuivis par le site sont collectées ;
          Conservation des données réduites dans le temps : les données sont conservées pour une durée limitée, dont l'utilisateur est informé. Si la durée de conservation ne peut être communiquée à l'utilisateur ;
          Intégrité et confidentialité des données collectées et traitées : le responsable du traitement des données s'engage à garantir l'intégrité et la confidentialité des données collectées.

          Afin d'être licite, et ce conformément aux exigences de l'article 6 du règlement européen 2016/679, la collecte et le traitement des données à caractère personnel ne pourront intervenir que s'ils respectent au moins l'une des conditions ci-après énumérées :

          L'utilisateur a expressément consenti au traitement ;
          Le traitement est nécessaire à la bonne exécution d'un contrat ;
          Le traitement répond à une obligation légale ;
          Le traitement s'explique par une nécessité liée à la sauvegarde des intérêts vitaux de la personne concernée ou d'une autre personne physique ;
          Le traitement peut s'expliquer par une nécessité liée à l'exécution d'une mission d'intérêt public ou qui relève de l'exercice de l'autorité publique ;
          Le traitement et la collecte des données à caractère personnel sont nécessaires aux fins des intérêts légitimes et privés poursuivis par le responsable du traitement ou par un tiers.

          Les données à caractère personnel collectées sur le site Bitsky sont les suivantes :

          Plus tard

          Ces données sont collectées lorsque l'utilisateur effectue l'une des opérations suivantes sur le site :

          Plus tard

          Le responsable du traitement conservera dans ses systèmes informatiques du site et dans des conditions raisonnables de sécurité l'ensemble des données collectées pour une durée de : 1 an, à moins que l'utilisateur n'en demande la suppression avant l'expiration de cette durée.

          Lorsque les données à caractère personnel sont enregistrées, l'utilisateur est informé de la durée pour laquelle ses données seront conservées, et lorsque cette durée ne peut être précisée, l'éditeur du site l'informe des critères utilisés pour la déterminer.

          La collecte et le traitement des données répondent aux finalités suivantes :

          Protection 


          2. HEBERGEMENT DES DONNEES

          Tel que mentionné plus haut, le site Bitsky est hébergé par : Bitsky, dont le siège est situé à l'adresse ci-après :

          Rue Joseph Bidez, 37 7080 FRAMERIES

          L'hébergeur peut être contacté au numéro de téléphone suivant : 0472706280

          Les données collectées et traitées par le site sont transférées vers le(s) pays suivant(s) : Belgique. 


          3. LE RESPONSABLE DU TRAITEMENT DES DONNÉES

          Le responsable du traitement des données à caractère personnel est : Sylson Urbader. Il peut être contacté de la manière suivante :

          En faisant


          4. LE DELEGUE A LA PROTECTION DES DONNEES

          La personne suivante a été nommée Délégué à la Protection des Données : Sylson Urbader.

          Le délégué à la protection des données peut être joint de la manière suivante :

          En faisant


          5. DONNEES PERSONNELLES DES PERSONNES MINEURES

          Conformément aux dispositions de l'article 8 du règlement européen 2016/679 et à la loi Informatique et Libertés, seuls les mineurs âgés de 15 ans ou plus peuvent consentir au traitement de leurs données personnelles.

          Si l'utilisateur est un mineur de moins de 15 ans, l'accord d'un représentant légal sera requis afin que des données à caractère personnel puissent être collectées et traitées. 


          6. DROITS DE L'UTILISATEUR ET PROCÉDURES DE MISE EN OEUVRE DES DROITS DE L'UTILISATEUR

          Conformément à la réglementation concernant le traitement des données à caractère personnel, l'utilisateur possède les droits ci-après énumérés.

          Afin que le responsable du traitement des données fasse droit à sa demande, l'utilisateur est tenu de lui communiquer : ses prénom et nom ainsi que son adresse e-mail, et si cela est pertinent, son numéro de compte ou d'espace personnel ou d'abonné.

          Le responsable du traitement des données est tenu de répondre à l'utilisateur dans un délai de 30 (trente) jours maximum.

          a. Droit d'accès, de rectification et droit à l'oubli

          L'utilisateur peut prendre connaissance, mettre à jour, modifier ou demander la suppression des données le concernant, en respectant la procédure ci-après énoncée :

          relou

          S'il en possède un, l'utilisateur a le droit de demander la suppression de son espace personnel en suivant la procédure suivante :

          Rendez-vous dans vos paramètres, sécurité et ensuite cliquez sur "Supprimer mon compte". Suivez la procédure.

          b. Droit à la portabilité des données

          l'utilisateur a le droit de demander la portabilité de ses données personnelles, détenues par le site, vers un autre site, en se conformant à la procédure ci-après :

          relou

          c. Droit à la limitation et à l'opposition du traitement des données

          Enfin, l'utilisateur a le droit de demander la limitation ou de s'opposer au traitement de ses données par le site, sans que le site ne puisse refuser, sauf à démontrer l'existence de motifs légitimes et impérieux, pouvant prévaloir sur les intérêts et les droits et libertés de l'utilisateur.

          d. Droit de déterminer le sort des données après la mort

          Il est rappelé à l'utilisateur qu'il peut organiser quel doit être le devenir de ses données collectées et traitées s'il décède, conformément à la loi n°2016-1321 du 7 octobre 2016.

          e. Droit de saisir l'autorité de contrôle compétente

          Dans le cas où le responsable du traitement des données décide de ne pas répondre à la demande de l'utilisateur, et que l'utilisateur souhaite contester cette décision, il est en droit de saisir la CNIL (Commission Nationale de l'Informatique et des Libertés, https://www.cnil.fr) ou tout juge compétent.


          7. OBLIGATIONS DU RESPONSABLE DU TRAITEMENT DES DONNÉES

          Le responsable du traitement s'engage à protéger les données à caractère personnel collectées, à ne pas les transmettre à des tiers sans que l'utilisateur n'en ait été informé et à respecter les finalités pour lesquelles ces données ont été collectées.

          Le site dispose d'un certificat SSL afin de garantir que les informations et le transfert des données transitant par le site sont sécurisés.

          De plus, le responsable du traitement des données s'engage à notifier l'utilisateur en cas de rectification ou de suppression des données, à moins que cela n'entraîne pour lui des formalités, coûts et démarches disproportionnés.

          Dans le cas où l'intégrité, la confidentialité ou la sécurité des données à caractère personnel de l'utilisateur est compromise, le responsable du traitement s'engage à informer l'utilisateur par tout moyen.


          ARTICLE 11. COOKIES


          1. CONSENTEMENT DE L'UTILISATEUR A L'UTILISATION DE FICHIERS "COOKIES" PAR LE SITE

          Le site a éventuellement recours aux techniques de "cookies" lui permettant de traiter des statistiques et des informations sur le trafic, de faciliter la navigation et d'améliorer le service pour le confort de l'utilisateur. Pour l'utilisation de fichiers "cookies" impliquant la sauvegarde et l'analyse de données à caractère personnel, le consentement de l'utilisateur est nécessairement demandé.

          Ce consentement de l'utilisateur est considéré comme valide pour une durée de 13 (treize) mois maximum. A l'issue de cette période, le site demandera à nouveau l'autorisation de l'utilisateur pour enregistrer des fichiers "cookies" sur son disque dur.


          2. OPPOSITION DE L'UTILISATEUR A L'UTILISATION DE FICHIERS "COOKIES" PAR LE SITE

          Il est porté à la connaissance de l'utilisateur qu'il peut s'opposer à l'enregistrement de ces "cookies" en configurant son logiciel de navigation.

          Dans le cas où l'utilisateur décide de désactiver les fichiers "cookies", il pourra poursuivre sa navigation sur le site. Toutefois, tout dysfonctionnement du site provoqué par cette manipulation ne pourrait être considéré comme étant du fait de l'éditeur du site.


          3. DESCRIPTION DES FICHIERS "COOKIES" UTILISES PAR LE SITE

          L'éditeur du site attire l'attention de l'utilisateur sur le fait que les cookies suivants sont utilisés lors de sa navigation :

          Relou


          ARTICLE 12. PROPRIÉTÉ INTELLECTUELLE

          La structuration du site mais aussi les textes, graphiques, images, photographies, sons, vidéos et applications informatiques qui le composent sont la propriété de l'éditeur et sont protégés comme tels par les lois en vigueur au titre de la propriété intellectuelle.

          Toute représentation, reproduction, adaptation ou exploitation partielle ou totale des contenus, marques déposées et services proposés par le site, par quelque procédé que ce soit, sans l'autorisation préalable, expresse et écrite de l'éditeur, est strictement interdite et serait susceptible de constituer une contrefaçon au sens des articles L. 335-2 et suivants du Code de la propriété intellectuelle. Et ce, à l'exception des éléments expressément désignés comme libres de droits sur le site.

          L'accès au site ne vaut pas reconnaissance d'un droit et, de manière générale, ne confère aucun droit de propriété intellectuelle relatif à un élément du site, lesquels restent la propriété exclusive de l'éditeur.

          Il est interdit à l'utilisateur d'introduire des données sur le site qui modifieraient ou qui seraient susceptibles d'en modifier le contenu ou l'apparence.

          Le site Bitsky vous souhaite une excellente navigation !
          </ModalBody>
          <ModalFooter>
            <button className="secondary" onClick={this.handleSubmit}>Accepter</button>
          </ModalFooter>
        </Modal>
        <div className="single-form-container">
          <div className="single-form-subcontainer left">

          <div className="slogan register-title">
            <img src={logo_small} alt="logo"/>
            <h2>Inscription</h2>
          </div>

          <form method="post">
            <label>Adresse email<input id="email" type="email" placeholder="john.doe@bitsky.be"/></label>
            <label>Mot de passe<input id="password" type="password" placeholder="••••••••"/></label>
            <label>Répétez le mot de passe<input id="repeatPassword" type="password" placeholder="••••••••"/></label>
            <label>Nom<input id="lastname" type="text" placeholder="Doe"/></label>
            <label>Prénom<input id="firstname" type="text" placeholder="John"/></label>

            <div className="button-group">
              <button className="primary" onClick={this.toggleConfirm}><span>Inscription</span></button>
              <button className="secondary register-secondary" onClick={ () => this.props.history.push('/login') }>Déjà inscrit ?</button>
            </div>
          </form>
          </div>
          <div className="single-form-subcontainer right">
            <div className="overlay"></div>
            <div className="container">
              <nav>
                <ul>
                  <li><a href="">À propos</a></li>
                  <li><a href="">Support</a></li>
                  <li><a href="">Mises à jour</a></li>
                  <li><a href="">Documentation</a></li>
                </ul>
              </nav>
              <img src={logo} alt="logo"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

export default Register;
