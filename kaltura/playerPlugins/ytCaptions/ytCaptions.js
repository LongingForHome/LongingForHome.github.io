// this is a simple player plugin that will check if an entry is a YouTube entry, and force hide any Kaltura captions as to prevent caption overlap scenarios.
// the user is still able to manually choose CC for Kaltura captions if the YouTube stream is not injecting any captions
//console.log("ytCaptions.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'ytCaptions', mw.KBaseComponent.extend({
		defaultConfig: {
		},
		setup: function(){
			var _this = this;
		    // The place to set any of your player bindings like:
		    this.bind( 'playerReady', function(){
		        // do something additional on player ready
		        _this.getBaseEntry();
		    });
		    this.bind( 'closedCaptionsHidden', function (){
		    	console.log("captions hidden");
		    });
		    //console.log("player setup called...");  
		    // try to get any chapters associated with the entry
		    //this.getBaseEntry();
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
					console.log("YouTube entry.  Force hiding Kaltura captions.");
					_this.getPlayer().sendNotification( 'hideClosedCaptions' );
				}
				else {
					// do nothing
					console.log("Kaltura entry.  ytCaptions abort.");
				}				
            });
        }
	}));
});