import React, {useState, useEffect} from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import Navigation from "../components/Navigation";

const Formulaire = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const[reponse,setReponse] = useState();
    const[reponseNom,setReponseNom] = useState();
    const[reponseDonneesFichier,setReponseDonneesFichier] = useState();
    const[reponseDescription,setReponseDescription] = useState();

    function creationDonneesFichier(id){
        let donneesFichier = document.querySelector(".fichier").files[0];
        let fichier = document.querySelector(".fichier").value;
        let nom = document.querySelector(".nom").value;
        let description = document.querySelector(".description").value;

        const data = new FormData();
        data.append('user_id', id);
        data.append('donneesFichier', donneesFichier);
        data.append('fichier', fichier);
        data.append('description', description);
        data.append('nom', nom);

        return data;
    }

    function messageValidation(){
      setReponse(<p className="messageValidation">Creation fichier reussi</p>)
      setReponseNom();
      setReponseDonneesFichier();
      setReponseDescription();
    }

    function messageErreur(error){
      setReponse(<p className="messageErreur">Echec creation fichier</p>)
      if(error.response.data.nom){
          setReponseNom(<p className="messageErreurInput">{error.response.data.nom}</p>)
      }else{
          setReponseNom()
      }if(error.response.data.donneesFichier){
        setReponseDonneesFichier(<p className="messageErreurInput">{error.response.data.donneesFichier}</p>)
      }else{
        setReponseDonneesFichier()
      }if(error.response.data.description){
        setReponseDescription(<p className="messageErreurInput">{error.response.data.description}</p>)
      }else{
        setReponseDescription()
      }
    }

    function envoiDonnees(){
        axios.get("https://musicoll.com/backend/public/api/profile", {
            headers: {
                'Authorization': "Bearer "+cookies.token
              }
        })
          .then(function (response) {
            axios.post("https://musicoll.com/backend/public/api/creationfichiers/"+response.data, creationDonneesFichier(response.data), {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': "Bearer "+cookies.token
                }
            })
              .then(function (response) {
                messageValidation();
              })
              .catch(function (error) {
                messageErreur(error);
              });
          })
          .catch(function (error) {
          });
    }

    return (
        <div className="divFormulaire">
        <Navigation/>
        {reponse}
        <form>
            <label className="labelFichier" for="fichier">Choisir un fichier</label>
            {reponseDonneesFichier}
            <input type="file" id="fichier" name="fichier" className="fichier"></input>
            <label for="nom">Nom</label>
            {reponseNom}
            <input name="nom" className="nom"></input>
            <label for="description">Description</label>
            {reponseDescription}
            <textarea name="description" className="description"></textarea>
            <button class="envoyer" onClick={event =>{event.preventDefault(); envoiDonnees()}}>Mettre en ligne</button>
        </form>
        </div>
    )
}

export default Formulaire;