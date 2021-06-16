// this is a simple player plugin that will check if an entry is a YouTube entry, and force hide the Youtube captions and related videos overlays.
console.log("youtubeDisplayOptions.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'youtubeDisplayOptions', mw.KBaseComponent.extend({
		defaultConfig: {
			youTubeEntry: false,
			showCaptions: false,
			showRelatedVideos: false,
			showAddedInfo: false
		},
		setup: function(){
			var _this = this;
		    // The place to set any of your player bindings like:
		    this.bind( 'playerReady', function(){
		        // do something additional on player ready
		        _this.getBaseEntry();
		    });
		    this.bind( 'userInitiatedPlay', function () {
		    	console.log("userInitiatedPlay event triggered");
		    	console.log("youTube status is " + _this.getConfig('youTubeEntry'));
		    	if ((_this.getConfig('youTubeEntry') == true) {
		    		if ((_this.getConfig('showCaptions') == false) {
			    		// remove the ytp-caption-window-container class
			    		$( ".ytp-caption-window-container" ).remove();
			    	}
			    	if ((_this.getConfig('showRelatedVideos') == false) {
			    		// remove the ytp-pause-overlay class
			    		$( ".ytp-pause-overlay" ).remove();
			    	}
			    	if ((_this.getConfig('showAddedInfo') == false) {
			    		// remove the ytp-chrome-top-buttons class
			    		$( ".ytp-chrome-top-buttons" ).remove();
			    	}
		    	}
		    	

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
				//console.log(JSON.stringify(data));
				// check if the entry is a YouTube entry
				if (data.externalSourceType == "YouTube") {
					console.log("YouTube entry.  Setting config.");
					_this.setConfig('youTubeEntry', true);
				}
				else {
					_this.setConfig('youTubeEntry', false);
					// do nothing
					console.log("Kaltura entry.  youtubeDisplayOptions abort.");
				}				
            });
        }
	}));
});