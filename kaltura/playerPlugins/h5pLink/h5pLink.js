// this is a simple player plugin that will present a file download link for H5P insertion
console.log("h5pLink.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'h5pLink', mw.KBaseComponent.extend({
		defaultConfig: {
			buttonIcon: "https://longingforhome.github.io/kaltura/playerPlugins/h5pLink/h5p_logo.png",
			downloadLink: ""
		},
		setup: function(){
			var _this = this;
		    // The place to set any of your player bindings like:
		    this.bind( 'playerReady', function(){
		        // do something additional on player ready
		        _this.getBaseEntry();
		    });	
		    _this.constructButton();
		},
		getBaseEntry: function( callback ){
            //console.log("Getting entry info...");            
            if(!this.getPlayer().kentryid){
                this.log('getBaseEntry:: Entry Id not found, exit.');
                callback([]);
                return;            
            }
            // use the Kaltura Client to get the entry information
            var _this = this;
            this.getKalturaClient().doRequest( {
                'service' : 'baseEntry',
                'action' : 'get',
                'entryId' : this.getPlayer().kentryid                		
            }, function( data ) {                
				alert("Use this link in H5P: " + data.downloadUrl);	
				_this.setConfig('downloadLink', data.downloadUrl);			
            });
        },
        constructButton: function() {
        	var _this = this;
        	// get the container to insert the button into
        	$ (" .topBarContainer").append("<button class=\"btn pull-right\" ><img src=\"" + _this.getConfig('downloadLink') + "\"></button>");
        }
	}));
});











//.topBarContainer.hover.open

