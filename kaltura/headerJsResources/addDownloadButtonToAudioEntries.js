document.addEventListener("DOMContentLoaded", function() {
  console.log("headerJs customizations loaded...");
    if (window.location.href.indexOf("/media/") > -1) {
        checkAudioPlayer = setInterval(function () {
            let audioPlayer = document.querySelector("div.audio-player");
            if (audioPlayer !== null){
                console.log("found audio player. clearing interval");
                let downloadDiv = document.createElement('span');
                downloadDiv.classList.add("kms-ds-media-page-title-actions-button");
                downloadDiv.innerHTML = '<span class="kms-ds-media-page-title-actions-button"><button class="MuiButtonBase-root kaltura-ds-button kaltura-ds-button_variant-borderless kaltura-ds-button_color-secondary  kaltura-ds-button_size-medium  e1mkin350 __private__-button-root e18m4kr84 css-5t1uwe-__private__-button-root" tabindex="0" type="button" id="kms-ds-download-button" aria-haspopup="true" aria-controls="DownloadMenu" color="secondary"><span class="__private__-button-label css-z8uzku e18m4kr80"><span class="__private__-button-startIcon css-7nyv83 e18m4kr83"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium __private__-icon-root __private__-icon-root-Download24Icon e1k15kfr0 css-tm1n7o" focusable="false" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g fill-rule="nonzero"><path fill="currentColor" d="M20,14.5 C20.8284,14.5 21.5,15.1716 21.5,16 L21.5,20 C21.5,21.3807 20.3807,22.5 19,22.5 L5,22.5 C3.61929,22.5 2.5,21.3807 2.5,20 L2.5,16 C2.5,15.1716 3.17157,14.5 4,14.5 C4.82843,14.5 5.5,15.1716 5.5,16 L5.5,19.5 L18.5,19.5 L18.5,16 C18.5,15.1716 19.1716,14.5 20,14.5 Z M12,1.5 C12.8284,1.5 13.5,2.17157 13.5,3 L13.5,12.0355 L15.182,10.3535 C15.7678,9.76776 16.7175,9.76776 17.3033,10.3535 C17.8891,10.9393 17.8891,11.8891 17.3033,12.4749 L13.2374,16.5407 C12.554,17.2242 11.446,17.2242 10.7626,16.5407 L6.6967,12.4749 C6.11091,11.8891 6.11091,10.9393 6.6967,10.3535 C7.28249,9.76776 8.23223,9.76776 8.81802,10.3535 L10.5,12.0355 L10.5,3 C10.5,2.17157 11.1716,1.5 12,1.5 Z"></path></g></g></svg></span>Download</span></button></span>';
                
                let actionsMenu = document.querySelector("div.kms-ds-media-page-title-actions");
                actionsMenu.prepend(downloadDiv);

                let dlLink = lobbyProps.props.entry.downloadUrl + "?ks=" + lobbyProps.props.playerConfig.provider.ks;

                let downloadButton = document.querySelector("#kms-ds-download-button");
                downloadButton.addEventListener("click", function(){
                    console.log("download clicked");
                    const downloadLink = document.createElement('a');
                    downloadLink.href = dlLink;
                    downloadLink.download = downloadLink.href.split('/').pop();
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                });

            } else {
                console.log("no audio player loaded");
            }
            clearInterval(checkAudioPlayer); 
        }, 2000);
    }
});