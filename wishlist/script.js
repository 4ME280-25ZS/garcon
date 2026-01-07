// Supabase-enabled wishlist client
// Supabase project credentials (anon/public key)
const SUPABASE_URL = 'https://ixgcnewjqpoptiynnzbx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Wwil1CxCGCArGLAIHrZXcA_whzPZ8-N';

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ITEMS = [
  { id: 'g1', title: 'Kniha: Moderní JavaScript', desc: 'Dobrá kniha o moderním JS a best practices.' },
  { id: 'g2', title: 'Bluetooth sluchátka', desc: 'Bezdrátová sluchátka s dobrým ANC.' },
  { id: 'g3', title: 'Termo hrnek', desc: 'Dlouho udrží kávu teplou.' },
  { id: 'g4', title: 'Stolní rostlina', desc: 'Malá rostlinka na stůl do práce.' },
  { id: 'g5', title: 'Dárková karta na knihy', desc: 'Poukázka do místního knihkupectví.' },
  { id: 'g6', title: 'Powerbanka 10 000 mAh', desc: 'Praktická powerbanka na cesty.' },
  { id: 'g7', title: 'Přenosný reproduktor', desc: 'Malý reproduktor s dobrou výdrží baterie.' },
  { id: 'g8', title: 'Kreativní den v ateliéru', desc: 'Kurz nebo workshop na jeden den.' },
  { id: 'g9', title: 'Stojan na kola do bytu', desc: 'Praktické řešení na úsporu místa.' },
  { id: 'g10', title: 'Kvalitní zápisník', desc: 'Moleskine nebo ekvivalent pro poznámky.' }
];

const listEl = document.getElementById('list');

async function loadReservations(){
  try{
    const { data, error } = await supabase.from('reservations').select('item_id,reserved_by');
    if(error){
      console.warn('Supabase read error', error);
      return {};
    }
    const map = {};
    data.forEach(r => { if(r.item_id) map[r.item_id] = r.reserved_by; });
    return map;
  }catch(e){
    console.error(e);
    return {};
  }
}

async function reserveRemote(itemId, name){
  try{
    const { data: rpcData, error: rpcErr } = await supabase.rpc('reserve_item', { p_item_id: itemId, p_name: name });
    if(rpcErr){
      const { data, error } = await supabase.from('reservations').insert({ item_id: itemId, reserved_by: name });
      if(error) return { ok:false, reason: error.message };
      return { ok:true };
    }
    if(rpcData && rpcData[0] && (rpcData[0].success === true || rpcData.success === true)) return { ok:true };
    return { ok:false, reason:'already_reserved' };
  }catch(e){
    return { ok:false, reason: e.message };
  }
}

async function releaseRemote(itemId){
  try{
    const { error: rpcErr } = await supabase.rpc('release_item', { p_item_id: itemId });
    if(rpcErr){
      const { error } = await supabase.from('reservations').delete().eq('item_id', itemId);
      if(error) throw error;
    }
    return true;
  }catch(e){
    console.error('release error', e);
    return false;
  }
}

async function render(){
  const state = await loadReservations();
  listEl.innerHTML = '';
  ITEMS.forEach(item=>{
    const el = document.createElement('div'); el.className='item';
    const meta = document.createElement('div'); meta.className='meta';
    const title = document.createElement('div'); title.className='title'; title.textContent = item.title;
    const desc = document.createElement('div'); desc.className='desc'; desc.textContent = item.desc;
    meta.appendChild(title); meta.appendChild(desc);

    const control = document.createElement('div');
    const reservedBy = state[item.id];
    if(reservedBy){
      const r = document.createElement('div'); r.className='reserved'; r.textContent = 'Rezervováno: ' + reservedBy;
      const btn = document.createElement('button'); btn.className='btn btn-release'; btn.textContent='Uvolnit';
      btn.onclick = async ()=>{
        const ok = await releaseRemote(item.id);
        if(ok) render(); else alert('Chyba při uvolňování.');
      };
      control.appendChild(r); control.appendChild(btn);
    } else {
      const btn = document.createElement('button'); btn.className='btn btn-reserve'; btn.textContent='Rezervovat';
      btn.onclick = async ()=>{
        const name = prompt('Zadej své jméno (bude zobrazeno u položky):');
        if(!name) return;
        const result = await reserveRemote(item.id, name.trim());
        if(result.ok){ render(); } else if(result.reason==='already_reserved'){ alert('Položku už mezitím někdo rezervoval.'); render(); } else { alert('Chyba: '+(result.reason||'unknown')); }
      };
      control.appendChild(btn);
    }

    el.appendChild(meta); el.appendChild(control);
    listEl.appendChild(el);
  });
}

window.addEventListener('load', render);

