//console.log("player external JS loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'chaptersWidget', mw.KBaseComponent.extend({
		defaultConfig: {
			templatePath: 'https://longingforhome.github.io/kaltura/playerPlugins/chaptersWidget/chaptersWidget.tmpl.html',
            moduleWidth: '300',
            moduleHeight: '300',
            chaptersWidgetTargetId: 'chaptersWidget',
            containerPosition: 'bottom'
		},
		setup: function(){
		       // The place to set any of your player bindings like:
		      this.bind( 'playerReady', function(){
		              // do something on player ready
		       });
		       //console.log("player setup called...");  
		       // try to get any chapters associated with the entry
		       this.loadChaptersFromApi();
		},
		loadChaptersFromApi: function( callback ){
            //console.log("Getting chapters...");
            //this.sendNotification('doPlay',100);
            if(!this.getPlayer().kentryid){
                this.log('loadChaptersFromApi:: Entry Id not found, exit.');
                callback([]);
                return;            
            }
            // use the Kaltura Client to make the request for chapters
            var _this = this;
            this.getKalturaClient().doRequest( {
                'service' : 'cuepoint_cuepoint',
                'action' : 'list',
                'filter:objectType' : 'KalturaCuePointFilter',
                'filter:entryIdEqual' : this.getPlayer().kentryid,
                'filter:cuePointTypeEqual':	'thumbCuePoint.Thumb',	
                'filter:orderBy': '+startTime'			
            }, function( data ) {                
				//console.log(JSON.stringify(data.objects));
				// if there are no chapters, then don't load the container
				if (data.totalCount > 0) {
					console.log("Found " + data.totalCount + " chapters to add to container.");
		       		_this.getChaptersWidgetContainer();
		       		// loop through each chapter and build the list item
					$.each(data.objects, function (index, chapter) {
						//console.log(chapter.title);
						var seconds = Math.floor((chapter.startTime)/1000);
						var timestamp = new Date(seconds * 1000).toISOString().substr(11, 8);
						//$('#chaptersList').append(' ', $('<button>').addClass('chapterButtons').attr('timestamp', chapter.startTime).html(chapter.title).on('click', function(e) {_this.getPlayer().sendNotification("doSeek", Math.floor((chapter.startTime)/1000));}));
						//$('#chaptersList').append('<div id="' + seconds + '" class="chapterLink"><div class="chapterItem chapterTime"><span>' + timestamp + '</span></div><div class="chapterItem chapterTitle">' + chapter.title + '</div></div>').on('click', function(e) {_this.getPlayer().sendNotification("doSeek", seconds);});
						$('#chaptersList').append(' ', $('<div id="' + seconds + '" class="chapterLink"><div class="chapterItem chapterTime"><span>' + timestamp + '</span></div><div class="chapterItem chapterTitle">' + chapter.title + '</div></div>').on('click', function(e) {_this.getPlayer().sendNotification("doSeek", seconds);}));
					});					
				}
				else {
					//@todo: this reset below is not working properly
					// remove the added height needed for the chapters widget
					var resetHeight = $( ".mwPlayerContainer").height() - _this.getConfig( 'moduleHeight' );
					console.log("No chapters available.  Resetting player height to " + resetHeight);
					$( ".mwPlayerContainer" ).css( "height", resetHeight );
					// hack to force page redraw of the new element height
					$( ".mwPlayerContainer" ).hide().show();
				}				
            });
        },
        getChaptersWidgetContainer: function() {
        	// // wrap the .mwPlayerContainer element with our transcriptInterface div
            var floatDirection = this.getConfig( 'containerPosition' ) ? this.getConfig( 'containerPosition' ) : "bottom";
            var chaptersInterfaceElements = "<div class='chaptersInterface' style='position: relative; width: " + this.getConfig( 'moduleWidth' ) + "px; height: 100%; float:" + floatDirection + "'>";
            //
            $('.mwPlayerContainer').after(chaptersInterfaceElements);
            //this.$chaptersContainer = $( ".chaptersInterface");
            $( ".videoHolder, .mwPlayerContainer" ).css( "width", "100%" );
            $( ".videoHolder, .mwPlayerContainer" ).css( "height",$( ".mwPlayerContainer").height() - this.getConfig( 'moduleHeight' ) );
            $( ".chaptersInterface" ).css( {height: this.getConfig( 'moduleHeight' ) , width:'100%'} );
            //console.log("template: " + this.getHTML() + " ...");
            $( ".chaptersInterface" ).append(this.getHTML()); 
            
        },
        getHTML : function(){
        	//console.log("getting template html...");
        	var templatePath = this.getConfig( 'templatePath' );
        	var template;

		    $.ajax({
		        type: "GET",
		        url: templatePath,
		        async: false,
		        success : function(data) {
		            template = data;
		        }
		    });
		    //console.log("template: " + template + " ...");
		    return template;        	           
        }
	}));

});