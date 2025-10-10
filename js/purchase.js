
document.addEventListener('DOMContentLoaded', function(){
  // Open modal when any .btn-buy clicked
  function findProductSection(el){
    return el.closest('.product-page') || document.querySelector('.product-page');
  }
  document.querySelectorAll('.btn-buy').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var section = findProductSection(btn);
      if(!section) return alert('Produit introuvable.');
      var productName = (section.querySelector('.product-title') && section.querySelector('.product-title').innerText.trim()) || section.dataset.product || document.title;
      var priceStr = section.dataset.price || (section.querySelector('.current-price') && section.querySelector('.current-price').innerText) || '';
      var price = parseInt(priceStr.replace(/[^\d]/g,'')) || 0;
      // set hidden fields
      document.getElementById('pf_product').value = productName;
      // try to detect selected color and size
      var selectedColor = (section.querySelector('.option-button.selected') && section.querySelector('.option-button.selected').innerText.trim()) || '';
      var selectedSize = (section.querySelector('.option-button.selected[data-size]') && section.querySelector('.option-button.selected[data-size]').dataset.size) || '';
      document.getElementById('pf_color').value = selectedColor;
      document.getElementById('pf_size').value = selectedSize;
      // show modal
      var modal = document.getElementById('purchaseModal');
      modal.setAttribute('aria-hidden','false');
      // when delivery changes update total
      var radios = modal.querySelectorAll('input[name="delivery_option"]');
      function updateTotal(){
        var del = 0;
        radios.forEach(function(r){
          if(r.checked) del = parseInt(r.value);
        });
        var total = price + del;
        document.getElementById('displayTotal').innerText = total + ' DZD';
        document.getElementById('pf_total').value = total + ' DZD';
        document.getElementById('pf_delivery').value = del + ' DZD';
      }
      radios.forEach(function(r){ r.addEventListener('change', updateTotal); });
      // set initial total if one radio already checked
      updateTotal();
    });
  });
  // close modal
  var close = document.getElementById('closePurchaseModal');
  if(close) close.addEventListener('click', function(){ document.getElementById('purchaseModal').setAttribute('aria-hidden','true'); });
  // when form submits, ensure hidden fields updated with latest selections
  var form = document.getElementById('purchaseForm');
  if(form){
    form.addEventListener('submit', function(){
      var section = document.querySelector('.product-page');
      var selectedColor = (section.querySelector('.option-button.selected') && section.querySelector('.option-button.selected').innerText.trim()) || '';
      var selectedSize = (section.querySelector('.option-button.selected[data-size]') && section.querySelector('.option-button.selected[data-size]').dataset.size) || '';
      document.getElementById('pf_color').value = selectedColor;
      document.getElementById('pf_size').value = selectedSize;
      // also append the chosen delivery label
      var delLabel = '';
      var radios = form.querySelectorAll('input[name="delivery_option"]');
      radios.forEach(function(r){ if(r.checked){ delLabel = (r.parentElement && r.parentElement.innerText) || r.value; }});
      document.getElementById('pf_delivery').value = delLabel;
    });
  }
});
