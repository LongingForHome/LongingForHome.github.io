// this is a simple player plugin that will present a file download link for H5P insertion
console.log("h5pLink.js loaded...");
mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'h5pLink', mw.KBaseComponent.extend({
		defaultConfig: {
			buttonIcon: "https://longingforhome.github.io/kaltura/playerPlugins/h5pLink/h5p_logo.png",
			downloadLink: ""
		},
		setup: function(){
			var _this = this;
		    // The place to set any of your player bindings like:
		    this.bind( 'playerReady', function(){
		        // do something additional on player ready
		        _this.getBaseEntry();
		        //_this.constructButton();
		    });	
		},
		getBaseEntry: function( callback ){
            //console.log("Getting entry info...");            
            if(!this.getPlayer().kentryid){
                this.log('getBaseEntry:: Entry Id not found, exit.');
                callback([]);
                return;            
            }
            // use the Kaltura Client to get the entry information
            var _this = this;
            this.getKalturaClient().doRequest( {
                'service' : 'baseEntry',
                'action' : 'get',
                'entryId' : this.getPlayer().kentryid                		
            }, function( data ) {                
				//alert("Use this link in H5P: " + data.downloadUrl);	
				_this.setConfig('downloadLink', data.downloadUrl);
				// construct the button once we have the needed data
				_this.constructButton();			
            });
        },
        constructButton: function() {
        	console.log("constructButton called");
        	var _this = this;
        	// get the container to insert the button into
        	//console.log(_this.getConfig('downloadLink')); 
        	$ (".topBarContainer").append(' ', $("<button class=\"btn pull-right\" data-order=\"100\"><img src=\"https://longingforhome.github.io/kaltura/playerPlugins/h5pLink/h5p_logo.png\"></button>").on('click', function(e) {$('#h5pModal').show();var copyLink = document.getElementById("h5pLink");copyLink.select(); document.execCommand("copy")}));
        	// and build the h5p modal screen
        	$ (" .videoHolder").append('', $("<div id=\"h5pModal\"class=\"screen infoScreen semiTransparentBkg\" role=\"dialog\" aria-labelledby=\"dialogTitle\" style=\"display: none;\"><div id=\"h5pModalScreen\" class=\"screen-content\">"));
        	$ (" #h5pModalScreen").append('', $("<span id=\"h5pModalClose\" class=\"icon-close\" aria-label=\"Close screen\" tabindex=\"0\" role=\"button\">").on('click', function(f) {$('#h5pModal').hide();}));
        	$ (" #h5pModalScreen").append('', $("</span><span class=\"tmpl\"><div class=\"infoScreenPanel\"><div class=\"title\" aria-label=\"Content link for H5P\" tabindex=\"0\"><p>Content link for H5P</p><textarea id=\"h5pLink\" readonly style=\"width: 90%; font-size: small;\">" + _this.getConfig('downloadLink') + "</textarea><p class=\"description alert-info\" style=\"font-size: medium;\">This link has been copied to your clipboard</p></div></div></span></div></div>"));
        	// make sure we create space for the button so it doesn't overflow
        	$ (" .titleLabel").width($ (" .titleLabel").width() - 50);
        },
        closeModal: function() {
        	$('#h5pModal').hide();
        	console.log("closeModal called");
        }
	}));
});
 