var apigClient;
$(function(){
    apigClient = apigClientFactory.newClient();
});

window.onload = function(){
    // var horsename = document.createElement("horsename");

    apigClient.Get({},{},{})
    .then(function(result){
        console.log(result);
        // var getItem = result.data.data;
    }).catch(function(result){
        console.log(result);
    });
};