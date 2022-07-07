import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useCookies } from 'react-cookie';
const Navigation=()=>{
    const [cookies, setCookie, removeCookie] = useCookies();
    const[reponse, setReponse] = useState();

    function deconnexion(){
        axios.post("https://pautube.com/backend/public/api/logout",{
            data: {
                nom: "popo"
            }}, {
            headers: {
                "Authorization": "Bearer "+cookies.token
              }
        })
          .then(function (response) {
              setReponse(<p className="messageValidation">Deconnexion reussi</p>);
              document.location.href='https://pautube.com/';
          })
          .catch(function (error) {
            setReponse(<p className="messageErreur">Echec deconnexion</p>)
          });
    }

    const[navigation, setNavigation]= useState(
        <div className="nav">
            <NavLink className="navigation" activeClassName="nav-active" exact to="/Login">
                Connexion
            </NavLink>
            <NavLink className="navigation" activeClassName="nav-active" exact to="/Inscription">
                Inscription
            </NavLink>
            <NavLink className="navigation" activeClassName="nav-active" exact to="/Recherche">
                Recherche
            </NavLink>
        </div>
    );

    function testConnexion(){
        axios.get("https://pautube.com/backend/public/api/profile", {
            headers: {
                'Authorization': "Bearer "+cookies.token
              }
        })
          .then(function (response) {
            setNavigation(
                <div className="nav">
                    <NavLink className="navigation" activeClassName="nav-active" exact to="/Formulaire">
                        Mettre en ligne une video
                    </NavLink>
                    <NavLink className="navigation" activeClassName="nav-active" exact to="/MesFichiers">
                        Mes videos
                    </NavLink>
                    <NavLink className="navigation" activeClassName="nav-active" exact to="/Profil">
                        Profil
                    </NavLink>
                    <NavLink className="navigation" activeClassName="nav-active" exact to="/Recherche">
                        Recherche
                    </NavLink>
                    <button 
                    onClick={(e)=>{
                        deconnexion();
                    }}
                    >Deconnexion</button>
                </div>
                  )
          })
          .catch(function (error) {
          });
    }

    useEffect(()=>{
        testConnexion();
       },[]);
    
    return (
        <div className="navigationSup">
            {navigation}
            {reponse}
        </div>
    );
};
export default Navigation;