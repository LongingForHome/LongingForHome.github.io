// this is a simple player plugin that add a button to toggle the visibility of the video
console.log("toggleVideoVisibility.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'toggleVideoVisibility', mw.KBaseComponent.extend({
		defaultConfig: {
			visibleIcon: "https://longingforhome.github.io/kaltura/playerPlugins/toggleVideoVisibility/visible_white_30x30.png",
			hiddenIcon: "https://longingforhome.github.io/kaltura/playerPlugins/toggleVideoVisibility/hidden_white_30x30.png",
			toggleStatus: "visible"			
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
            var iconUrl = this.getConfig("visibleIcon"); 
            // append the button to the div
            $ (".controlBarContainer").append(' ', $("<button title=\"Toggle video\" class=\"btn pull-right display-high\" aria-label=\"Toggle video\" data-show-tooltip=\"true\" data-order=\"51\" data-plugin-name=\"toggleVideoVisibility\" tabindex=\"10\" style=\"text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8) !important\"><img id=\"toggleVisibleButtonImg\" src=\""+iconUrl+"\"\></button>").on('click', toggleVideoVisibility()));            
        },
        toggleVideoVisibility: function() {
        	console.log("toggle requested...");
        	if (this.getConfig("toggleStatus") == "visible") {
        		console.log("video is visible.  hiding video...");
        		// hide the video
        		$ (".videoDisplay").hide();
        		// set the icon to hidden
        		$ ("#toggleVisibleButtonImg").attr("src",this.getConfig("hiddenIcon"));
        		// change the status
        		this.setConfig("toggleStatus", "hidden");
        	}else {
        		console.log("video is hidden.  showing video...");
        		// show the video
        		$ (".videoDisplay").show();
        		//set the icon to visible
        		$ ("#toggleVisibleButtonImg").attr("src",this.getConfig("visibleIcon"));
        		// change the status
        		this.setConfig("toggleStatus", "visible");
        	}
        }
	}));
}); 
