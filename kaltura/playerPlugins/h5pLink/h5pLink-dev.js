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
        	//$ (".topBarContainer").append("<button class=\"btn pull-right\" ><img src=\"https://longingforhome.github.io/kaltura/playerPlugins/h5pLink/h5p_logo.png\"></button>"); 
        	$ (".topBarContainer").append(' ', $("<button class=\"btn pull-right\" ><img src=\"https://longingforhome.github.io/kaltura/playerPlugins/h5pLink/h5p_logo.png\"></button>").on('click', function(e) {$('#h5pModal').show();var copyLink = document.getElementById("h5pLink");copyLink.select(); document.execCommand("copy")}));     	
        	//$ (".topBarContainer").append("<button class=\"btn pull-right\" ><img src=\"" + _this.getConfig('downloadLink') + "\"></button>");
        	$ (" .videoHolder").append('', $("<div id=\"h5pModal\"class=\"screen infoScreen semiTransparentBkg\" role=\"dialog\" aria-labelledby=\"dialogTitle\" style=\"display: none;\"><div class=\"screen-content\"><span class=\"icon-close\" aria-label=\"Close screen\" tabindex=\"0\" role=\"button\" onclick=\"closeModal()\"></span><span class=\"tmpl\"><div class=\"infoScreenPanel\"><div class=\"title\" aria-label=\"Content link for H5P\" tabindex=\"0\"><p>Content link for H5P</p><textarea id=\"h5pLink\" readonly>" + _this.getConfig('downloadLink') + "</textarea></div></div></span></div></div>"));
        },
        closeModal: function() {
        	$('#h5pModal').hide();
        }
	}));
});
 