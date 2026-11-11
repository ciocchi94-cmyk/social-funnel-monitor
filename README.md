# Social funnel · monitor giornaliero

Pagina semplice (2 file) per controllare ogni giorno le campagne social funnel di Meta.

- `index.html` → la pagina (non va mai toccata)
- `data.js` → i numeri: viene riscritto ogni giorno
- `REFRESH_TASK.md` → il testo del compito che aggiorna `data.js` ogni mattina

## Metterla online su Vercel (una volta sola, ~5 minuti)

1. Crea un repository su GitHub (privato va bene), es. `social-funnel-monitor`.
2. Carica dentro tutti i file e la cartella `api` del pacchetto (`index.html`, `data.js`, `knowledge.js`, `vercel.json`, `api/ask.js`, ...).
3. Su vercel.com: **Add New → Project → Import** il repository. Framework: *Other*. Nessuna build, nessuna impostazione. **Deploy**.
4. Apri l'indirizzo che ti dà Vercel dal telefono e dal PC. Su iPhone: Condividi → "Aggiungi a Home".
5. Ogni volta che `data.js` cambia su GitHub, Vercel ripubblica da solo in circa 20 secondi.

Se vuoi che la pagina non sia pubblica: Vercel → Settings → Deployment Protection.

## Attivare «Chiedi all'AI» (una volta sola, 2 minuti)

La sezione **Chiedi AI** è una chat addestrata su questo tema: conosce il tuo obiettivo, le regole delle ads Aura, la fase di apprendimento e i numeri di `data.js`.
Per farla funzionare su Vercel serve una chiave Anthropic:

1. Su console.anthropic.com crea una chiave API (ANTHROPIC_API_KEY).
2. Su Vercel: **Settings → Environment Variables** → nome `ANTHROPIC_API_KEY`, valore la tua chiave → **Save** → **Redeploy**.
3. Apri la pagina → tab **Chiedi AI**.

La chiave sta solo su Vercel (file `api/ask.js`), mai dentro la pagina. Costa pochi centesimi ogni giorno d'uso.
Consiglio: attiva **Deployment Protection** su Vercel, così la pagina e la chat le vedi solo tu.
Per cambiare cosa sa l'AI modifica `knowledge.txt` (testo semplice) e rigenera `knowledge.js` con `python3 build.py`, oppure chiedimi di farlo.

## Aggiornamento automatico ogni giorno

Il compito programmato (testo in `REFRESH_TASK.md`) ogni mattina:
legge i dati degli ultimi 3 giorni da Meta, riscrive `data.js` e lo manda su GitHub. Vercel fa il resto.
La pagina non contiene nessuna password di Meta: i dati sono solo numeri dentro `data.js`.

## Follower: dati veri di Meta

I follower sono quelli che Instagram attribuisce ai tuoi annunci (campo Meta `instagram_profile_follow_v2`, entro 1 giorno dal click).
Non devi scrivere nulla: il costo per follower è spesa ÷ follower di Meta. Il numero può essere un po' prudente
(chi ti segue dopo più di un giorno dal click non è contato).

## Le quattro pagine

- **Oggi**: verdetto, costo per follower di ogni campagna e gruppo, consigli pratici (compresi i gruppi da spegnere), grafico giorno per giorno.
- **Dettagli**: tutti gli altri numeri, ognuno con la spiegazione semplice accanto.
- **Note**: le tue annotazioni. Compaiono come ◆ sul grafico alla data scelta.
- **Chiedi AI**: chat per domande e consigli sulle campagne, con i tuoi dati di oggi.

## Obiettivo e regole

In `data.js`: `targets.followerMin/Max` = obiettivo di costo per follower (15–35 cent).
Un gruppo viene consigliato "da spegnere" se, con almeno 10 € spesi e 3 giorni di vita, costa oltre 45 cent a follower,
oppure più di 1,6 volte il migliore, oppure ha speso 5 € senza portare follower. Non vengono mai spenti tutti i gruppi insieme.
I gruppi con meno di 3 giorni sono "Nuovo · impara" e non vengono giudicati.

## Aggiornamento automatico
Ogni mattina alle 06:05 (ora italiana) un compito programmato rilegge da Meta gli ultimi giorni, aggiorna solo `data.js` e lo carica su `main`.
Vercel è collegato a questo repository: ogni push su `main` ripubblica la pagina da solo.
