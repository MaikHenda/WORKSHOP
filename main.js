//See if the browser supports Service Workers, if so try to register one
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js").then(function(registering){
	// Registration was successful
	console.log("Browser: Service Worker registration is successful with the scope",registering.scope);
  }).catch(function(error){
	//The registration of the service worker failed
	console.log("Browser: Service Worker registration failed with the error",error);
  });
}else { 
  //The registration of the service worker failed
  console.log("Browser: I don't support Service Workers :(");
}

//Notification asking
if(typeof Notification!==typeof undefined){
	Notification.requestPermission().then(function(resultaat){
		//If accepted, then save subscriberinfo in database
		if(resultaat==="granted"){
			console.log("Browser: User accepted receiving notifications, save as subscriber data!");
			//Make subscription button active (user is accepting notifications)
			$("#switches .notifications").addClass("active");
			navigator.serviceWorker.ready.then(function(registration){
				const VAPIDPublicKey="BBNRBqcfTyyHF6U8TJuE4kvtZf0dpLgQhnf1Y0A6bzCeOTCSIXsuLXb0HcOJbjBxC7H-WDq1xWabSazSdg7ceGI"; // Fill in your VAPID publicKey here
				const options={applicationServerKey:VAPIDPublicKey,userVisibleOnly:true} //Option userVisibleOnly is neccesary for Chrome
				registration.pushManager.subscribe(options).then((subscription)=>{
					let subscriberFormData=new FormData();
					subscriberFormData.append("json",JSON.stringify(subscription));
					fetch("data/saveSubscription.php",{method:"POST",body:subscriberFormData});
				});
			});
		}
	}).catch((error)=>{
		console.log(error);
	});
} 

//Get geolocation
if(navigator.geolocation){
	console.log("Browser: Try to get geolocation");
	navigator.geolocation.getCurrentPosition((location)=>{
		console.log("Browser: Location found ->",location);
		$("#switches .geolocation").addClass("active");
		$("body").css("background-image","url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-l+fff("+String(location.coords.longitude).replace(",",".")+","+String(location.coords.latitude).replace(",",".")+")/"+String(location.coords.longitude).replace(",",".")+","+String(location.coords.latitude).replace(",",".")+",14.25,0,60/1280x900?access_token=pk.eyJ1IjoibWFpa2VscHV0bWFuIiwiYSI6ImNrMHk5eWNpMjBhMXIzY243Y25zM2F0YTUifQ.Xj2QnShudFIjQn5lST5vyQ')");
	},(error)=>{
		$("#switches .geolocation").removeClass("active");
	});
} 


let installPrompt; //Variable to store the install action in
window.addEventListener("beforeinstallprompt",(event)=>{		
	console.log("Browser: Install event blocked");
	event.preventDefault(); //Prevent the event (this prevents the default bar to show up)
	installPrompt=event; //Install event is stored for triggering it later
	$("#installbutton").addClass("active");
});


$("#switches li").click(function(){
	$(this).toggleClass("showtip");
});

$("#installbutton").click((event)=>{
	$("#installbutton").removeClass("active");
	installPrompt.prompt();
	installPrompt.userChoice.then((choiceResult)=>{
		if(choiceResult.outcome!=="accepted"){
			$("#installbutton").addClass("active");
		}
		installPrompt=null;
	});
});
window.addEventListener("beforeinstallprompt",(event)=>{	
	event.preventDefault(); //Prevent the event (this prevents the default bar to show up)
	installPrompt=event; //Install event is stored for triggering it later
	//...do something here to show your install button
})
	;//iOS install tip show
const isIOSUsed=()=>{
  const userAgent=window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent); //Return if iOS is used (iPhone, iPod or iPad)
}
const standaloneModeActive=()=>("standalone" in window.navigator)&&(window.navigator.standalone); //Will be true if the PWA is used
if(isIOSUsed()&&!standaloneModeActive()){ 
  //Show your install tip for iOS here
}