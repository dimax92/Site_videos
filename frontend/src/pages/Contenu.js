import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Navigation from "../components/Navigation";

const Contenu = () => {
    const[nomFichier, setNomFichier] = useState();
    const[nom, setNom] = useState();
    const[description, setDescription] = useState();

    let { id } = useParams();

    function recevoirDonnees(id){
        axios.get("https://musicoll.com/backend/public/api/fichiers/"+id)
        .then((result)=>{
            setNomFichier(result.data.nomfichier);
            setNom(result.data.nom);
            setDescription(result.data.description);
        })
        .catch((error)=>{})
    }

    function minutesSecondes(resultatTemps){
        let temps=resultatTemps/60;
        let minutes=Math.trunc(temps);
        let secondes=Math.trunc((temps-minutes)*60);
        let affichageMinutes;
        let affichageSecondes;
        if(minutes<10){
            affichageMinutes="0"+minutes+":";
        }else{
            affichageMinutes=minutes+":";
        };
        if(secondes<10){
            affichageSecondes="0"+secondes;
        }else{
            affichageSecondes=secondes;
        };
        return affichageMinutes+affichageSecondes;
    };

    function gradientInputRange(inputRange){
        let valeurGradient=(inputRange.value/inputRange.max)*100;
        inputRange.style.background="linear-gradient(90deg, silver "+valeurGradient+"%, white 0%)";
    };

    useEffect(()=>{
        recevoirDonnees(id);

        let video=document.querySelector("video");
        let bouton=document.querySelector(".boutonPlay"); 
        let boutonGrandEcran=document.querySelector(".boutonGrandEcran");
        let boutonVolume=document.querySelector(".boutonVolume");
        let temps=document.querySelector(".temps"); 
        let inputRange=document.querySelector(".inputRange"); 
        let inputRangeVolume=document.querySelector(".inputRangeVolume"); 

        setTimeout(function() {
            inputRange.min=0;
            inputRange.max=Math.round(video.duration);
            temps.textContent=minutesSecondes(video.currentTime)+"/"+minutesSecondes(video.duration);
            inputRange.value=0;
        }, 2000);
        inputRange.step=1;

        function volumeVideo(){
            inputRangeVolume.step=0.1;
            inputRangeVolume.min=0;
            inputRangeVolume.max=1;
            gradientInputRange(inputRangeVolume);
        };
        
        volumeVideo();

    },[]);
    
    return (
        <div className="divContenu">
            <Navigation/>
            <h1>{nom}</h1>
            <div class='divVideo'>
                <video id='imageproduit' src={"https://musicoll.com/backend/storage/app/fichiers/"+nomFichier} onTimeUpdate={(e)=>{
                    let inputRange=document.querySelector(".inputRange");
                    let bouton=document.querySelector(".boutonPlay");  
                    let temps=document.querySelector(".temps"); 
                    inputRange.value=e.target.currentTime;
                    gradientInputRange(inputRange);
                    if(e.target.currentTime===e.target.duration){
                    e.target.currentTime=0;
                    bouton.className="fas fa-play";
                    };
                    temps.textContent=minutesSecondes(e.target.currentTime)+"/"+minutesSecondes(e.target.duration);
                }}></video>
                <div class='controles'>
                    <i class='boutonPlay fas fa-play' onClick={(e)=>{
                        let video = document.querySelector("video");
                        if(video.paused){
                            video.play();
                            e.target.className="boutonPlay fas fa-pause";
                        }else{
                            video.pause();
                            e.target.className="boutonPlay fas fa-play";
                        }
                    }}></i>
                    <div class="divVolume">
                        <i class="boutonVolume fas fa-volume-up" onClick={(e)=>{
                            let video = document.querySelector("video");
                            let inputRangeVolume=document.querySelector(".inputRangeVolume"); 
                            if(video.volume > 0){
                                video.volume=0;
                                e.target.className="boutonVolume fas fa-volume-mute";
                            }else{
                                video.volume=parseFloat(inputRangeVolume.value);
                                e.target.className="boutonVolume fas fa-volume-up";
                            }
                        }}></i>
                        <input class="inputRangeVolume" type="range" onInput={(e)=>{
                            let boutonVolume=document.querySelector(".boutonVolume");
                            let video=document.querySelector("video");
                            gradientInputRange(e.target);
                            if(boutonVolume.className==="boutonVolume fas fa-volume-up"){
                                video.volume=parseFloat(e.target.value);
                            }
                        }}/>
                        <div class="cacheVolume"></div>
                    </div>
                    <i class="boutonGrandEcran fas fa-expand" onClick={(e)=>{
                        let video=document.querySelector("video");
                        if (video.requestFullscreen) {
                            video.requestFullscreen();
                        }
                    }}></i>
                    <p class="temps"></p>
                    <input class='inputRange' id="inputrange" type='range' onInput={(e)=>{
                        let video=document.querySelector("video");
                        video.currentTime=e.target.value;
                        gradientInputRange(e.target);
                    }}/>
                </div>
            </div>
            <h2>Description</h2>
            <p>{description}</p>
            <button onClick={()=>{
                document.location.href="https://musicoll.com/backend/public/api/download/"+id;
            }}>Telecharger</button>
        </div>
    )
}

export default Contenu;