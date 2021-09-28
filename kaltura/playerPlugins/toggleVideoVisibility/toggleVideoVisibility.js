// this is a simple player plugin that add a button to toggle the visibility of the video
console.log("toggleVideoVisibility.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'toggleVideoVisibility', mw.KBaseComponent.extend({
		defaultConfig: {
			visibleIcon: "https://longingforhome.github.io/kaltura/playerPlugins/toggleVideoVisibility/visible_white_30x30.png",
			hiddenIcon: "https://longingforhome.github.io/kaltura/playerPlugins/toggleVideoVisibility/hidden_white_30x30.png"			
		},
		setup: function(){
			var _this = this;
		    // The place to set any of your player bindings like:
		    this.bind( 'playerReady', function(){
		        // when the player is loaded, then append the toggle functionality
		        _this.constructToggle();
		    });	
		},
		constructToggle: function(){
            console.log("constructToggle called..."); 
            // get the initial visible icon url
            var visibleIcon = this.getConfig("visibleIcon"); 
            var hiddenIcon = this.getConfig("hiddenIcon");
            // append the button            
            $ (".controlsContainer").append(' ', $("<button title=\"Toggle video\" class=\"btn pull-right display-high\" aria-label=\"Toggle video\" data-show-tooltip=\"true\" data-order=\"51\" data-plugin-name=\"toggleVideoVisibility\" tabindex=\"10\" style=\"text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8) !important\"><img id=\"toggleVisibleButtonImg\" src=\""+iconUrl+"\"\></button>").on('click', function(e) {if($ ("#toggleVisibleButtonImg").attr("src")==visibleIcon){$ (".videoDisplay").hide();$ ("#toggleVisibleButtonImg").attr("src",hiddenIcon);}else{$ (".videoDisplay").show();$ ("#toggleVisibleButtonImg").attr("src",visibleIcon);}}));           
        }
	}));
}); 
