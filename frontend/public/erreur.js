function mauvaisNomDeDomaine(){
    if(location.host !== "pautube.com" && location.host !== "www.pautube.com"){
        document.querySelector("html").remove();
    }
};
mauvaisNomDeDomaine();

function mauvaisProtocol(){
    if(location.protocol !== "https:"){
        location.protocol="https:";
    }
};
mauvaisProtocol();