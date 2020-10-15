import Amplify, { API } from "@aws-amplify/api";
var stripe = Stripe("pk_test_51HYwv2Eqyr7A4WY0J5wrBi7yolgoTiuS5HyfWHjaQjjWK3wkhus4Xy9055T9kcysPvAmT5XTIWDU2sgcq90vw5n800CWygIs9x");

import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

window.onload = function() {
    
    document.querySelector("button").disabled = true;

    // API.get('payAPI', '/items', {}).then(x=>{
    //     console.log(x);    
    // })
    const myInit = {
        body: {
            purchase : {
                items: [{ id: "software" }]
            }
        }
    };

    API.post('payAPI', '/items', myInit).then(data => {
        var elements = stripe.elements();
    
        var style = {
          base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d"
            }
          },
          invalid: {
            fontFamily: 'Arial, sans-serif',
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        };
    
        var card = elements.create("card", { style: style });
        card.mount("#card-element");
    
        card.on("change", function (event) {
          // Desactivar boton si no hay datos
          document.querySelector("button").disabled = event.empty;
          document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
        });
    
        var form = document.getElementById("payment-form");
        form.addEventListener("submit", function(event) {
          event.preventDefault();
          // Pagar al dar click
          payWithCard(stripe, card, data.clientSecret);
        });
      });

      // Llama a stripe.confirmCardPayment
// Mostrar mensaje de autenticación
var payWithCard = function(stripe, card, clientSecret) {
    loading(true);
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: card
        }
      })
      .then(function(result) {
        if (result.error) {
          // Error
          showError(result.error.message);
        } else {
          // Éxito
          orderComplete(result.paymentIntent.id);
        }
      });
  };
  
  /* ------- UI helpers ------- */
  
  // Mensaje de exito
  var orderComplete = function(paymentIntentId) {
    loading(false);
    document
      .querySelector(".result-message a")
      .setAttribute(
        "href",
        "https://dashboard.stripe.com/test/payments/" + paymentIntentId
      );
    document.querySelector(".result-message").classList.remove("hidden");
    document.querySelector("button").disabled = true;
  };
  
  // Mostrar error al cliente si no acepta su tarjeta
  var showError = function(errorMsgText) {
    loading(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function() {
      errorMsg.textContent = "";
    }, 4000);
  };
  
  // Mostrar una ruleta al enviar el pago
  var loading = function(isLoading) {
    if (isLoading) {
      // Desactive el botón y muestre una ruleta
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  };
  
}
