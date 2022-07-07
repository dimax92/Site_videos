function minutesSecondes(resultatTemps){
    let temps=resultatTemps/60;
    let minutes=Math.trunc(temps);
    let secondes=Math.trunc((temps-minutes)*60);
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
    inputRange.style.background="linear-gradient(90deg, #03a9f4 "+valeurGradient+"%, white 0%)";
};

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
    inputRange.addEventListener("input", ()=>{
        video.currentTime=inputRange.value;
        gradientInputRange(inputRange);
    });
    
    function playPauseVideo(boutonControle){
        boutonControle.addEventListener("click",()=>{
            if(video.paused){
                video.play();
                bouton.className="boutonPlay fas fa-pause";
            }else{
                video.pause();
                bouton.className="boutonPlay fas fa-play";
            }
        });
    };
    
    playPauseVideo(bouton);
    playPauseVideo(video);
    
    function grandEcran(){
        boutonGrandEcran.addEventListener("click",()=>{
            if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        })
    };
    
    grandEcran();
    
    function volumeVideo(){
        inputRangeVolume.step=0.1;
        inputRangeVolume.min=0;
        inputRangeVolume.max=1;
        gradientInputRange(inputRangeVolume);
        inputRangeVolume.addEventListener("input", ()=>{
            gradientInputRange(inputRangeVolume);
            if(boutonVolume.className==="boutonVolume fas fa-volume-up"){
                video.volume=parseFloat(inputRangeVolume.value);
            }
        });
        boutonVolume.addEventListener("click",()=>{
            if(video.volume > 0){
                video.volume=0;
                boutonVolume.className="boutonVolume fas fa-volume-mute";
            }else{
                video.volume=parseFloat(inputRangeVolume.value);
                boutonVolume.className="boutonVolume fas fa-volume-up";
            }
        });
    };
    
    volumeVideo();
    
    video.addEventListener('timeupdate',()=>{
        inputRange.value=video.currentTime;
        gradientInputRange(inputRange);
        if(video.currentTime===video.duration){
        video.currentTime=0;
        bouton.className="fas fa-play";
        };
        temps.textContent=minutesSecondes(video.currentTime)+"/"+minutesSecondes(video.duration);
    });