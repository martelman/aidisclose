/**
 * Single source of truth for compliance-critical strings (Tier A — all 24 official EU languages).
 * Consumed by: snippet (inlined at build, parity-tested), scanner report summary, PDF export.
 * CI asserts key parity across locales.
 */

export const EU_LOCALES = [
  'bg', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'de', 'el', 'hu',
  'ga', 'it', 'lv', 'lt', 'mt', 'pl', 'pt', 'ro', 'sk', 'sl', 'es', 'sv',
] as const;
export type EuLocale = (typeof EU_LOCALES)[number];

/** Localized "AI" acronym per Code-of-Practice icon convention. Absent = "AI". */
export const ACRONYM: Partial<Record<EuLocale, string>> = {
  de: 'KI', fr: 'IA', es: 'IA', it: 'IA', pt: 'IA', ro: 'IA', pl: 'SI',
  fi: 'TEKOÄLY', el: 'ΤΝ', bg: 'ИИ', lv: 'MI', hu: 'MI', lt: 'DI', sl: 'UI',
  ga: 'IS', mt: 'IA',
};

export interface TierAStrings {
  /** 50(1) banner text */
  interact: string;
  /** badge tooltip on [data-ai-content] */
  content: string;
  /** dismiss label */
  close: string;
  /** scan report heading */
  reportTitle: string;
  /** conformance level label */
  levelLabel: string;
  /** evidence register label (PDF) */
  evidenceRegister: string;
  /** "generated at" timestamp label (PDF/report) */
  generatedAt: string;
  /** Made by humans badge label (publisher declares no AI) */
  humanMade: string;
  /** Site/page notice label for AI content published under human editorial review */
  reviewed: string;
}

export const STRINGS: Record<EuLocale, TierAStrings> = {
  bg: { interact: 'Взаимодействате със система с изкуствен интелект.', content: 'Съдържание, генерирано от ИИ', close: 'Затвори', reportTitle: 'Доклад за прозрачност относно ИИ', levelLabel: 'Ниво на съответствие', evidenceRegister: 'Регистър на доказателствата', generatedAt: 'Генерирано на', humanMade: "Създадено от хора", reviewed: "Създадено с помощта на ИИ, прегледано от човек" },
  hr: { interact: 'Komunicirate sa sustavom umjetne inteligencije.', content: 'Sadržaj generiran umjetnom inteligencijom', close: 'Zatvori', reportTitle: 'Izvješće o transparentnosti UI', levelLabel: 'Razina sukladnosti', evidenceRegister: 'Registar dokaza', generatedAt: 'Generirano', humanMade: "Izradili ljudi", reviewed: "Uz pomoć UI, pregledao čovjek" },
  cs: { interact: 'Komunikujete se systémem umělé inteligence.', content: 'Obsah vytvořený umělou inteligencí', close: 'Zavřít', reportTitle: 'Zpráva o transparentnosti AI', levelLabel: 'Úroveň shody', evidenceRegister: 'Registr důkazů', generatedAt: 'Vygenerováno', humanMade: "Vytvořeno lidmi", reviewed: "S pomocí AI, zkontrolováno člověkem" },
  da: { interact: 'Du interagerer med et AI-system.', content: 'AI-genereret indhold', close: 'Luk', reportTitle: 'AI-gennemsigtighedsrapport', levelLabel: 'Overensstemmelsesniveau', evidenceRegister: 'Evidensregister', generatedAt: 'Genereret', humanMade: "Skabt af mennesker", reviewed: "AI-assisteret, menneskeligt gennemgået" },
  nl: { interact: 'U communiceert met een AI-systeem.', content: 'Door AI gegenereerde inhoud', close: 'Sluiten', reportTitle: 'AI-transparantierapport', levelLabel: 'Conformiteitsniveau', evidenceRegister: 'Bewijsregister', generatedAt: 'Gegenereerd op', humanMade: "Door mensen gemaakt", reviewed: "AI-ondersteund, door mensen gecontroleerd" },
  en: { interact: 'You are interacting with an AI system.', content: 'AI-generated content', close: 'Close', reportTitle: 'AI transparency report', levelLabel: 'Conformance level', evidenceRegister: 'Evidence register', generatedAt: 'Generated at', humanMade: "Made by humans", reviewed: "AI-assisted, human-reviewed" },
  et: { interact: 'Suhtlete tehisintellekti süsteemiga.', content: 'Tehisintellekti loodud sisu', close: 'Sulge', reportTitle: 'Tehisintellekti läbipaistvusaruanne', levelLabel: 'Vastavustase', evidenceRegister: 'Tõendite register', generatedAt: 'Genereeritud', humanMade: "Inimeste loodud", reviewed: "Tehisintellekti abil, inimese kontrollitud" },
  fi: { interact: 'Olet vuorovaikutuksessa tekoälyjärjestelmän kanssa.', content: 'Tekoälyn tuottama sisältö', close: 'Sulje', reportTitle: 'Tekoälyn läpinäkyvyysraportti', levelLabel: 'Vaatimustenmukaisuustaso', evidenceRegister: 'Todisterekisteri', generatedAt: 'Luotu', humanMade: "Ihmisen tekemä", reviewed: "Tekoälyavusteinen, ihmisen tarkistama" },
  fr: { interact: "Vous interagissez avec un système d'intelligence artificielle.", content: 'Contenu généré par IA', close: 'Fermer', reportTitle: 'Rapport de transparence IA', levelLabel: 'Niveau de conformité', evidenceRegister: 'Registre de preuves', generatedAt: 'Généré le', humanMade: "Fait par des humains", reviewed: "Assisté par IA, revu par un humain" },
  de: { interact: 'Sie interagieren mit einem KI-System.', content: 'KI-generierter Inhalt', close: 'Schließen', reportTitle: 'KI-Transparenzbericht', levelLabel: 'Konformitätsstufe', evidenceRegister: 'Nachweisregister', generatedAt: 'Erstellt am', humanMade: "Von Menschen gemacht", reviewed: "KI-unterstützt, von Menschen geprüft" },
  el: { interact: 'Αλληλεπιδράτε με σύστημα τεχνητής νοημοσύνης.', content: 'Περιεχόμενο που δημιουργήθηκε από ΤΝ', close: 'Κλείσιμο', reportTitle: 'Έκθεση διαφάνειας ΤΝ', levelLabel: 'Επίπεδο συμμόρφωσης', evidenceRegister: 'Μητρώο αποδεικτικών στοιχείων', generatedAt: 'Δημιουργήθηκε', humanMade: "Ανθρώπινη δημιουργία", reviewed: "Με τη βοήθεια ΤΝ, ελεγμένο από άνθρωπο" },
  hu: { interact: 'Ön egy mesterségesintelligencia-rendszerrel kommunikál.', content: 'MI által generált tartalom', close: 'Bezárás', reportTitle: 'MI-átláthatósági jelentés', levelLabel: 'Megfelelőségi szint', evidenceRegister: 'Bizonyítéknyilvántartás', generatedAt: 'Létrehozva', humanMade: "Ember alkotta", reviewed: "MI-vel segített, ember által ellenőrzött" },
  ga: { interact: 'Tá tú ag idirghníomhú le córas intleachta saorga.', content: 'Ábhar ginte ag IS', close: 'Dún', reportTitle: 'Tuarascáil trédhearcachta IS', levelLabel: 'Leibhéal comhréireachta', evidenceRegister: 'Clár fianaise', generatedAt: 'Ginte ar', humanMade: "Déanta ag daoine", reviewed: "Le cúnamh IS, athbhreithnithe ag duine" },
  it: { interact: 'Stai interagendo con un sistema di intelligenza artificiale.', content: 'Contenuto generato dall’IA', close: 'Chiudi', reportTitle: 'Rapporto di trasparenza IA', levelLabel: 'Livello di conformità', evidenceRegister: 'Registro delle evidenze', generatedAt: 'Generato il', humanMade: "Fatto da umani", reviewed: "Assistito dall'IA, revisionato da persone" },
  lv: { interact: 'Jūs sazināties ar mākslīgā intelekta sistēmu.', content: 'MI ģenerēts saturs', close: 'Aizvērt', reportTitle: 'MI pārredzamības ziņojums', levelLabel: 'Atbilstības līmenis', evidenceRegister: 'Pierādījumu reģistrs', generatedAt: 'Izveidots', humanMade: "Cilvēku radīts", reviewed: "Ar MI palīdzību, cilvēka pārbaudīts" },
  lt: { interact: 'Jūs bendraujate su dirbtinio intelekto sistema.', content: 'DI sugeneruotas turinys', close: 'Uždaryti', reportTitle: 'DI skaidrumo ataskaita', levelLabel: 'Atitikties lygis', evidenceRegister: 'Įrodymų registras', generatedAt: 'Sugeneruota', humanMade: "Sukurta žmonių", reviewed: "Su DI pagalba, patikrinta žmogaus" },
  mt: { interact: 'Qed tinteraġixxi ma’ sistema tal-intelliġenza artifiċjali.', content: 'Kontenut iġġenerat mill-IA', close: 'Agħlaq', reportTitle: 'Rapport tat-trasparenza tal-IA', levelLabel: 'Livell ta’ konformità', evidenceRegister: 'Reġistru tal-evidenza', generatedAt: 'Iġġenerat fi', humanMade: "Maħluq mill-bniedem", reviewed: "Megħjun mill-IA, rivedut minn bniedem" },
  pl: { interact: 'Rozmawiasz z systemem sztucznej inteligencji.', content: 'Treść wygenerowana przez SI', close: 'Zamknij', reportTitle: 'Raport przejrzystości SI', levelLabel: 'Poziom zgodności', evidenceRegister: 'Rejestr dowodów', generatedAt: 'Wygenerowano', humanMade: "Stworzone przez ludzi", reviewed: "Wspomagane przez SI, sprawdzone przez człowieka" },
  pt: { interact: 'Está a interagir com um sistema de inteligência artificial.', content: 'Conteúdo gerado por IA', close: 'Fechar', reportTitle: 'Relatório de transparência de IA', levelLabel: 'Nível de conformidade', evidenceRegister: 'Registo de evidências', generatedAt: 'Gerado em', humanMade: "Feito por humanos", reviewed: "Assistido por IA, revisto por humanos" },
  ro: { interact: 'Interacționați cu un sistem de inteligență artificială.', content: 'Conținut generat de IA', close: 'Închide', reportTitle: 'Raport de transparență IA', levelLabel: 'Nivel de conformitate', evidenceRegister: 'Registru de dovezi', generatedAt: 'Generat la', humanMade: "Creat de oameni", reviewed: "Asistat de IA, revizuit de oameni" },
  sk: { interact: 'Komunikujete so systémom umelej inteligencie.', content: 'Obsah vygenerovaný umelou inteligenciou', close: 'Zavrieť', reportTitle: 'Správa o transparentnosti UI', levelLabel: 'Úroveň zhody', evidenceRegister: 'Register dôkazov', generatedAt: 'Vygenerované', humanMade: "Vytvorené ľuďmi", reviewed: "S pomocou UI, skontrolované človekom" },
  sl: { interact: 'Komunicirate s sistemom umetne inteligence.', content: 'Vsebina, ustvarjena z UI', close: 'Zapri', reportTitle: 'Poročilo o preglednosti UI', levelLabel: 'Raven skladnosti', evidenceRegister: 'Register dokazov', generatedAt: 'Ustvarjeno', humanMade: "Ustvarili ljudje", reviewed: "Ob pomoči UI, pregledal človek" },
  es: { interact: 'Está interactuando con un sistema de inteligencia artificial.', content: 'Contenido generado por IA', close: 'Cerrar', reportTitle: 'Informe de transparencia de IA', levelLabel: 'Nivel de conformidad', evidenceRegister: 'Registro de evidencias', generatedAt: 'Generado el', humanMade: "Hecho por humanos", reviewed: "Asistido por IA, revisado por humanos" },
  sv: { interact: 'Du interagerar med ett AI-system.', content: 'AI-genererat innehåll', close: 'Stäng', reportTitle: 'AI-transparensrapport', levelLabel: 'Konformitetsnivå', evidenceRegister: 'Bevisregister', generatedAt: 'Genererad', humanMade: "Skapat av människor", reviewed: "AI-assisterad, granskad av människor" },
};

export function pickLocale(candidates: string[]): EuLocale {
  for (const c of candidates) {
    const two = c.slice(0, 2).toLowerCase() as EuLocale;
    if (EU_LOCALES.includes(two)) return two;
  }
  return 'en';
}
