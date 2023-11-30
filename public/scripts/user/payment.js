const stripe = Stripe('pk_test_51MlUQzK3uZOhyVLxSQyOyAHVyKAgsQAnLcVNFO3BhjiiZyFXc5FsLruQ3VD4XXOQTZHRVWFn4RHNJs82WbwxQ01l00uyTVcGD3'); // Your Publishable Key
const elements = stripe.elements();

const card = elements.create('card');
card.mount('#card-element');
const errorEl = $('#card-errors');

$('#payoutForm').on('submit', e => {
    e.preventDefault();
    stripe.createToken(card).then(res => {
      if (res.error) errorEl.textContent = res.error.message;
      else stripeTokenHandler(res.token);
    })
})

const stripeTokenHandler = token => {
    jQuery.ajax({
        type: "post",
        url: "/charging",
        data: {
            'token': token.id,
            'amount': $('#payNumber').val()
        },
        success: (data) => location.reload(),
        error: (error) => location.reload(),
    });
  }

