var apigClient = apigClientFactory.newClient({
    apiKey: 'get-item-api'
});
var params = {
    // This is where any modeled request parameters should be added.
    // The key is the parameter name, as it is defined in the API in API Gateway.
    param0: '',
    param1: ''
  };
  
var body = {
    // This is where you define the body of the request,
};
  
var additionalParams = {
    // If there are any unmodeled query parameters or headers that must be
    //   sent with the request, add them here.
    headers: {
        param0: '',
        param1: ''
    },
    queryParams: {
        param0: '',
        param1: ''
    }
};
  
window.onload = function(){
    var horsename = document.createElement("horsename");

    apigClient.getItemFunction(params, body, additionalParams)
    .then(function(result){
        console.log(result);
        var getItem = result.data.data;
        // div要素へデータを追加表示
        document.getElementById(horsename).appendChild(getItem);
    }).catch(function(result){
        console.log(result);
    });

};