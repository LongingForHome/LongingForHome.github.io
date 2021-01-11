// this is a simple player plugin that will check if an entry is a YouTube entry, and force hide any Kaltura captions as to prevent caption overlap scenarios.
// the user is still able to manually choose CC for Kaltura captions if the YouTube stream is not injecting any captions
//console.log("player external JS loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'ytCaptions', mw.KBaseComponent.extend({
		defaultConfig: {
		},
		setup: function(){
		       // The place to set any of your player bindings like:
		      this.bind( 'playerReady', function(){
		              // do something on player ready
		       });
		       //console.log("player setup called...");  
		       // try to get any chapters associated with the entry
		       this.getBaseEntry();
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
				// if there are no chapters, then don't load the container
				if (data.externalSourceType == "YouTube") {
					console.log("YouTube entry.  Force hiding Kaltura captions.");
					this.sendNotification( 'hideClosedCaptions' );
				}
				else {
					console.log("Kaltura entry.  ytCaptions abort.");
				}				
            });
        }
	}));
});