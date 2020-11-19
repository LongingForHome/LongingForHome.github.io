kWidget.addReadyCallback(playerId => {
  let kdp = document.getElementById(playerId);
  kdp.kBind("playerReady", function() {
    console.log("Kaltura player is ready");
  });
});