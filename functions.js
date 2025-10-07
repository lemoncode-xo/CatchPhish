function urlFromExtension() {
    document.getElementById("url").value = "URL from extension";
    document.getElementById("s-cover").firstElementChild.click();
};

function printOut(divId) {
    var printOutContent = document.getElementById(divId).innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printOutContent;
    window.print();
    document.body.innerHTML = originalContent;
}

// Extract Domain From Url
function getDomainFromUrl(url) { 
    return ('https://' + url).toString().replace(/^.*\/\/(www\.)?([^\/?#:]+).*$/, '$2').toLowerCase();
};


async function processInput() {
    var url = document.getElementById("url").value;
    
    if (url !== ""){ //Only proceed if there is input
        
        if (navigator.onLine) { //Only if internet
            
            $("#ics").html("");                             // Hide 'no internet' signal
            $("#searchbox").addClass("shrink");             // Shrink searchbox
            $("#intro-msg").css("display","none");          // Hide Intro msg
            $("#refresh-btn").css("display","block");       // Show Refresh button
            $("#search-result").css("display", "block");    // Show Result container
            $("#preloader").css("display", "block");        // make sure preloader is shown until there is result
            $("#preloader_2").css("display", "block");      // make sure preloader_2 is shown until there is result
            $("#printBtn").css("display", "none");         // make sure printBtn is hidden until there is result

            // send user's URI input to electron's main process
            // i.e to enable using API key from .env file
            window.ipcRenderer.parseInput(url);

            // Recieve API response from electron's main process
            window.ipcRenderer.parseResponse()
            .then( url_data => {
                if (!url_data.success) { $("#ics").html(url_data.message); }
                else {
                    $("#preloader").css("display", "none");  // Hide/stop preloader when there is a result
                    $("#preloader_2").css("display", "none");// Hide/stop preloader_2 when there is a result
                    $("#printBtn").css("display", "block");  // show printBtn when there is result
                    
                    $("#result").html(
                        "&#128737; Catch-Phish Scan on '"+url_data.domain+"'  &#8594; "+url_data.message
                    );
                        
                    // Risk Score?
                    if (url_data.risk_score >= 75){ 
                        $("#risk-score").css("background-color", "red");
                        $("#risk-score").html(url_data.risk_score);
                    }
                    if(url_data.risk_score < 75){
                        $("#risk-score").css("background-color", "green");
                        $("#risk-score").html(url_data.risk_score);
                    }
                    
                    // Phising?
                    if (url_data.phishing == true){
                        $("#phishing-page").css("background-color","red");
                        $("#phishing-page").html("Yes");
                    }
                    else if(url_data.phishing == false){
                        $("#phishing-page").css("background-color","green");
                        $("#phishing-page").html("No");
                    }
                    else{
                        $("#phishing-page").css("background-color","orange");
                        $("#phishing-page").html("#");
                    }
                    
                    // Unsafe?
                    if (url_data.unsafe == true){
                        $("#unsafe-page").css("background-color","red");
                        $("#unsafe-page").html("Yes");
                    }
                    else if (url_data.unsafe == false){
                        $("#unsafe-page").css("background-color","green");
                        $("#unsafe-page").html("No");
                    }
                    else{
                        $("#unsafe-page").css("background-color","orange");
                        $("#unsafe-page").html("#");
                    }

                    // Malware?
                    if (url_data.malware == true){
                        $("#malware-page").css("background-color","red");
                        $("#malware-page").html("Yes");
                    }
                    else if  (url_data.malware == false){
                        $("#malware-page").css("background-color","green");
                        $("#malware-page").html("No");
                    }
                    else{
                        $("#malware-page").css("background-color","orange");
                        $("#malware-page").html("#");
                    }

                    // Spamming?
                    if (url_data.spamming == true){
                        $("#spamming-page").css("background-color","red");
                        $("#spamming-page").html("Yes");
                    }
                    else if (url_data.spamming == false){
                        $("#spamming-page").css("background-color","green");
                        $("#spamming-page").html("No");
                    }
                    else{
                        $("#spamming-page").css("background-color","orange");
                        $("#spamming-page").html("#");
                    }

                    // Suspicious?
                    if (url_data.suspicious == true){
                        $("#suspicious-page").css("background-color","red");
                        $("#suspicious-page").html("Yes");
                    }
                    else if(url_data.suspicious == false){
                        $("#suspicious-page").css("background-color","green");
                        $("#suspicious-page").html("No");
                    }
                    else{
                        $("#suspicious-page").css("background-color","orange");
                        $("#suspicious-page").html("?");
                    }

                    // IP Address
                    $("#ip-address").html(url_data.ip_address);
                    $("#ip-address").css("text-decoration", "underline");

                    // Server
                    $("#server").html(url_data.server);
                    $("#server").css("text-decoration", "underline");

                    // Page Size
                    $("#page-size").html(url_data.page_size);
                    $("#page-size").css("text-decoration", "underline");

                    // Content Type
                    $("#content-type").html(url_data.content_type);
                    $("#content-type").css("text-decoration", "underline");

                    // Domain Age
                    $("#domain-age").html(url_data.domain_age.human);
                    $("#domain-age").css("text-decoration", "underline");

                    // Page Category
                    $("#page-category").html(url_data.category);
                    $("#page-category").css("text-decoration", "underline");

                    // Adult page?
                    if (url_data.adult == true){
                        $("#adult-page").html("Yes");
                        $("#adult-page").css("text-decoration", "underline");
                    }
                    else if(url_data.adult == false){
                        $("#adult-page").html("No");
                        $("#adult-page").css("text-decoration", "underline");
                    }
                    else{
                        $("#adult-page").html("#");
                    }
                    
                    // Parking page?
                    if (url_data.parking == true){
                        $("#parking-page").html("Yes");
                        $("#parking-page").css("text-decoration", "underline");
                    }
                    else if(url_data.parking == false){
                        $("#parking-page").html("No");
                        $("#parking-page").css("text-decoration", "underline");
                    }
                    else{
                        $("#parking-page").html("#");
                    }

                    // Is domain DNS valid?
                    if (url_data.dns_valid == true){
                        $("#dns-valid").css("background-color","green");
                        $("#dns-valid").css("color","white");
                        $("#dns-valid").css("text-decoration", "underline");
                        $("#dns-valid").html("Yes");
                    }
                    else if(url_data.dns_valid == false){
                        $("#dns-valid").css("background-color","red");
                        $("#dns-valid").css("color","white");
                        $("#dns-valid").css("text-decoration", "underline");
                        $("#dns-valid").html("No");
                    }
                    else{
                        $("#dns-valid").css("background-color","orange");
                        $("#dns-valid").html("#");
                    }

                    // Domain Rank
                    $("#domain-rank").html(url_data.domain_rank);
                    $("#domain-rank").css("text-decoration", "underline");
                    

                    // Get Longitude and Latitude from IP Adress as Domain's location
                    fetch("http://www.geoplugin.net/json.gp?ip="+url_data.ip_address)
                        .then( response => response.json() )        // Get JSON location_data from IPADREESS AS JSON
                        .then( location_data => {                   // Use location_data gotten from JSON
                        
                            $("#domain-city").html(location_data.geoplugin_city+", ");
                            $("#domain-country").html(location_data.geoplugin_countryName+" ("+location_data.geoplugin_countryCode+")");
                            $("#domain-continent").html("{"+location_data.geoplugin_continentName+"}");
                            
                            var lat = location_data.geoplugin_latitude
                            var long = location_data.geoplugin_longitude

                            $("#domain-latitude").html("["+lat);
                            $("#domain-longitude").html(long+"]");
                            
                            // Embed google map without api using parameters
                            mapPath = "https://maps.google.com/maps?t=m&z=18&q="+lat+","+long+"&ie=UTF8&iwloc=&output=embed";
                            document.getElementById("gmap_canvas").src = mapPath;        
                        })
                        .catch(err => $("#ics").html(err) )         // Display error if there is any
                    // Get Longitude and Latitude from IP Adress as Domain's location -->

                    // Get USER'S LOCATION
                    fetch("http://www.geoplugin.net/json.gp")
                        .then( response => response.json() )        // Get JSON location_data from IPADREESS AS JSON
                        .then( location_data => {                   // Use location_data gotten from JSON
                        
                            $("#usr-city").html(location_data.geoplugin_city+", ");
                            $("#usr-country").html(location_data.geoplugin_countryName+" ("+location_data.geoplugin_countryCode+")");
                            $("#usr-continent").html("{"+location_data.geoplugin_continentName+"}");
                            
                            $("#usr-latitude").html("["+location_data.geoplugin_latitude);
                            $("#usr-longitude").html(location_data.geoplugin_longitude+"]");
                            
                        })
                        .catch(err => {
                            console.log(err);
                            $("#ics").html("Unable to get map view of lat & long. Check your internet connection and try again");
                        } )     // Display error if there is any
                    // Get USER'S LOCATION -->
                }
            })
            .catch( error => {
                // console.log(error);
                $("#ics").html(
                    `Catch-Phish scan on URL on "${getDomainFromUrl(url)}" failed. 
                    Check your internet connection and try again <br/>${error}`
                );
            })
            

            // get response from main electron process
            // try {
                
            // await window.ipcRenderer.parseResponse((event, url_data) => {
            //     console.log(event);
                
            //     console.log(url_data);
            //     console.log('herer2 after ipqs response');
            // })
            
            // // IPQuality Score API to check webpage
            // // const response = await fetch(`https://ipqualityscore.com/api/json/url/${process.env.IPQS_API_KEY}/${encodeURIComponent(url)}`);

            // // Check if the response status is not OK (e.g., 404, 500)
            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            // // .then( response => { console.log(response.json() });        // Log fetch response
            // // .then( response => response.json() )        // Get url_data as JSON from response
            // response.json()

            // await window.ipcRenderer.parseResponse()
            
                // .then( url_data => {                        // Use url_data gotten from JSON
            
                    

                // })
                // .catch(err => {
                //     } catch (err){
                    
                // } // Display error if there is any
            
                // }
        // IPQuality Score API to check webpage -->
            
        }
        else { // if No internet connectivity
            $("#ics").html("You're offline");
            //blink no internet signal
            $("#ics").animate({'opacity': '0'},100); $("#ics").animate({'opacity': '1'},300); 
        }
    }

    
};