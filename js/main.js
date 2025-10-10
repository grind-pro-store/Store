// GRIND PRO v3 main JS - cart & cardlist (localStorage)
(function(){
  const CART_KEY = 'grindpro_cart_v3';
  const CARD_KEY = 'grindpro_cardlist_v3';
  function read(k){ try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]} }
  function write(k,v){ localStorage.setItem(k,JSON.stringify(v)) }
  function updateCounts(){ const cc = document.getElementById('cart-count'); const wc = document.getElementById('wish-count'); const cart = read(CART_KEY), card = read(CARD_KEY); if(cc) cc.textContent = cart.reduce((s,i)=>s+Number(i.qty),0); if(wc) wc.textContent = card.length; }
  window.handleAddToCart = function(root){ const p = root.closest('[data-product]'); const id = p.getAttribute('data-product'); const name = p.querySelector('.product-title').innerText; const price = Number(p.getAttribute('data-price')); const img = p.querySelector('.main-image').getAttribute('src'); const colorEl = p.querySelector('[data-color].active'); const color = colorEl ? colorEl.getAttribute('data-color') : ''; const sizeEl = p.querySelector('[data-size].active'); const size = sizeEl ? sizeEl.getAttribute('data-size') : 'M'; const qty = Number(p.querySelector('.qty-input') ? p.querySelector('.qty-input').value : 1) || 1; const cart = read(CART_KEY); const existing = cart.find(i=>i.id===id && i.color===color && i.size===size); if(existing) existing.qty = Number(existing.qty) + qty; else cart.push({id,name,price,qty,color,size,img}); write(CART_KEY,cart); updateCounts(); showToast('Added to cart'); };
  window.handleAddToCardList = function(root){ const p = root.closest('[data-product]'); const id = p.getAttribute('data-product'); const name = p.querySelector('.product-title').innerText; const price = Number(p.getAttribute('data-price')); const img = p.querySelector('.main-image').getAttribute('src'); const colorEl = p.querySelector('[data-color].active'); const color = colorEl ? colorEl.getAttribute('data-color') : ''; const sizeEl = p.querySelector('[data-size].active'); const size = sizeEl ? sizeEl.getAttribute('data-size') : 'M'; const card = read(CARD_KEY); if(card.find(i=>i.id===id && i.color===color && i.size===size)){ showToast('Already in Card List'); setTimeout(()=>{window.location='cardlist.html'},800); return; } card.push({id,name,price,qty:1,color,size,img}); write(CARD_KEY,card); updateCounts(); showToast('✅ Added to Card List'); setTimeout(()=>{ window.location='cardlist.html' }, 1200); };
  function showToast(text){ let t = document.getElementById('grind-toast'); if(!t){ t = document.createElement('div'); t.id='grind-toast'; t.style.position='fixed'; t.style.right='16px'; t.style.top='16px'; t.style.padding='10px 14px'; t.style.background='rgba(0,0,0,0.8)'; t.style.color='#fff'; t.style.borderRadius='8px'; t.style.zIndex=9999; document.body.appendChild(t); } t.textContent = text; t.style.opacity=1; t.style.transition='opacity .3s ease'; setTimeout(()=>{ t.style.opacity=0 }, 2000); }
  window.initProductUI = function(root){ const container = root || document; container.querySelectorAll('.thumb').forEach(function(t){ t.addEventListener('click', function(){ container.querySelectorAll('.thumb').forEach(x=>x.classList.remove('active')); t.classList.add('active'); const main = container.querySelector('.main-image'); if(main) main.src = t.getAttribute('data-src'); }); }); container.querySelectorAll('[data-color]').forEach(function(b){ b.addEventListener('click', function(){ if(b.classList.contains('disabled')) return; const g=b.getAttribute('data-group'); container.querySelectorAll('[data-color][data-group=\"'+g+'\"]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); const main = container.querySelector('.main-image'); if(main && b.getAttribute('data-src')) main.src=b.getAttribute('data-src'); }); }); container.querySelectorAll('[data-size]').forEach(function(s){ s.addEventListener('click', function(){ if(s.classList.contains('disabled')) return; container.querySelectorAll('[data-size]').forEach(x=>x.classList.remove('active')); s.classList.add('active'); }); }); };
  window.renderCardList = function(listEl, totalEl){ const card = read(CARD_KEY); listEl.innerHTML=''; let total=0; card.forEach((it,idx)=>{ const row = document.createElement('div'); row.style.display='flex'; row.style.gap='12px'; row.style.alignItems='center'; row.style.padding='10px 0'; row.style.borderBottom='1px solid #f2f2f2'; row.innerHTML = '<img src=\"'+it.img+'\" style=\"width:80px;border-radius:8px\"><div style=\"flex:1\"><strong>'+it.name+'</strong><div class=\"small\">Color: '+it.color+' • Size: '+it.size+'</div></div><div style=\"text-align:right\"><div>'+it.price+' DA</div><div style=\"margin-top:8px\"><input class=\"qty-input\" type=\"number\" min=\"1\" value=\"'+it.qty+'\" data-idx=\"'+idx+'\" style=\"width:64px;padding:8px;border-radius:8px;border:1px solid #e6e6e6\"></div><div style=\"margin-top:8px\"><button class=\"btn-secondary\" data-del=\"'+idx+'\">Delete</button></div></div>'; listEl.appendChild(row); total += it.price * it.qty; }); totalEl.textContent = total + ' DA'; listEl.querySelectorAll('.qty-input').forEach(function(inp){ inp.addEventListener('change', function(){ const i=Number(inp.getAttribute('data-idx')); const v=Number(inp.value)||1; const card=read(CARD_KEY); card[i].qty=v; write(CARD_KEY,card); renderCardList(listEl,totalEl); updateCounts(); }); }); listEl.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){ const i=Number(b.getAttribute('data-del')); const card=read(CARD_KEY); card.splice(i,1); write(CARD_KEY,card); renderCardList(listEl,totalEl); updateCounts(); }); }); };
  window.renderCart = function(tableBodyEl, totalEl){ const cart = read(CART_KEY); tableBodyEl.innerHTML=''; let total=0; cart.forEach((it,idx)=>{ const tr = document.createElement('tr'); tr.innerHTML = '<td><img src=\"'+it.img+'\" style=\"width:64px;border-radius:6px\"></td><td>'+it.name+'<div class=\"small\">Color: '+it.color+' • Size: '+it.size+'</div></td><td>'+it.price+' DA</td><td><input class=\"qty-input\" type=\"number\" min=\"1\" value=\"'+it.qty+'\" data-idx=\"'+idx+'\"></td><td>'+ (it.price*it.qty) +' DA</td><td><button class=\"btn-secondary\" data-del=\"'+idx+'\">Delete</button></td>'; tableBodyEl.appendChild(tr); total += it.price * it.qty; }); totalEl.textContent = total + ' DA'; tableBodyEl.querySelectorAll('.qty-input').forEach(function(inp){ inp.addEventListener('change', function(){ const i=Number(inp.getAttribute('data-idx')); const v=Number(inp.value)||1; const cart=read(CART_KEY); cart[i].qty=v; write(CART_KEY,cart); renderCart(tableBodyEl,totalEl); updateCounts(); }); }); tableBodyEl.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){ const i=Number(b.getAttribute('data-del')); const cart=read(CART_KEY); cart.splice(i,1); write(CART_KEY,cart); renderCart(tableBodyEl,totalEl); updateCounts(); }); }); };
  document.addEventListener('DOMContentLoaded', function(){ updateCounts(); });
})();


function getWishlist(){
    try{ return JSON.parse(localStorage.getItem('grindpro_wishlist')||'[]'); }catch(e){return[];}
}
function saveWishlist(list){ localStorage.setItem('grindpro_wishlist', JSON.stringify(list)); }

document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('.add-to-wishlist');
    if(!btn) return;
    // find product container
    var container = btn.closest && btn.closest('.product') || btn.closest('article') || btn.closest('.card') || document.body;
    var title = (container.querySelector('h2') && container.querySelector('h2').innerText) || (container.querySelector('.product-title') && container.querySelector('.product-title').innerText) || 'Produit';
    var priceText = (container.querySelector('.price') && container.querySelector('.price').innerText) || (container.querySelector('.product-price') && container.querySelector('.product-price').innerText) || '0';
    var price = parseFloat(priceText.replace(/[^0-9\.]/g,'')) || 0;
    var colorEl = container.querySelector('select[name="color"], select#color');
    var sizeEl = container.querySelector('select[name="size"], select#size');
    var color = colorEl ? colorEl.value : (container.querySelector('[data-color]') ? container.querySelector('[data-color]').getAttribute('data-color') : '');
    var size = sizeEl ? sizeEl.value : '';
    var item = { title: title, price: price, color: color, size: size, qty:1 };
    var list = getWishlist();
    list.push(item);
    saveWishlist(list);
    alert('Produit ajouté à la liste de souhaits');
});

function renderWishlistToCardlist(){
    var list = getWishlist();
    var container = document.getElementById('wishlist-items');
    if(!container) return;
    container.innerHTML = '';
    var total = 0;
    list.forEach(function(it, idx){
        total += (parseFloat(it.price)||0) * (it.qty||1);
        var div = document.createElement('div');
        div.className = 'wishlist-item';
        div.innerHTML = '<strong>'+escapeHtml(it.title)+'</strong> — ' + (it.color?('Couleur: '+escapeHtml(it.color)+', '):'') + (it.size?('Taille: '+escapeHtml(it.size)+', '):'') + ' Prix: ' + (it.price||0) + '€ <button data-index="'+idx+'" class="remove-item">Supprimer</button>';
        container.appendChild(div);
    });
    var totalEl = document.getElementById('wishlist-total');
    if(totalEl) totalEl.innerText = total.toFixed(2) + ' €';
}

document.addEventListener('click', function(e){
    var rem = e.target.closest && e.target.closest('.remove-item');
    if(!rem) return;
    var idx = parseInt(rem.getAttribute('data-index'));
    var list = getWishlist();
    if(!isNaN(idx) && list[idx]){ list.splice(idx,1); saveWishlist(list); renderWishlistToCardlist(); }
});

function escapeHtml(text){ return text ? String(text).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }) : ''; }

// Prepare form content when opening popup
function prepareOrderForm(){
    var list = getWishlist();
    var formProducts = list.map(function(it,i){ return (i+1)+'. '+it.title + (it.color?(' - Couleur: '+it.color):'') + (it.size?(' - Taille: '+it.size):'') + ' - Prix: ' + (it.price||0) + '€'; }).join('\n');
    var total = list.reduce(function(acc,it){ return acc + (parseFloat(it.price)||0) * (it.qty||1); },0).toFixed(2);
    var productsField = document.getElementById('order_products');
    if(productsField) productsField.value = formProducts;
    var totalField = document.getElementById('order_total');
    if(totalField) totalField.value = total + ' €';
    var preview = document.getElementById('order_preview');
    if(preview) preview.innerText = formProducts + '\n\nTotal: ' + total + ' €';
}

document.addEventListener('DOMContentLoaded', function(){
    renderWishlistToCardlist();
    var buyBtn = document.getElementById('buy-now');
    if(buyBtn) buyBtn.addEventListener('click', function(e){
        e.preventDefault();
        prepareOrderForm();
        var modal = document.getElementById('order-modal');
        if(modal) modal.style.display = 'block';
    });
    var closeBtn = document.getElementById('order-close');
    if(closeBtn) closeBtn.addEventListener('click', function(){ document.getElementById('order-modal').style.display='none'; });
});

// WISHLIST SCRIPT ADDED
function getWishlist(){
    try{ return JSON.parse(localStorage.getItem('grindpro_wishlist')||'[]'); }catch(e){return[];}
}
function saveWishlist(list){ localStorage.setItem('grindpro_wishlist', JSON.stringify(list)); }

document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('.add-to-wishlist');
    if(!btn) return;
    var container = btn.closest('.product') || btn.closest('article') || btn.closest('.card') || document.body;
    var titleEl = container.querySelector('h2') || container.querySelector('.product-title') || container.querySelector('h3') || container.querySelector('.title');
    var title = titleEl ? titleEl.innerText.trim() : 'Produit';
    var priceEl = container.querySelector('.current-price') || container.querySelector('.price') || container.querySelector('.product-price');
    var priceText = priceEl ? priceEl.innerText : '0';
    var price = parseFloat(priceText.replace(/[^0-9\.]/g,'')) || 0;
    var colorEl = container.querySelector('select[name="color"], select#color, [data-color-input]');
    var sizeEl = container.querySelector('select[name="size"], select#size, [data-size-input]');
    var color = colorEl ? colorEl.value : (container.querySelector('[data-color]') ? container.querySelector('[data-color]').getAttribute('data-color') : '');
    var size = sizeEl ? sizeEl.value : '';
    var item = { title: title, price: price, color: color, size: size, qty:1 };
    var list = getWishlist();
    list.push(item);
    saveWishlist(list);
    // small animation: flash button
    btn.classList.add('active');
    setTimeout(function(){ btn.classList.remove('active'); }, 400);
    // optional: go to cardlist page
    // window.location.href = 'cardlist.html';
});

function renderWishlistToCardlist(){
    var list = getWishlist();
    var container = document.getElementById('wishlist-items');
    if(!container) return;
    container.innerHTML = '';
    var total = 0;
    if(list.length === 0){
        container.innerHTML = '<div class="card"><p>Votre liste est vide.</p></div>';
    }
    list.forEach(function(it, idx){
        total += (parseFloat(it.price)||0) * (it.qty||1);
        var div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = '<div class="card-content"><h3 class="product-title">'+escapeHtml(it.title)+'</h3><p>' + (it.color?('Couleur: '+escapeHtml(it.color)+'<br/>'):'') + (it.size?('Taille: '+escapeHtml(it.size)+'<br/>'):'') + 'Prix: ' + (it.price||0) + ' €</p></div><div class="card-actions"><button data-index="'+idx+'" class="btn-secondary remove-item">Supprimer</button></div>';
        container.appendChild(div);
    });
    var totalEl = document.getElementById('wishlist-total');
    if(totalEl) totalEl.innerText = total.toFixed(2) + ' €';
}

document.addEventListener('click', function(e){
    var rem = e.target.closest && e.target.closest('.remove-item');
    if(!rem) return;
    var idx = parseInt(rem.getAttribute('data-index'));
    var list = getWishlist();
    if(!isNaN(idx) && list[idx]){ list.splice(idx,1); saveWishlist(list); renderWishlistToCardlist(); }
});

function escapeHtml(text){ return text ? String(text).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }) : ''; }

// Prepare form content when opening popup
function prepareOrderForm(){
    var list = getWishlist();
    var formProducts = list.map(function(it,i){ return (i+1)+'. '+it.title + (it.color?(' - Couleur: '+it.color):'') + (it.size?(' - Taille: '+it.size):'') + ' - Prix: ' + (it.price||0) + ' €'; }).join('\n');
    var total = list.reduce(function(acc,it){ return acc + (parseFloat(it.price)||0) * (it.qty||1); },0).toFixed(2);
    var productsField = document.getElementById('order_products');
    if(productsField) productsField.value = formProducts;
    var totalField = document.getElementById('order_total');
    if(totalField) totalField.value = total + ' €';
    var preview = document.getElementById('order_preview');
    if(preview) preview.innerText = formProducts + '\n\nTotal: ' + total + ' €';
}

document.addEventListener('DOMContentLoaded', function(){
    renderWishlistToCardlist();
    var buyBtn = document.getElementById('buy-now');
    if(buyBtn) buyBtn.addEventListener('click', function(e){
        e.preventDefault();
        prepareOrderForm();
        var modal = document.getElementById('order-modal');
        if(modal) modal.style.display = 'block';
        // preserve animations by adding class
        modal.classList.add('open');
    });
    var closeBtn = document.getElementById('order-close');
    if(closeBtn) closeBtn.addEventListener('click', function(){ document.getElementById('order-modal').style.display='none'; });
    // close modal when clicking outside content
    document.addEventListener('click', function(e){
        var modal = document.getElementById('order-modal');
        if(modal && modal.style.display==='block'){
            var content = modal.querySelector('.purchase-modal-content');
            if(content && !content.contains(e.target) && !e.target.closest('#buy-now')){
                modal.style.display='none';
            }
        }
    });
});
