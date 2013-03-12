var hue = (function(){
	var
		randomSel = '#random',
		freakOutSel = '#freakOut',
		
		$body,
		$randomize,
		$freakOut,
		
		user = "huejs",
		ip = "",
		lights = 3,
		lightsArr = [],

		shouldFreakOut = false,
		
		findIp = function(cb) {
			// This will always faill because their API doesn't support JSONP, 
			// so the response comes back as just a string, causing a jQ parse error
			// ----------
			//$.ajax({
			//	type: 'GET',
			//	url: 'http://www.meethue.com/api/nupnp',
			//	dataType: 'json'
			//}).complete(function(data){
			//	if(typeof data[0] != 'object'){
			//		console.log('Sorry, no local hue detected!');
			//	}else{
			//		ip = data[0].internalipaddress;
			//	}	
			//});
			ip = "192.168.1.7";

			if(typeof cb == 'function'){
				cb();
			}
		},

		findLights = function(){
			$.ajax({
				type: 'GET',
				url: 'http://'+ip+'/api/newdeveloper/lights',
				dataType: 'json',
			}).done(function(data){
				lights = Object.keys(data).length;
				for (var i = 1; i <= lights; i++) { //for some reaston this is a numbered object, not an array
					lightsArr.push(data[i]);
				}
			});
		},

		setLight = function(id, hue, sat, bri){
			console.log('Setting '+ip+'/'+id+' to h:'+hue+', s:'+sat+', l:'+bri);
			$.ajax({
				type: 'PUT',
				url: 'http://'+ip+'/api/newdeveloper/lights/'+id+'/state',
				dataType: 'json',
				data: '{"on":true, "sat":'+sat+', "bri":'+bri+',"hue":'+hue+'}'
			}).always(function(){
				//console.log(id+' set!');
			});
		},

		randomizeLights = function() {
			$.each(lightsArr, function(i, el){
				var
					hue = parseInt(Math.random()*65535),
					bri = parseInt(Math.random()*255),
					sat = 180+parseInt(Math.random()*75);
				setLight(i+1, hue, sat, bri);
			});
		},

		freakOut = function(){
			if(shouldFreakOut){
				randomizeLights();
			}
		},

		randomizeHandler = function(e){
			randomizeLights();
			e.preventDefault();
		},

		freakOutHandler = function(e){
			shouldFreakOut = $freakOut.is(':checked');
		},
	
		init = function(mapContainerSel){
			findIp(findLights);

			$body = $('body');
			$randomize = $body.find(randomSel);
			$freakOut = $body.find(freakOutSel);
			
			$randomize.click(randomizeLights);
			$freakOut.click(freakOutHandler);

			setInterval(freakOut, 500);
		};
	
	return {
		init: init,
		setLight: setLight
	};
}());
