// this is a simple player plugin that will check if an entry is a YouTube entry, and force hide any Kaltura captions as to prevent caption overlap scenarios.
// the user is still able to manually choose CC for Kaltura captions if the YouTube stream is not injecting any captions
//console.log("ytCaptions.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'ytCaptions', mw.KBaseComponent.extend({
		defaultConfig: {
			firstPlay: true,
			youTubeEntry: true
		},
		setup: function(){
			var _this = this;
		    // The place to set any of your player bindings like:
		    this.bind( 'playerReady', function(){
		        // do something additional on player ready
		        _this.getBaseEntry();
		    });
		    this.bind( 'changedClosedCaptions', function () {
		    	console.log("captions setting changed");
		    });
		    this.bind( 'userInitiatedPlay', function () {
		    	console.log("userInitiatedPlay event triggered");
		    	console.log("firstPlay is " + this.getConfig('firstPlay'));
		    	console.log("youTube status is " + this.getConfig('youTubeEntry'));
		    	if ((this.getConfig('firstPlay') == true) && (this.getConfig('youTubeEntry') == true)){
		    		console.log("First play of YouTube entry.  Force hiding Kaltura captions.");
		    		// Set the captions to off
		    		this.getPlayer().triggerHelper("selectClosedCaptions", "Off");
					this.getPlayer().triggerHelper('changedClosedCaptions', {language: ""});
					// and change config so that a user caption selection will not be reverted for future play events
					this.setConfig('firstPlay', false);
		    	}
		    });
		    //console.log("player setup called...");
		},
		getBaseEntry: function( callback ){
            //console.log("Getting entry info...");            
            if(!this.getPlayer().kentryid){
                this.log('getBaseEntry:: Entry Id not found, exit.');
                callback([]);
                return;            
            }
            // use the Kaltura Client to make the request for chapters
            var _this = this;
            this.getKalturaClient().doRequest( {
                'service' : 'baseEntry',
                'action' : 'get',
                'entryId' : this.getPlayer().kentryid                		
            }, function( data ) {                
				//console.log(JSON.stringify(data));
				// check if the entry is a YouTube entry and override Kaltura captions if so
				if (data.externalSourceType == "YouTube") {
					console.log("YouTube entry.  Setting config.");
					_this.setConfig('youTubeEntry', true);
				}
				else {
					_this.setConfig('youTubeEntry', false);
					// do nothing
					console.log("Kaltura entry.  ytCaptions abort.");
				}				
            });
        }
	}));
});