console.log("player external JS loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'chaptersWidget', mw.KBaseComponent.extend({
		defaultConfig: {
			templatePath: 'transcript/templates/transcript.tmpl.html',
            moduleWidth: '300',
            moduleHeight: '250',
            transcriptTargetId: 'transcriptHolder',
            containerPosition: 'bottom'
		},
		setup: function(){
		       // The place to set any of your player bindings like:
		      this.bind( 'playerReady', function(){
		              // do something on player ready
		       });
		       console.log("player setup called...");
		       this.loadChaptersFromApi();
		},
		loadChaptersFromApi: function( callback ){
            console.log("Getting chapters...");
            if(!this.getPlayer().kentryid){
                this.log('loadChaptersFromApi:: Entry Id not found, exit.');
                callback([]);
                return;            
            }
            var _this = this;
            this.getKalturaClient().doRequest( {
                'service' : 'cuepoint_cuepoint',
                'action' : 'list',
                'filter:objectType' : 'KalturaCuePointFilter',
                'filter:entryIdEqual' : this.getPlayer().kentryid,
                'filter:cuePointTypeEqual':	'thumbCuePoint.Thumb'				
            }, function( data ) {
                
				console.log(data.objects);
				console.log(JSON.stringify(data.objects));
				//_this.setCuePoints( data.objects );
				//callback();
            });
        }
	}));

});