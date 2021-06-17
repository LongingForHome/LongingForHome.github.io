// this is a simple player plugin that will present a file download link for H5P insertion
console.log("h5pLink.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'h5pLink', mw.KBaseComponent.extend({
		defaultConfig: {
			buttonIcon: ""
		},
		setup: function(){
			var _this = this;
		    // The place to set any of your player bindings like:
		    this.bind( 'playerReady', function(){
		        // do something additional on player ready
		        _this.getBaseEntry();
		    });	
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
            });
        }
	}));
});











//.topBarContainer.hover.open

