# Compito giornaliero: aggiorna i dati del monitor

Esegui ogni giorno alle 06:30 (ora italiana).

Obiettivo: aggiornare `data.js` del repository `social-funnel-monitor` con i dati Meta Ads più recenti e pubblicarlo.

1. Con il connettore Meta Ads, account `1199731788104176`, leggi con `ads_get_ad_entities` e `time_increment: "1"`
   i dati giornalieri degli ultimi 3 giorni (ieri e i due precedenti; i giorni già presenti vanno sovrascritti perché Meta li corregge):
   - livello `campaign` (spesa, impression, reach, click, risultati, follower);
   - livello `adset` per la campagna `120251325492240121` (spesa, impression, click, risultati, follower, stato, budget giornaliero, data creazione).
   Per le campagne di traffico "risultati" = visite al profilo Instagram; per la leadgen = candidature.
   "Follower" = campo `instagram_profile_follow_v2` (Instagram follows, attribuzione 1d_click); per la leadgen metti 0.
2. In `data.js`: per ogni riga letta, sostituisci la riga con la stessa data oppure aggiungila (non saltare nessun giorno con spesa > 0).
   Formato campagne `[data, spesa, impression, reach, click, risultati, follower]`, formato ad set `[data, spesa, impression, click, risultati, follower]`.
3. Imposta `updated` alla data di ieri (AAAA-MM-GG).
4. Aggiorna stato (`ACTIVE`/`PAUSED`) e `budget` di campagne e gruppi. Se compare un gruppo nuovo, aggiungilo con `id`, `campaign`, `name`, `status`, `budget`, `created`.
5. Controlla che il file sia JavaScript valido, poi fai commit ("dati del GG/MM") e push su GitHub. Vercel pubblica da solo.
6. Scrivi in due righe cosa è cambiato (spesa di ieri, costo per follower (ieri e ultimi 7 giorni), eventuali gruppi nuovi o fermi).

Non modificare `index.html`. Non inventare numeri: se Meta non risponde, lascia `data.js` com'è e segnalalo.
