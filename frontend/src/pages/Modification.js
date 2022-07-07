import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Navigation from "../components/Navigation";
import { useCookies } from 'react-cookie';

const Modification = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const[nom, setNom] = useState();
    const[description, setDescription] = useState([]);
    const[identifiant, setIdentifiant] = useState();

    const[reponse,setReponse] = useState();
    const[reponseDescription,setReponseDescription] = useState();
    const[reponseDonneesFichier,setReponseDonneesFichier] = useState();
    const[reponseNom,setReponseNom] = useState();

    let { id } = useParams();

    function recevoirDonnees(id){
        axios.get("https://musicoll.com/backend/public/api/fichiers/"+id)
        .then((result)=>{
            setNom(result.data.nom);
            setDescription(result.data.description);
        })
        .catch((error)=>{})
    }

    useEffect(()=>{
        recevoirDonnees(id);
    },[]);

    function messageValidation(){
        setReponse(<p className="messageValidation">Modification fichier reussi</p>)
        setReponseNom();
        setReponseDonneesFichier();
        setReponseDescription();
    }
  
    function messageErreur(error){
        setReponse(<p className="messageErreur">Echec modification fichier</p>)
        if(error.response.data.donneesFichier){
          setReponseDonneesFichier(<p className="messageErreurInput">{error.response.data.donneesFichier}</p>)
        }else{
          setReponseDonneesFichier()
        }if(error.response.data.description){
          setReponseDescription(<p className="messageErreurInput">{error.response.data.description}</p>)
        }else{
          setReponseDescription()
        }if(error.response.data.nom){
          setReponseNom(<p className="messageErreurInput">{error.response.data.nom}</p>)
        }else{
          setReponseNom()
        }
    }

    function creationDonnees(id){
        let donneesFichier = document.querySelector(".fichier").files[0];
        let fichier = document.querySelector(".fichier").value;
        let description = document.querySelector(".description").value;
        let nom = document.querySelector(".nom").value;

        const data = new FormData();
        data.append('user_id', id);
        data.append('donneesFichier', donneesFichier);
        data.append('fichier', fichier);
        data.append('description', description);
        data.append('nom', nom);

        return data;
    }

    function envoiDonneesModification(id){
        axios.get("https://musicoll.com/backend/public/api/profile", {
            headers: {
                'Authorization': "Bearer "+cookies.token
              }
        })
        .then(function (response) {
            axios.post("https://musicoll.com/backend/public/api/update/"+id, creationDonnees(response.data), {
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
        <div className="divModification">
            <Navigation/>
            {reponse}
            <form>
            <label className="labelFichier" for="fichier">Choisir un fichier</label>
            {reponseDonneesFichier}
            <input type="file" id="fichier" name="fichier" className="fichier"></input>
            <label for="nom">Nom</label>
            {reponseNom}
            <input name="nom" className="nom" defaultValue={nom}></input>
            <label for="description">Description</label>
            {reponseDescription}
            <textarea name="description" className="description" defaultValue={description}></textarea>
            <button className="modifier" onClick={event =>{event.preventDefault(); envoiDonneesModification(id)}}>Modifier</button>
        </form>
        </div>
    )
}

export default Modification;