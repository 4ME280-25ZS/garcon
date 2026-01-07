// Simple static wishlist: state encoded in URL hash as base64 JSON
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

function decodeStateFromHash(){
  try{
    if(!location.hash) return {};
    const raw = decodeURIComponent(location.hash.slice(1));
    const json = atob(raw);
    return JSON.parse(json);
  }catch(e){
    return {};
  }
}

function encodeStateToHash(state){
  const json = JSON.stringify(state);
  const b = btoa(json);
  location.hash = encodeURIComponent(b);
}

function render(){
  const state = decodeStateFromHash();
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
      btn.onclick = ()=>{
        // allow anyone to release
        delete state[item.id];
        encodeStateToHash(state);
        render();
      };
      control.appendChild(r); control.appendChild(btn);
    } else {
      const btn = document.createElement('button'); btn.className='btn btn-reserve'; btn.textContent='Rezervovat';
      btn.onclick = ()=>{
        const name = prompt('Zadej své jméno (bude zobrazeno u položky):');
        if(!name) return;
        // simple atomic-ish check: re-decode and set
        const s2 = decodeStateFromHash();
        if(s2[item.id]){ alert('Položku už mezitím někdo rezervoval.'); render(); return; }
        s2[item.id]=name.trim();
        encodeStateToHash(s2);
        render();
      };
      control.appendChild(btn);
    }

    el.appendChild(meta); el.appendChild(control);
    listEl.appendChild(el);
  });
}

// Note: copy/reset controls removed — state is edited directly in the URL hash

window.addEventListener('hashchange', render);
render();
