$( document ).ready(function() {
	$( window ).load(function() {
		$( "#openPlatform" ).on( "click", function() {
			console.log("usernameField "+$("#usernameField").val())
			$("#introduction").hide();
			$("#product").show();
			setMultiConnection($("#usernameField").val());
		});
		
		
  });
});

var videoconferencing;
var whoIAm=""
function setMultiConnection(nameUser){
	
	var totUsers=0;
	
	var MODERATOR_CHANNEL_ID = 'ABCDEF-'; 
	var MODERATOR_SESSION_ID = 'filippo';    // room-id
	var MODERATOR_ID         = 'generaluser';    // user-id
	var MODERATOR_SESSION    = {         // media-type
	    audio: true,
		video: true,
		data: true
	};
	videoconferencing = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
	videoconferencing.preventSSLAutoAllowed = false;
	videoconferencing.autoReDialOnFailure = true;
	videoconferencing.setDefaultEventsForMediaElement = false;
	
	//console.log("totUsers: "+videoconferencing.numberOfConnectedUsers);
     

     $( "#connectMulticonferenceButton" ).on( "click", function() {
		//console.log("openMuliticonnection")
		videoconferencing.userid = "user_1";
        videoconferencing.extra = {user: "user_1"};
        videoconferencing.session = MODERATOR_SESSION;
        
        videoconferencing.maxParticipantsAllowed = 20;
        
        //videoconferencing.direction = 'many-to-many';
        
        //OPEN
        
        whoIAm=videoconferencing.userid;
        
        videoconferencing.open({
	        sessionid: MODERATOR_SESSION_ID
	    });
	    
	    
	    videoconferencing.onstream = function(e) {
		    totUsers++;
		    
		    //console.log("user: "+e.userid)
		   // $('#messages').val("userID: "+e.userid);


		    $('#videoConferenceContainer').append('<div id="'+e.userid+'" class="col-md-'+12/totUsers+'"></div>');

            var video = e.mediaElement
	        video.setAttribute('controls', false);
	        $('#videoConferenceContainer #'+e.userid).append(video);
	        $('#videoConferenceContainer #'+e.userid+' video').removeAttr("controls");
			video.play();
	        
	        $('#videoConferenceContainer #'+e.userid).append('<div id="piano" class="piano"></div>');
		    $('#videoConferenceContainer #'+e.userid+' #piano').load("sources/piano.html");
		    
			$('#videoConferenceContainer').children("div").each(function(){
				if ( $(this).attr("id") !="piano"){
					 this.className = 'col-md-'+12/totUsers;
				}   
		    });
		    
		    
		    activePitchDetection();


			/*$('#videoConferenceContainer #user_'+totUsers+' video').bind("progress",function(e){
		        videoconferencing.send("ciaoFromMaster"+totUsers) 
		    });*/

		};
		
		videoconferencing.onstreamended = function(event) {
			     var userToRemove= event.userid;
			     $('#videoConferenceContainer #'+userToRemove).empty();
			     $('#videoConferenceContainer #'+userToRemove).remove();
			     
		     	 totUsers--;
		     	 
		     	 $('#videoConferenceContainer').children("div").each(function(){
					if ( $(this).attr("id") !="piano"){
						 this.className = 'col-md-'+12/totUsers;
					}   
			    });
		 }
		
		var values;
		var sectionToDisplay;
		var noteToDisplay
		videoconferencing.onmessage = function(e) {
		                var tx=e.data;
						values=tx.split("£");
						
						//console.log("userID: "+e.userid);
						
						//console.log(e.userid+" "+values[0] +" "+values[1]);
						//$('#messages').val("userID: "+e.userid+" "+"sectionToDisplay: "+values[0] +" "+"noteToDisplay: "+values[1]);
						
						sectionToDisplay=values[0];
						noteToDisplay=values[1];


				       
				       	$("#"+e.userid+" #Layer_1 rect").css("fill","#FFFFFF");
						$("#"+e.userid+" #Layer_2 rect").css("fill","#000000");
						   
				  		if(noteToDisplay.indexOf("#")==-1){
				           $("#"+e.userid+" #Layer_1 #range"+sectionToDisplay+" #"+noteToDisplay).css("fill","#FF0000");
						}
						else{
							noteToDisplay=noteToDisplay.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
							$("#"+e.userid+" #Layer_2 #range"+sectionToDisplay+" #"+noteToDisplay).css("fill","#00FF00");
						}
		};
		
		$('#videoConferenceContainer #user_'+totUsers+' video').bind('playing',function() {
            alert("Playing");
        });
		
		 
		 
	
		        
     });
     
     $( "#joinMulticonferenceButton" ).on( "click", function() {
     
     	
     	   var sessionDescription = {
		    sessionid: MODERATOR_SESSION_ID,
		    userid: 'user_2',
		    extra: {user: "user_2"},
		    session: {
		        audio: true,
		        video: true,
		        data: true
		    }
		};
		console.log("totUsers: "+videoconferencing.numberOfConnectedUsers);
		
            videoconferencing.userid = "user_"+videoconferencing.numberOfConnectedUsers;
			videoconferencing.join(sessionDescription);
			videoconferencing.userid = "user_"+videoconferencing.numberOfConnectedUsers;
			
			//videoconferencing.maxParticipantsAllowed = 20; 
			
			
			
			whoIAm=videoconferencing.userid;
		    
		  //videoconferencing.direction = 'many-to-many';
		    
		     videoconferencing.onstream = function(e) {
		     	
		     	
			    totUsers++;
			    $('#videoConferenceContainer').append('<div id="'+e.userid+'" class="col-md-'+12/totUsers+'"></div>');
	
	            var video = e.mediaElement
		        video.setAttribute('controls', false);
		        $('#videoConferenceContainer #'+e.userid).append(video);
		        $('#videoConferenceContainer #'+e.userid+' video').removeAttr("controls");
		        video.play();
		        
		        $('#videoConferenceContainer #'+e.userid).append('<div id="piano" class="piano"></div>');
		        $('#videoConferenceContainer #'+e.userid+' #piano').load("sources/piano.html");
		        
			    $('#videoConferenceContainer').children("div").each(function(){
					if ( $(this).attr("id") !="piano"){
						 this.className = 'col-md-'+12/totUsers;
					}   
			    });
				
				/*$('#videoConferenceContainer #user_'+totUsers+' video').bind("progress",function(e){
		           videoconferencing.send("ciaoFromMaster"+totUsers) 
		         });*/
		        
		        activePitchDetection();
		        	    
		     };
		     
		     videoconferencing.onstreamended = function(event) {
		     	 var userToRemove= event.userid;
		     	 $('#videoConferenceContainer #'+userToRemove).empty();
			     $('#videoConferenceContainer #'+userToRemove).remove();
		     	 totUsers--;
		     	 
		     	 $('#videoConferenceContainer').children("div").each(function(){
					if ( $(this).attr("id") !="piano"){
						 this.className = 'col-md-'+12/totUsers;
					}   
			    });
		    
		     }
		       
		      
		       var values;
		       var sectionToDisplay;
		       var noteToDisplay;
		       //Receivement of new messages
		       videoconferencing.onmessage = function(e) {
		       	        var tx=e.data;
						values=tx.split("£");
						
						//console.log("userID: "+e.userid);
						
					//	$('#messages').val("userID: "+e.userid+" "+"sectionToDisplay: "+values[0] +" "+"noteToDisplay: "+values[1]);
						
						sectionToDisplay=values[0];
						noteToDisplay=values[1];


				       
				       	$("#"+e.userid+" #Layer_1 rect").css("fill","#FFFFFF");
						$("#"+e.userid+" #Layer_2 rect").css("fill","#000000");
						   
				  		if(noteToDisplay.indexOf("#")==-1){
				           $("#"+e.userid+" #Layer_1 #range"+sectionToDisplay+" #"+noteToDisplay).css("fill","#FF0000");
						}
						else{
							noteToDisplay=noteToDisplay.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
							$("#"+e.userid+" #Layer_2 #range"+sectionToDisplay+" #"+noteToDisplay).css("fill","#00FF00");
						}
						
				}; 

	 });
	
	
}

var section;
var noteDetected;

var audioContext = null;
var meter = null;

function flash(callback) {
        window.requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame;
        return window.requestAnimationFrame(callback);
}
      
function activePitchDetection() {
        pitchDetector.startLiveInput();
        setAudioControl();
        display()
};

function setAudioControl(){
		
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext();
}


function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    display();
}

function display() {
          if (pitchDetector.pitch) {
          	
          	// check if yhe volume is high enought
		    if (meter.checkClipping()){
		    	 displayPitch(pitchDetector.pitch , pitchDetector.noteString);
		    }
		   else{
		    	//console.log("volum not hight enought")
		    } 
          }
          flash(display);
};

var oldPitch="";

function displayPitch(pitch, note) {
	
	  if(oldPitch!=pitch){
	  	
  		pitch=Number(pitch);
  		
  		

  		//According to the Hz
  		if(pitch>=27.500 && pitch<32.703){
  			//Group A0
  			section=0;
  		}
  		if(pitch>=32.703 && pitch<55.000){
  			//Group A1
  			section=1;
  		}
  		if(pitch>=55.000 && pitch<110.00){
  			//Group A2
  			section=2;
  		}

  		if(pitch>=110.00 && pitch<220.00){
  			//Group A3
  			section=3;
  		}

  		if(pitch>=220.00 && pitch<440.00){
  			//Group A4 // (LA)
  			section=4;
  		}

  		if(pitch>=440.00 && pitch<880.00){
  			//Group A5
  			section=5;
  		}

  		if(pitch>=880.00 && pitch<1760.0){
  			//Group A6
  			section=6;
  		}

  		if(pitch>=1760.0 && pitch<3520.0){
  			//Group A7
  			section=7;
  		}
  		
  		videoconferencing.send(section+"£"+note);
  		
				  		//console.log("I AM : "+whoIAm)
				  		$("#"+whoIAm+" #Layer_1 rect").css("fill","#FFFFFF");
						$("#"+whoIAm+" #Layer_2 rect").css("fill","#000000");
						   
				  		if(note.indexOf("#")==-1){
				           $("#"+whoIAm+" #Layer_1 #range"+section+" #"+note).css("fill","#FF0000");
						}
						else{
							note=note.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
							$("#"+whoIAm+" #Layer_2 #range"+section+" #"+note).css("fill","#00FF00");
						}
						
  		
  		
  				
		
		oldpItch=pitch;
		
	}
		
		
}