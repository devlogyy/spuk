// Curated set of letter combinations that get searched as "unscramble X" / "anagram of X".
// Mix of common 5-8 letter words + popular game racks. Used to enumerate /unscramble/:letters routes.

export const POPULAR_RACKS: string[] = [
  // 5-letter (Wordle-adjacent)
  "stare","crate","arose","raise","slate","trace","adieu","audio","later","heart",
  "earth","table","plate","share","spare","alone","along","story","horse","house",
  "happy","money","music","peace","power","point","price","right","round","scene",
  "smile","sound","space","speak","stage","stand","start","state","stone","style",
  "teach","thank","think","three","throw","under","value","voice","water","white",
  "world","write","young","beach","brain","bread","break","brown","build","catch",
  "chair","chart","cheap","check","child","clear","climb","close","cloud","color",
  "coast","could","count","cover","craft","crash","cream","crime","cross","crowd",
  "crown","daily","dance","death","depth","doubt","dream","drink","drive","early",
  "earth","empty","enjoy","enter","entry","equal","event","every","exact","exist",
  "extra","faith","false","fault","field","fight","final","first","floor","focus",
  "force","frame","fresh","front","fruit","funny","ghost","giant","glass","grade",
  "grand","grant","grass","great","green","group","guard","guess","guest","guide",
  "heart","heavy","honor","human","ideal","image","index","input","issue","japan",
  "joint","judge","known","label","large","laugh","layer","leaf","learn","least",
  "leave","legal","level","light","limit","local","logic","loose","lower","lucky",
  "magic","major","march","match","metal","might","minor","minus","model","money",
  "month","moral","motor","mount","mouse","mouth","movie","music","needs","nerve",
  "never","newly","night","noble","noise","north","novel","nurse","occur","ocean",
  // 6-letter
  "listen","silent","master","stream","planet","random","scream","silver","summer","winter",
  "garden","forest","branch","bridge","castle","circus","cinema","danger","dragon","dinner",
  "doctor","driver","editor","engine","family","father","figure","finger","flight","flower",
  "friend","future","ground","growth","health","height","hidden","honest","income","island",
  "junior","kitchen","ladder","letter","liquid","listen","little","lonely","longer","manner",
  "market","matter","memory","method","middle","minute","mirror","modern","moment","mother",
  "motion","murder","muscle","museum","mutual","myself","nation","native","nature","nearby",
  "needle","normal","number","object","office","online","option","orange","origin","output",
  "oxygen","palace","parent","partly","passed","patient","pencil","period","person","picked",
  "pickup","planet","player","please","plenty","police","policy","powder","prefer","pretty",
  "prince","prison","public","punish","puzzle","quarter","random","rather","reader","really",
  // 7-letter
  "rainbow","silence","journey","mystery","kingdom","library","machine","measure","morning","network",
  "october","passage","perfect","picture","pioneer","plastic","popular","present","problem","produce",
  "promise","protect","provide","quality","quarter","reality","receive","record","reduce","respect",
  "respond","results","retired","return","reveal","review","reward","rocket","rocket","saturday",
  "science","scratch","section","service","several","setting","shadow","silver","similar","singer",
  "sixteen","sketch","slowly","smooth","social","society","soldier","solving","special","stadium",
  "station","stretch","student","studio","subject","success","summer","sunday","support","surface",
  "survey","systems","teacher","theory","therapy","theme","through","tonight","trouble","unknown",
  "useful","victory","village","virtual","volume","wedding","welcome","whisper","whisper","witness",
  // 8-letter and popular game racks
  "abstract","absolute","accident","activate","addition","adequate","airplane","alphabet","analyze","appendix",
  "approach","argument","attached","aviation","baseball","beautiful","birthday","birthday","brighter","building",
  "calendar","campaign","capacity","carrying","champion","children","choosing","civilian","climbing","computer",
  "concrete","contains","continue","creative","creature","critical","cultural","curtains","decision","describe",
  "designed","detailed","diameter","dialogue","directly","discount","distance","district","drawings","drinking",
  "duration","economic","educated","elephant","engineer","entirely","equation","estimate","everyone","exchange",
  "exciting","exercise","exterior","favorite","favourable","festival","football","forecast","frequent","friendly",
  "frontier","gathered","generate","genuinely","governor","graduate","greatest","habitual","happened","headline",
  "hospital","houseful","humanity","identity","imagine","increase","industry","interior","invented","involves",
  "judgment","keyboard","language","laughter","lifelong","listened","location","magazine","majority","material",
  // common Scrabble racks
  "retains","stainer","plates","listening","integral","triangle","altering","relating","alerting","tangier",
  "tearing","reading","engineer","stranger","retiring","training","painters","creates","catered","reacted"
];

// Deduplicate while preserving order and uppercase.
export const POPULAR_RACKS_UNIQUE = Array.from(new Set(POPULAR_RACKS.map((r) => r.toLowerCase())));
