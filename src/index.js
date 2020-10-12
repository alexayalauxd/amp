import Amplify, { API } from "@aws-amplify/api";

import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

window.onload = function() {
    API.get('payAPI', '/items', {}).then(x=>{
        console.log(x);    
    })
}
