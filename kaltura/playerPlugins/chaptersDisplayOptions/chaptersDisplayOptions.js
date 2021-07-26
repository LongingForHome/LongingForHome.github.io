// this is a simple player plugin that will change how the chapters plugin is displayed
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
		        $ ("a.sideBarContainerReminderContainer").focus().trigger('click');
		    });	
		}
	}));
});
 