(() => {
  // Illustrative scenario only. No restaurant feed or AI service is connected.
  const state={covers:184,sales:6820,avgSales:6320,peak:'7:15 PM',foodCost:31.8,foodTarget:30,laborCost:22.1,laborTarget:23,weekSales:41200,primeCost:53.9};
  const inventory={mozzarella:{on:11,par:28,unit:'lb',price:7.40,vendor:'Supplier B'},tomatoes:{on:1.4,par:3,unit:'cases',price:43.20,vendor:'FreshCo'},oil:{on:5,par:4,unit:'gal',price:53.94,vendor:'PantryPro'},chicken:{on:26,par:24,unit:'lb',price:3.82,vendor:'FreshCo'}};
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const toast=$('#toast'); let toastTimer;
  function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200)}
  const progressBar=$('#scrollProgress'),backButton=$('#backToTop');
  const motionPreference=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
  let scrollQueued=false;
  function updateScrollUi(){
    const maxScroll=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
    progressBar.style.transform=`scaleX(${maxScroll?Math.min(1,Math.max(0,window.scrollY/maxScroll)):0})`;
    const visible=window.scrollY>520;
    backButton.classList.toggle('visible',visible);
    backButton.tabIndex=visible?0:-1;
    backButton.setAttribute('aria-hidden',visible?'false':'true');
    $('.site-header').classList.toggle('is-scrolled',window.scrollY>20);
  }
  function queueScrollUi(){if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;updateScrollUi()})}
  window.addEventListener('scroll',queueScrollUi,{passive:true});
  window.addEventListener('resize',queueScrollUi);
  backButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:motionPreference()}));
  queueScrollUi();
  function updateDay(){
    const now=new Date();
    const weekday=new Intl.DateTimeFormat('en-US',{weekday:'long'}).format(now);
    const date=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(now);
    $('#dayHeading').textContent=`Sample ${weekday} overview · ${date}`;
  }
  updateDay();
  window.addEventListener('focus',updateDay);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateDay()});
  setInterval(updateDay,60_000);
  function showView(name){$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));$('#mainNav').classList.remove('open');window.scrollTo({top:0,behavior:motionPreference()});history.replaceState(null,'',`#${name}`);queueScrollUi()}
  $$('.nav-switch').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  $('#mobileToggle').addEventListener('click',()=>$('#mainNav').classList.toggle('open'));
  const hash=location.hash.replace('#',''); if(['home','platform','demo','company','contact'].includes(hash)) showView(hash);
  function showPane(name){$$('.pane').forEach(p=>p.classList.toggle('active',p.id===`pane-${name}`));$$('.side-btn').forEach(b=>b.classList.toggle('active',b.dataset.pane===name));queueScrollUi()}
  $$('.side-btn').forEach(b=>b.addEventListener('click',()=>showPane(b.dataset.pane)));
  $$('.action-button').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.action;if(a==='order'){showPane('inventory');draftPO()}if(a==='prep')showPane('prep');if(a==='labor'){showPane('labor');$('#laborSaved').textContent='Recommendation loaded: move one server from 4–7 PM to 7–10 PM.';$('#laborSaved').classList.add('show')}}));
  $('#briefBtn').addEventListener('click',()=>{$('#briefCard').classList.toggle('show');$('#briefBtn').textContent=$('#briefCard').classList.contains('show')?'Hide daily brief':'Generate daily brief'});
  $('#refreshBtn').addEventListener('click',()=>{
    state.covers=184;state.sales=6820;
    $('#metricCovers').textContent=state.covers;$('#metricSales').textContent='$6.8K';
    $('#coverSlider').value=state.covers;$('#laborSlider').value=state.covers;updatePrep();updateLabor();updateDay();
    $('#refreshLabel').textContent='Sample scenario · offline';
    $('#poCard').classList.remove('show');$('#draftPoBtn').textContent='Draft optimized PO';
    $('#approvePoBtn').disabled=false;$('#approvePoBtn').textContent='Preview approval';
    $('#statusOrder').textContent='Review';$('#statusOrder').className='pill gold';
    $('#statusLabor').textContent='Attention';$('#statusLabor').className='pill red';
    $('#prepSent').classList.remove('show');$('#laborSaved').classList.remove('show');
    $('#invoiceResult').classList.remove('show');$('#invoiceBtn').disabled=false;$('#invoiceBtn').textContent='Generate sample invoice';invoiceIndex=0;
    showToast('Sample scenario reset');
  });
  function draftPO(){showPane('inventory');$('#poTotal').textContent=money(18*inventory.mozzarella.price+2*inventory.tomatoes.price);$('#poCard').classList.add('show');$('#draftPoBtn').textContent='PO drafted';$('#statusOrder').textContent='Drafted';$('#statusOrder').className='pill green';showToast('Sample purchase order drafted')}
  $('#draftPoBtn').addEventListener('click',draftPO);
  $('#approvePoBtn').addEventListener('click',()=>{$('#approvePoBtn').textContent='Approval previewed ✓';$('#approvePoBtn').disabled=true;showToast('Demo only · no order was sent')});
  const sampleInvoices=[
    {lines:['Roma tomatoes · 2 cases · $86.40','Olive oil · 1 gal · $53.94','Mozzarella · 10 lb · $74.00'],total:'$214.34'},
    {lines:['Roma tomatoes · 1 case · $43.20','Mozzarella · 12 lb · $88.80','Chicken breast · 20 lb · $76.40'],total:'$208.40'}
  ];
  let invoiceIndex=0;
  $('#invoiceBtn').addEventListener('click',()=>{
    const button=$('#invoiceBtn');button.disabled=true;button.textContent='Generating sample…';
    setTimeout(()=>{
      const sample=sampleInvoices[invoiceIndex%sampleInvoices.length];invoiceIndex++;
      $('#invoiceResult').textContent=`Sample invoice ${invoiceIndex} · illustrative data\n${sample.lines.join('\n')}\nTotal · ${sample.total}`;
      $('#invoiceResult').classList.add('show');button.disabled=false;button.textContent='Generate another sample';
      showToast('Sample invoice generated');
    },350);
  });
  const actionsKey='bistro-bud-demo-actions-v1';
  let addedActions=[];
  try {
    const saved=JSON.parse(localStorage.getItem(actionsKey)||'[]');
    if(Array.isArray(saved)) addedActions=saved.filter(a=>a&&typeof a.title==='string'&&typeof a.reason==='string'&&typeof a.id==='string').slice(0,30);
  } catch { /* Browser storage is optional for this demo. */ }
  function saveActions(){try{localStorage.setItem(actionsKey,JSON.stringify(addedActions))}catch{}}
  function renderActions(){
    const body=$('#priorityBody');body.querySelectorAll('[data-custom-id]').forEach(row=>row.remove());
    addedActions.forEach(action=>{
      const row=document.createElement('tr');row.dataset.customId=action.id;
      const name=document.createElement('td');name.textContent=action.title;
      const reason=document.createElement('td');reason.textContent=action.reason;
      const status=document.createElement('td');const badge=document.createElement('span');
      badge.className='pill '+(action.done?'green':'gold');badge.textContent=action.done?'Done':'To do';status.appendChild(badge);
      const controls=document.createElement('td');controls.className='priority-actions';
      for(const [op,label] of [['toggle',action.done?'Undo':'Done'],['remove','Remove']]){
        const button=document.createElement('button');button.type='button';button.className='btn btn-secondary btn-sm';button.dataset.customOp=op;button.textContent=label;controls.appendChild(button);
      }
      row.append(name,reason,status,controls);body.appendChild(row);
    });
  }
  $('#priorityForm').addEventListener('submit',event=>{
    event.preventDefault();const title=$('#priorityTitle').value.trim(),reason=$('#priorityReason').value.trim();
    if(!title||!reason)return;
    addedActions.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2),title:title.slice(0,70),reason:reason.slice(0,90),done:false});
    addedActions=addedActions.slice(0,30);saveActions();renderActions();event.target.reset();showToast('Priority action added');
  });
  $('#priorityBody').addEventListener('click',event=>{
    const button=event.target.closest('[data-custom-op]');if(!button)return;
    const row=button.closest('[data-custom-id]'),index=addedActions.findIndex(a=>a.id===row.dataset.customId);if(index<0)return;
    if(button.dataset.customOp==='remove')addedActions.splice(index,1);else addedActions[index].done=!addedActions[index].done;
    saveActions();renderActions();showToast(button.dataset.customOp==='remove'?'Action removed':'Action updated');
  });
  renderActions();
  // Personal demo inventory and order tracker. Only this browser stores these values.
  const inventoryKey='bistro-bud-custom-inventory-v1',ordersKey='bistro-bud-order-tracker-v1';
  const units=['each','lb','cases','gal'];
  function loadList(key,valid,limit){try{const result=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(result)?result.filter(valid).slice(0,limit):[]}catch{return []}}
  let customInventory=loadList(inventoryKey,a=>a&&typeof a.id==='string'&&typeof a.name==='string'&&Number.isFinite(a.on)&&a.on>=0&&Number.isFinite(a.par)&&a.par>0&&units.includes(a.unit),30);
  let orders=loadList(ordersKey,a=>a&&typeof a.id==='string'&&typeof a.name==='string'&&Number.isFinite(a.qty)&&a.qty>0&&units.includes(a.unit),50);
  const saveInventory=()=>{try{localStorage.setItem(inventoryKey,JSON.stringify(customInventory))}catch{}};
  const saveOrders=()=>{try{localStorage.setItem(ordersKey,JSON.stringify(orders))}catch{}};
  const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
  const fmtQty=n=>String(Number(n.toFixed(2)));
  function rowButton(action,label){const b=document.createElement('button');b.type='button';b.className='btn btn-secondary btn-sm';b.dataset.action=action;b.textContent=label;return b}
  function renderInventory(){
    const body=$('#inventoryBody');body.querySelectorAll('[data-inventory-id]').forEach(row=>row.remove());
    customInventory.forEach(item=>{
      const row=document.createElement('tr');row.dataset.inventoryId=item.id;row.className='custom-inventory-row';
      const name=document.createElement('td');name.textContent=item.name;const sub=document.createElement('span');sub.className='own-item';sub.textContent='Your entry';name.appendChild(sub);
      const stock=document.createElement('td');const input=document.createElement('input');input.type='number';input.min='0';input.max='100000';input.step='any';input.value=item.on;input.className='stock-input';input.setAttribute('aria-label',`On hand for ${item.name}`);stock.append(input,document.createTextNode(' '+item.unit));
      const par=document.createElement('td');par.textContent=fmtQty(item.par)+' '+item.unit;
      const vendor=document.createElement('td');vendor.textContent=item.vendor||'—';
      const status=document.createElement('td');const badge=document.createElement('span');const low=item.on<item.par;badge.className='pill '+(low?'gold':'green');badge.textContent=low?`${fmtQty(item.par-item.on)} ${item.unit} below par`:'At or above par';status.appendChild(badge);
      const controls=document.createElement('td');controls.className='row-controls';controls.append(rowButton('save-stock','Save stock'),rowButton('track-item','Track'),rowButton('remove-item','Remove'));
      row.append(name,stock,par,vendor,status,controls);body.appendChild(row);
    });
  }
  function renderOrders(){
    const body=$('#orderBody');body.replaceChildren();
    orders.forEach(item=>{
      const row=document.createElement('tr');row.dataset.orderId=item.id;
      const name=document.createElement('td');name.textContent=item.name;
      const qty=document.createElement('td');const input=document.createElement('input');input.type='number';input.min='0.01';input.max='100000';input.step='any';input.value=item.qty;input.className='order-qty-input';input.setAttribute('aria-label',`Order quantity for ${item.name}`);qty.append(input,document.createTextNode(' '+item.unit));
      const vendor=document.createElement('td');vendor.textContent=item.vendor||'—';
      const status=document.createElement('td');const badge=document.createElement('span');badge.className='pill '+(item.ordered?'green':'gold');badge.textContent=item.ordered?'Ordered':'To buy';status.appendChild(badge);
      const controls=document.createElement('td');controls.className='row-controls';controls.append(rowButton('save-qty','Save'),rowButton('toggle-order',item.ordered?'Mark to buy':'Mark ordered'),rowButton('remove-order','Remove'));
      row.append(name,qty,vendor,status,controls);body.appendChild(row);
    });
    const remaining=orders.filter(item=>!item.ordered).length;
    $('#trackerCount').textContent=`${remaining} to buy · ${orders.length-remaining} ordered`;
    $('#orderEmpty').hidden=orders.length>0;$('#orderTableWrap').hidden=orders.length===0;
  }
  function trackOrder(item){
    const existing=item.source&&orders.find(entry=>entry.source===item.source);
    if(existing){existing.qty=item.qty;existing.vendor=item.vendor;existing.ordered=false;showToast('Updated item on your order list')}
    else {if(orders.length>=50){showToast('Order list is full (50 items)');return}orders.unshift({id:newId(),name:item.name,qty:item.qty,unit:item.unit,vendor:item.vendor||'',source:item.source||null,ordered:false});showToast('Added to your order list')}
    saveOrders();renderOrders();$('#orderTracker').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  const sampleToTrack={mozzarella:{name:'Mozzarella',qty:18,unit:'lb',vendor:'Supplier B (sample)',source:'sample:mozzarella'},tomatoes:{name:'Roma tomatoes',qty:2,unit:'cases',vendor:'FreshCo (sample)',source:'sample:tomatoes'}};
  $$('#inventoryBody .track-sample').forEach(button=>button.addEventListener('click',()=>trackOrder(sampleToTrack[button.dataset.sample])));
  $('#inventoryForm').addEventListener('submit',event=>{
    event.preventDefault();const name=$('#inventoryItem').value.trim(),on=Number($('#inventoryOn').value),par=Number($('#inventoryPar').value),unit=$('#inventoryUnit').value,vendor=$('#inventoryVendor').value.trim();
    if(!name||!Number.isFinite(on)||on<0||on>100000||!Number.isFinite(par)||par<=0||par>100000||!units.includes(unit))return;
    if(customInventory.length>=30){showToast('Inventory is full (30 items)');return}
    customInventory.push({id:newId(),name:name.slice(0,70),on,par,unit,vendor:vendor.slice(0,70)});
    saveInventory();renderInventory();event.target.reset();showToast('Inventory item added');
  });
  $('#inventoryBody').addEventListener('click',event=>{
    const button=event.target.closest('[data-action]'),row=button?.closest('[data-inventory-id]');if(!row)return;
    const index=customInventory.findIndex(item=>item.id===row.dataset.inventoryId);if(index<0)return;
    const item=customInventory[index];
    if(button.dataset.action==='remove-item'){customInventory.splice(index,1);saveInventory();renderInventory();showToast('Inventory item removed');return}
    if(button.dataset.action==='save-stock'){
      const raw=row.querySelector('.stock-input').value,value=Number(raw);
      if(raw===''||!Number.isFinite(value)||value<0||value>100000){showToast('Enter a valid stock quantity');return}
      item.on=value;saveInventory();renderInventory();showToast('Stock count updated');return;
    }
    if(button.dataset.action==='track-item'){
      trackOrder({name:item.name,qty:item.par>item.on?Math.max(.01,Number((item.par-item.on).toFixed(2))):1,unit:item.unit,vendor:item.vendor,source:'custom:'+item.id});
    }
  });
  $('#orderForm').addEventListener('submit',event=>{
    event.preventDefault();const name=$('#orderItem').value.trim(),qty=Number($('#orderQty').value),unit=$('#orderUnit').value,vendor=$('#orderVendor').value.trim();
    if(!name||!Number.isFinite(qty)||qty<=0||qty>100000||!units.includes(unit))return;
    trackOrder({name:name.slice(0,70),qty,unit,vendor:vendor.slice(0,70)});event.target.reset();
  });
  $('#orderBody').addEventListener('click',event=>{
    const button=event.target.closest('[data-action]'),row=button?.closest('[data-order-id]');if(!row)return;
    const index=orders.findIndex(item=>item.id===row.dataset.orderId);if(index<0)return;
    const item=orders[index];
    if(button.dataset.action==='remove-order'){orders.splice(index,1);showToast('Order item removed')}
    else if(button.dataset.action==='toggle-order'){item.ordered=!item.ordered;showToast(item.ordered?'Marked ordered · no order was sent':'Moved back to buy list')}
    else if(button.dataset.action==='save-qty'){
      const raw=row.querySelector('.order-qty-input').value,value=Number(raw);
      if(raw===''||!Number.isFinite(value)||value<=0||value>100000){showToast('Enter a valid order quantity');return}
      item.qty=value;showToast('Order quantity updated');
    }
    saveOrders();renderOrders();
  });
  renderInventory();renderOrders();
  function prepFor(c){return {pasta:Math.round(c*.68),sauce:(c*.045).toFixed(1),cheese:(c*.095).toFixed(1),chicken:Math.round(c*.31)}}
  function updatePrep(){const c=Number($('#coverSlider').value);$('#coverValue').textContent=c;const p=prepFor(c);$('#prepPasta').textContent=p.pasta+' portions';$('#prepSauce').textContent=p.sauce+' qt';$('#prepCheese').textContent=p.cheese+' lb';$('#prepChicken').textContent=p.chicken+' portions'}
  $('#coverSlider').addEventListener('input',updatePrep);updatePrep();
  $('#sendPrepBtn').addEventListener('click',()=>{const c=Number($('#coverSlider').value);$('#prepSent').textContent=`Kitchen handoff preview for ${c} covers. No message was sent.`;$('#prepSent').classList.add('show');showToast('Sample prep handoff previewed')});
  function laborFor(c){return {servers:Math.max(3,Math.ceil(c/38)),cooks:Math.max(2,Math.ceil(c/48)),rate:Math.min(26,Math.max(18,21.8+(c-170)*.02)).toFixed(1)}}
  function updateLabor(){
    const c=Number($('#laborSlider').value),l=laborFor(c),early=Math.max(2,l.servers-2);
    $('#laborCovers').textContent=c;$('#serverCount').textContent=l.servers;$('#cookCount').textContent=l.cooks;$('#laborRate').textContent=l.rate+'%';
    $('#earlyPlan').textContent=early;$('#latePlan').textContent=l.servers;$('#cookPlan').textContent=l.cooks;
    $('#earlyReason').textContent=early===3?'One server starts later':early<4?'Match lower demand':'Hold early coverage';
    $('#lateReason').textContent=l.servers>4?'More coverage at 7:15 PM':l.servers<4?'Match lower demand':'Hold peak coverage';
    $('#cookReason').textContent=l.cooks===4?'Coverage stays the same':l.cooks>4?'Add cooks for demand':'Fewer cooks needed';
  }
  $('#laborSlider').addEventListener('input',updateLabor);updateLabor();
  $('#saveLaborBtn').addEventListener('click',()=>{const c=Number($('#laborSlider').value),l=laborFor(c);$('#laborSaved').textContent=`Schedule preview for ${c} covers: ${l.servers} servers, ${l.cooks} line cooks, projected labor ${l.rate}%. No schedule was saved.`;$('#laborSaved').classList.add('show');$('#statusLabor').textContent='Previewed';$('#statusLabor').className='pill green';showToast('Sample schedule previewed')});
  $('#reportBtn').addEventListener('click',()=>{$('#reportBox').classList.toggle('show');$('#reportBtn').textContent=$('#reportBox').classList.contains('show')?'Hide report':'Generate report'});
  function money(n){return '$'+n.toFixed(2)}
  function reply(q){
    const x=q.toLowerCase(); const n=(x.match(/\b(\d{2,3})\s*(?:covers|guests|people)?\b/)||[])[1]; const c=n?Math.max(40,Math.min(500,Number(n))):state.covers; const p=prepFor(c); const l=laborFor(c);
    if(/attention|priority|focus|today|tonight|brief|summary/.test(x)) return `Top 3 priorities in this sample:\n1) Inventory — mozzarella is 17 lb below par. Draft 18 lb from Supplier B before the cutoff.\n2) Prep — rigatoni demand is 14% above baseline, so add about 18 portions at the ${state.covers}-cover forecast.\n3) Labor — demand peaks at ${state.peak}; preview moving one server from 4–7 PM to 7–10 PM.\n\nFood cost is ${state.foodCost}% vs a ${state.foodTarget}% target, while labor is within target.`;
    if(/order|inventory|stock|buy|purchase/.test(x)){const mozCost=18*inventory.mozzarella.price, tomCost=2*inventory.tomatoes.price;return `Sample order draft:\n• Mozzarella: 18 lb from Supplier B ≈ ${money(mozCost)}\n• Roma tomatoes: 2 cases from FreshCo ≈ ${money(tomCost)}\n• Total ≈ ${money(mozCost+tomCost)}\n\nMozzarella is 11 lb on hand vs a 28 lb par, and tomatoes are 1.4 cases vs a 3-case par. Chicken and olive oil are above par, so neither is in the order.`}
    if(/vendor|supplier|price|cheapest/.test(x)) return `Supplier B's $7.40/lb mozzarella figure is an illustrative quote, not a live local price. To compare real vendors, connect the restaurant's own supplier order guides or invoices, normalize pack sizes, and include delivery terms and a quote date.`;
    if(/food cost|cost|margin|profit|prime/.test(x)) return `In this sample, food cost is ${state.foodCost}%, or ${(state.foodCost-state.foodTarget).toFixed(1)} points above the ${state.foodTarget}% target. The largest listed price changes are mozzarella (+18%) and chicken (+7%).\n\nLabor cost is ${state.laborCost}% and prime cost is ${state.primeCost}% (${state.foodCost}% + ${state.laborCost}%), below the 55% target.`;
    if(/staff|schedule|labor|server|cook/.test(x)) return `For ${c} sample covers, the calculator suggests ${l.servers} servers and ${l.cooks} line cooks, with projected labor near ${l.rate}%. The baseline ${state.covers}-cover scenario shows a 7:15 PM peak and previews moving one server from 4–7 PM to 7–10 PM.`;
    if(/prep|pasta|rigatoni|sauce|cheese/.test(x)) return `Prep plan for ${c} covers:\n• Pasta: ${p.pasta} portions\n• Marinara: ${p.sauce} qt\n• Mozzarella: ${p.cheese} lb\n• Chicken: ${p.chicken} portions\n\nRigatoni demand is the main watch item because it is forecast about 14% above normal.`;
    if(/sales|revenue|forecast|busy|demand|covers|guests/.test(x)) return `The sample scenario forecasts ${state.covers} covers and $${state.sales.toLocaleString()} in sales, about ${Math.round((state.sales/state.avgSales-1)*100)}% above its $${state.avgSales.toLocaleString()} baseline. The example peak is ${state.peak}. These figures do not update from live sales.`;
    if(/waste|wasted|spoil/.test(x)) return `Two inventory items are flagged for review in this sample. Prep based on the sample ${state.covers}-cover forecast yields ${p.pasta} pasta portions and ${p.chicken} chicken portions. Actual waste would need real sales and spoilage data.`;
    if(/menu|popular|seller|dish|item/.test(x)) return `Rigatoni is the strongest sample demand signal tonight at roughly +14% versus normal. That is why Bud recommends increasing pasta prep before the 7:15 PM peak instead of spreading extra prep evenly across the menu.`;
    if(/invoice/.test(x)) return `Click Generate sample invoice to cycle through two prepared examples. This demo does not upload or scan a real invoice. For a real restaurant, uploaded invoice lines would need validation against its inventory and supplier quotes.`;
    return `I can answer from the restaurant data shown in this demo. Try asking:\n• “What should I focus on tonight?”\n• “What should I order?”\n• “How many servers for 220 covers?”\n• “Why is food cost high?”\n• “What should I prep for 200 covers?”`;
  }
  function sendChat(text){const input=$('#chatInput'),log=$('#chatLog');const q=(text||input.value).trim();if(!q)return;const u=document.createElement('div');u.className='bubble user';u.textContent=q;log.appendChild(u);input.value='';setTimeout(()=>{const b=document.createElement('div');b.className='bubble bud';b.textContent=reply(q);log.appendChild(b);log.scrollTop=log.scrollHeight},180);log.scrollTop=log.scrollHeight}
  $('#chatSend').addEventListener('click',()=>sendChat());$('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});$$('.quick-prompt').forEach(b=>b.addEventListener('click',()=>sendChat(b.textContent)));
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}});
    },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
    $$('.section-head,.stat-item,.feature-card,.workflow-step,.quote-card,.list-row,.company-card,.contact-card').forEach((element,index)=>{
      element.classList.add('reveal-ready');element.style.setProperty('--reveal-delay',`${(index%3)*60}ms`);revealObserver.observe(element);
    });
  }
  $('#contactForm').addEventListener('submit',e=>{e.preventDefault();const subject='Bistro Bud demo request';const body=`Name: ${$('#name').value.trim()}\nRestaurant / organization: ${$('#restaurant').value.trim()}\nRole: ${$('#role').value}\n\nOperational challenge:\n${$('#need').value.trim() || '(not specified)'}`;$('#formSuccess').classList.add('show');window.location.href=`mailto:bistrobud@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
})();
