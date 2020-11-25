alert("loaded sample JS...");

//try to get the player container kWidgetIframeContainer   mwEmbedKalturaIframe


$( ".kWidgetIframeContainer" ).append("<p>Hi, I'm new here</p>");


/*
mw.kalturaPluginWrapper(function(){


//(function (mw, $) {
    "use strict";
    mw.PluginManager.add('chaptersWidget', mw.KBasePlugin.extend({
        defaultConfig: {
            templatePath: 'https://longingforhome.github.io/kaltura/playerPlugins/chaptersWidget/chaptersWidget.tmpl.html',
            moduleWidth: '300',
            moduleHeight: '300',
            chaptersWidgetTargetId: 'chaptersWidget',
            containerPosition: 'bottom',
            onPage: false
        },

        getBaseConfig: function() {
            var parentConfig = this._super();
            return $.extend({}, parentConfig, {
                chaptersWidgetTargetId: null
            });
        },

        setup: function () {
            this.addBindings();
        },

        addBindings: function () {
            var _this = this;
            
            var chaptersWidgetHeight=null;
            
            var originalTMPLlHeight=null;
            
            var embedPlayer = this.embedPlayer;
            
            this.bind('layoutBuildDone', function () {
                var chaptersContainer =  _this.getChaptersWidget();
                originalTMPLlHeight = chaptersContainer.parent().height()+150;              
            });
            
            this.bind( 'onChangeMediaDone', function () {
                _this.destroy();
                _this.loadData();
            });          
            
            _this.loadData();

        },
        loadData : function(){
            var _this = this;
            _this.loadChaptersFromApi(function( chapters ){
                // Add chapter elements
                $.each(chapters, function(){
                    console.log('new chapter:' + chapters)
                });
            });
        },        

        loadChaptersFromApi: function( callback ){
            
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
        },
        handleDataError: function( data ){
			// check for errors; 
			if( !data || data.code ){
				this.$chaptersWidget.empty().append(
					this.getError( data )
				);
				return false;
			}
			return true;
		},
        
        
        destroy : function(){
            console.log('called for destroy');

        },
                
        // load the cahptersWidget template to the div with chaptersWidgetTargetId
        getChaptersWidget: function(){
            if (!this.$chaptersWidget) {
                // try to inject div into the player wrapper dom
                // for unfriendly iFrames, where we can't access window['parent'] we set on page to false
                if ( this.getConfig( 'onPage' ) ) {
                    try{
                        var parent = window['parent'].document;
                        mw.log("Transcript :: On page transcript - accessed parent ");
                    }catch(e){
                        this.setConfig('onPage', false);
                        mw.log("Chapters Widget :: cant access window['parent'] - setting to false");
                    }
                }
                if ( this.getConfig( 'onPage' ) ) {
                    try{
                        var iframeParent = $('#'+this.embedPlayer.id, window['parent'].document)[0];
                        this.$chaptersWidget = $(iframeParent).parents().find("#chaptersWidget");
                    }catch(e){
                        mw.log("failed to access window['parent'] for creating $chaptersWidget");
                    }
                }
                else{
                    // // wrap the .mwPlayerContainer element with our chaptersWidget div
                    var floatDirection = this.getConfig( 'containerPosition' ) ? this.getConfig( 'containerPosition' ) : "right";
                    var chaptersWidgetElement = "<div id=\"chaptersWidget\" style='position: relative; width: " + this.getConfig( 'moduleWidth' ) + "px; height: 100%; float:" + floatDirection + "'>";
                    //
                    $('.mwPlayerContainer').after(chaptersWidgetElement);
                    //
                    this.$chaptersWidget = $( "#chaptersWidget");

                    // $( ".videoHolder, .mwPlayerContainer" ).css( "width", $( ".videoHolder").width() - this.getConfig( 'moduleWidth' ) + "px" );
                    // $( ".mwPlayerContainer" ).css( "float", "left" );
                    $( ".videoHolder, .mwPlayerContainer" ).css( "width", "100%" );
                    $( ".videoHolder, .mwPlayerContainer" ).css( "height",$( ".mwPlayerContainer").height() - this.getConfig( 'moduleHeight' ) );
                    $( "#chaptersWidget" ).css( {height: this.getConfig( 'moduleHeight' ) , width:'100%'} );

                }
                this.$chaptersWidget.append(this.getHTML());
                this.originalPlayerWidth = $( ".videoHolder").width();
            }
            return this.$chaptersWidget;
        },

        getHTML : function(){
            var templatePath = this.getConfig( 'templatePath' );
            var rawHTML = window.kalturaIframePackageData.templates[ templatePath ];

            return rawHTML;
        },
    }));

//})(window.mw, window.jQuery, window.ko);

});
*/