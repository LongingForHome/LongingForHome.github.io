// this is a simple player plugin that will present a file download link for H5P insertion
console.log("chaptersDisplayOptions.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'chaptersDisplayOptions', mw.KBaseComponent.extend({
		defaultConfig: {
			initialDisplay: "expanded"			
		},
		setup: function(){
			var _this = this;
		    // The place to set any of your player bindings like:
		    this.bind( 'playerReady', function(){
		        // do something additional on player ready
		        $ ("div.sideBarContainer").addClass("openBtn");
		    });	
		}
	}));
});
 