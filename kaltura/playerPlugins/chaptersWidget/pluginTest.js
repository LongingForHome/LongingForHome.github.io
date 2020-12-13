console.log("player external JS loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'chaptersWidget', mw.KBaseComponent.extend({
		defaultConfig: {
			templatePath: 'https://longingforhome.github.io/kaltura/playerPlugins/chaptersWidget/chaptersWidget.tmpl.html',
            moduleWidth: '300',
            moduleHeight: '200',
            chaptersWidgetTargetId: 'chaptersWidget',
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
            //this.sendNotification('doPlay',100);
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
                'filter:cuePointTypeEqual':	'thumbCuePoint.Thumb',	
                'filter:orderBy': '+startTime'			
            }, function( data ) {
                
				console.log(data.objects);
				console.log(JSON.stringify(data.objects));
				if (data.totalCount > 0) {
					console.log("adding chapters container...");
		       		_this.getChaptersWidgetContainer();
		       		console.log("adding chapters to widget...");
		       		$('.chaptersInterface').append('<div id="chaptersList"></div>');
					$.each(data.objects, function (index, chapter) {
						console.log(chapter.title);
						$('#chaptersList').append(' ', $('<button>').attr('timestamp', chapter.startTime).prop('value', chapter.title).on('click', function(e) {_this.getPlayer().sendNotification("doSeek", Math.floor((chapter.startTime)/1000));}));
					});					
				}				
            });
        },
        getChaptersWidgetContainer: function() {
        	// // wrap the .mwPlayerContainer element with our transcriptInterface div
            var floatDirection = this.getConfig( 'containerPosition' ) ? this.getConfig( 'containerPosition' ) : "bottom";
            var chaptersInterfaceElements = "<div class='chaptersInterface' style='position: relative; width: " + this.getConfig( 'moduleWidth' ) + "px; height: 100%; float:" + floatDirection + "'>";
            //
            $('.mwPlayerContainer').after(chaptersInterfaceElements);
            this.$chaptersContainer = $( ".chaptersInterface");
            $( ".videoHolder, .mwPlayerContainer" ).css( "width", "100%" );
            $( ".videoHolder, .mwPlayerContainer" ).css( "height",$( ".mwPlayerContainer").height() - this.getConfig( 'moduleHeight' ) );
            $( ".chaptersInterface" ).css( {height: this.getConfig( 'moduleHeight' ) , width:'100%'} );

            this.$chaptersContainer.append(this.getHTML());
            this.originalPlayerWidth = $( ".videoHolder").width();

            return this.$chaptersContainer;
        },
        getHTML : function(){
            var templatePath = this.getConfig( 'templatePath' );
            var rawHTML = window.kalturaIframePackageData.templates[ templatePath ];

            return rawHTML;
        }
	}));

});