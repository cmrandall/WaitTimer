jQuery(document).ready(function ($) {
    showSites();
});  


// ***************************************************************************************
// this function calls showSites to get new changes made on waitTime.xml   
// ***************************************************************************************
function fetchData() {
    setTimeout(function () {
        showSites();
        // recursive call
        fetchData();
    }, 300000);
};

// 300000 (5min refresh)
// 15000 (15sec refresh)

function showSites() {
    jQuery.ajax({
        type: "GET",
        url: "waitTime.xml",
        dataType: "xml",

        error: function (e) {
            alert("An error occurred while processing XML file");
            console.log("XML reading Failed: ", e);
        },

        success: function (response) {
            // make sure the section is empty
            // before appending data inot it
            $(".waitTime").children().remove();
            $('.waitTime').append("<div class='waitTimeRow row'></div>");
            $(".waitTimeRow").append("<h3 id='waitHeader' class='col-sm-12'> (Hospital Name) Urgent Care Center Wait Times </h3>");
            
            
            $(response).find("site").each(function () {
                // Set XML data to variables
                var _name = $(this).find('site_name').text().toString().toUpperCase();
                var _waitTime = parseInt($(this).find('site_waitTime').text());
                var _address = $(this).find('site_addr').text();
                
                // Create HTML Elements for XML data
                $(".waitTimeRow").append("<div class='siteDiv col-sm-3'>" + "<div class='siteName'>" + _name + "</div>" + "<div>" + "Estimated Wait Time" + "</div>" + "<div class='waitColor'>" + "<span class='waitNum'>" + _waitTime + "</span>" +" Minutes" + "</div>" + "<div>" + `<a target='_blank' href=${_address}>` + "Click Here for Directions" + "</a>" + "</div>" + "</div>");
            });

            //Append Disclaimer to bottom of Wait Time Section
            $(".waitTimeRow").append("<div id='waitFooter' class='col-sm-12'> <p> Wait times vary per location and are updated every 5 minutes. They are approximate and reflect how long it may take from the time you arrive and check-in to when you are taken to an exam room. </p> </div>")
            waitTimeColor();
        }
        
    });
};

// Color code wait time 
function waitTimeColor() {
    var waitDivs = document.querySelectorAll(".waitNum");
       
    for(var i = 0 ; i < waitDivs.length ; i++){
        var num = parseInt(waitDivs[i].innerHTML);
        console.log(waitDivs[i].parentNode);
        if(num <= 15) {
            waitDivs[i].parentNode.setAttribute("style", "color: green;");
        }else if(num > 15 && num <= 30){
            waitDivs[i].parentNode.setAttribute("style", "color: #FFCC00;");
        }else {
            waitDivs[i].parentNode.setAttribute("style", "color: red;");
        }
    };

};

// Refresh Data
fetchData();