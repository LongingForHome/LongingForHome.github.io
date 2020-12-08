console.log("player external JS loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'chaptersWidget', mw.KBaseComponent.extend({
		defaultConfig: {
			parent: "controlsContainer",    // the container for the button 
			order: 41,                      // the display order ( based on layout )
			displayImportance: 'low',       // the display importance, determines when the item is removed from DOM
			align: "right",                 // the alignment of the button

			cssClass: "kaltura-logo",       // the css name of the logo
			href: 'http://www.kaltura.com', // the link for the logo
			title: 'Kaltura',               // title
			img: null                       // image
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
                'filter:cuePointTypeEqual':	'annotation.Annotation',
				'filter:tagsLike' : this.getConfig('tags') || 'chaptering'
            }, function( data ) {
                // if an error pop out:
				if( ! _this.handleDataError( data ) ){
					return ;
				}
				console.log(data.objects);
				//_this.setCuePoints( data.objects );
				//callback();
            });
        }
	}));

});