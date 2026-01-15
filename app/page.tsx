"use client";

import { useState } from "react";

// --- DONNÉES ---
const DATA_SEMESTRES: Record<string, UE[]> = {
  s1: [
    { id: "Panier 1", titre: "Sciences de l'Ingénieur 1", matieres: [{ matiere: "Mathématiques de l'Ingénieur", coef: 2, cc: "", exam: "" }, { matiere: "Analyse Numérique 1", coef: 2, cc: "", exam: "" }] },
    { id: "Panier 2", titre: "Informatique 1", matieres: [{ matiere: "Algorithmique & Structure de données", coef: 3, cc: "", exam: "" }, { matiere: "Programmation C", coef: 3, cc: "", exam: "" }] },
    { id: "Panier 3", titre: "Génie Logiciel & Logique", matieres: [{ matiere: "Logique Formelle", coef: 2, cc: "", exam: "" }, { matiere: "Génie Logiciel", coef: 3, cc: "", exam: "" }] },
    { id: "Panier 4", titre: "Systèmes Électroniques", matieres: [{ matiere: "Circuits electroniques & quantique", coef: 2, cc: "", exam: "" }, { matiere: "Circuits numériques & éléments d'architecture", coef: 3, cc: "", exam: "" }] },
    { id: "Panier 5", titre: "Réseaux & Information", matieres: [{ matiere: "Théorie de l'information", coef: 2, cc: "", exam: "" }, { matiere: "Fondement des réseaux TCP/IP", coef: 3, cc: "", exam: "" }] },
    { id: "Panier 6", titre: "Langues et Culture", matieres: [{ matiere: "Economie de l'Entreprise", coef: 2, cc: "", exam: "" }, { matiere: "Basic English", coef: 1.5, cc: "", exam: "" }, { matiere: "Culture et Communication 1", coef: 1.5, cc: "", exam: "" }] },
  ],
  s2: [
    { id: "Panier 7", titre: "Sciences de l'Ingénieur 2", matieres: [{ matiere: "Probabilités & Statistiques", coef: 1.5, cc: "", exam: "" }, { matiere: "Processus Stochastiques", coef: 1.5, cc: "", exam: "" }, { matiere: "Analyse Numérique 2", coef: 2, cc: "", exam: "" }] },
    { id: "Panier 8", titre: "Informatique 2", matieres: [{ matiere: "Algorithmique avancée & complexité", coef: 3, cc: "", exam: "" }, { matiere: "Programmation Orientée Objet C++", coef: 3, cc: "", exam: "" }] },
    { id: "Panier 9", titre: "Systèmes & Réseaux Avancés", matieres: [{ matiere: "Architecture des ordinateurs", coef: 3, cc: "" , exam: "" }, { matiere: "Réseaux avancés & Routage", coef: 3, cc: "", exam: "" }] },
    { id: "Panier 10", titre: "Développement Web & BD", matieres: [{ matiere: "Base de Données relationnelles", coef: 3, cc: "", exam: "" }, { matiere: "Analyse et conception des SI", coef: 2, cc: "", exam: "" }, { matiere: "Web Basics", coef: 1.5, cc: "", exam: "" }, { matiere: "Projet fédérateur", coef: 1.5, cc: "10", exam: "10" }] },
    { id: "Panier 11", titre: "Culture, Langues & Management", matieres: [{ matiere: "Théorie des Organisations", coef: 2, cc: "", exam: "" }, { matiere: "Professional English", coef: 1.5, cc: "", exam: "" }, { matiere: "Culture et Communication 2", coef: 1.5, cc: "", exam: "" }] },
  ]
};

interface Note { matiere: string; coef: number; cc: string; exam: string; }
interface UE { id: string; titre: string; matieres: Note[]; }
if (typeof document !== 'undefined') {
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.background = "#020617";
}
export default function Page() {
  const [config, setConfig] = useState({ niveau: "1", specialite: "gi", semestre: "" });
  const [ues, setUes] = useState<UE[]>([]);
  const [bilanActuel, setBilanActuel] = useState<{ moy: number; echecs: string[] } | null>(null);
  
  const [moyS1, setMoyS1] = useState("");
  const [moyS2, setMoyS2] = useState("");
  const [moyAnnuelle, setMoyAnnuelle] = useState<string | null>(null);

  const isDataAvailable = config.niveau === "1" && config.specialite === "gi";

  const handleSelectionSemestre = (s: string) => {
    setConfig({ ...config, semestre: s });
    if (isDataAvailable) {
      setUes(JSON.parse(JSON.stringify(DATA_SEMESTRES[s] || [])));
    } else {
      setUes([]);
    }
    setBilanActuel(null);
  };
const validerNote = (valeur: string): string => {
  const num = parseFloat(valeur);
  if (valeur === "") return ""; // Autorise le vide pour effacer
  if (isNaN(num)) return "";    // Empêche le texte
  if (num < 0) return "0";
  if (num > 20) return "20";
  return valeur;
};
 const calculerMoyMat = (cc: string, exam: string) => {
  const nCC = parseFloat(cc) || 0;
  const nExam = parseFloat(exam) || 0;
  return nCC * 0.35 + nExam * 0.65;
};
  const calculerSemestre = () => {
    let pts = 0, cfs = 0, ech: string[] = [];
    ues.forEach(ue => {
      let uPts = 0, uCfs = 0;
      ue.matieres.forEach(m => {
        const mY = calculerMoyMat(m.cc, m.exam);
        uPts += mY * m.coef; uCfs += m.coef;
        pts += mY * m.coef; cfs += m.coef;
      });
      if ((uPts / uCfs) < 10) ech.push(ue.id);
    });
    setBilanActuel({ moy: pts / cfs, echecs: ech });
  };

  const calculerAnnee = () => {
    const s1 = parseFloat(moyS1) || 0;
    const s2 = parseFloat(moyS2) || 0;
    setMoyAnnuelle(((s1 + s2) / 2).toFixed(2));
  };

  return (
    <div style={{ background: "#020617", minHeight: "100vh", padding: "20px", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <header style={{ textAlign: "center", marginBottom: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
  
  {/* HEADER */}
  <div style={logoRectWrapper}>
    <img src="/logo1.jpg" style={rectImg} alt="ENIC Logo" />
  </div>

  {/* PHOTO PERSONNELLE ET NOM */}
  <div style={{ marginTop: "25px", textAlign: "center" }}>
    <div style={profileRoundWrapper}>
      <img src="/me.jpg" style={roundImg} alt="Yasmine" />
    </div>
    <h2 style={{ fontSize: "1.1rem", marginTop: "12px", fontWeight: "700", color: "#fbbf24", letterSpacing: "0.5px" }}>
      Yasmine Gaida Mahjoub
    </h2>
    <p style={{ fontSize: "0.75rem", opacity: 0.6, textTransform: "uppercase" }}>Élève Ingénieur GI1</p>
  </div>

  <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: "900", marginTop: "20px" }}>ENICarthage</h1>
  <p style={{ color: "#3b82f6", fontWeight: "600" }}>Simulateur de Moyenne </p>
</header>

        {/* CONFIGURATION */}
        <section style={glassCard}>
          <div style={configGrid}>
            <div style={selectionGroup}>
                <label style={miniLabel}>Niveau d'étude</label>
                <div style={btnToggleGroup}>
                  <button onClick={() => setConfig({...config, niveau: "1", semestre: ""})} style={config.niveau === "1" ? activeBtn : inactiveBtn}>1ère année</button>
                  <button disabled style={disabledBtn}>2ème (Soon)</button>
                  <button disabled style={disabledBtn}>3ème (Soon)</button>
                </div>
            </div>

            <div style={selectionGroup}>
                <label style={miniLabel}>Spécialité</label>
                <div style={btnToggleGroup}>
                  <button onClick={() => setConfig({...config, specialite: "gi", semestre: ""})} style={config.specialite === "gi" ? activeBtn : inactiveBtn}>Génie Informatique</button>
              
                </div>
            </div>

            <div style={selectionGroup}>
                <label style={miniLabel}>Semestre</label>
                <div style={btnToggleGroup}>
                  {["s1", "s2"].map(s => (
                    <button key={s} onClick={() => handleSelectionSemestre(s)} style={config.semestre === s ? activeBtn : inactiveBtn}>S{s.slice(1)}</button>
                  ))}
                </div>
            </div>
          </div>
        </section>

        {/* AFFICHAGE DES MATIÈRES */}
        {config.semestre && isDataAvailable ? (
          <>
            <div style={responsiveGrid}>
              {ues.map((ue, uIdx) => {
                const totalPointsUE = ue.matieres.reduce((acc, m) => acc + (calculerMoyMat(m.cc, m.exam) * m.coef), 0);
                const totalCoeffUE = ue.matieres.reduce((acc, m) => acc + m.coef, 0);
                const moyenneUE = totalPointsUE / totalCoeffUE;
                const isEchec = bilanActuel && moyenneUE < 10;
                
                return (
                  <div key={ue.id} style={{ ...glassUECard, border: isEchec ? "2px solid #ef4444" : "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{...ueHeaderStyle, background: isEchec ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.1)"}}>
                      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{ue.id} : {ue.titre}</span>
                        {isEchec && <span style={{color: "#ef4444", fontSize: "0.75rem", fontWeight: "900", marginTop: "4px"}}>⚠️ PANIER À REFAIRE</span>}
                      </div>
                      
                      <div style={{
                        background: moyenneUE >= 10 ? "#059669" : "#dc2626",
                        color: "white", padding: "4px 10px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "bold"
                      }}>
                        {moyenneUE.toFixed(2)}
                      </div>
                    </div>
                    
                    <div style={{ padding: "15px" }}>
                      {ue.matieres.map((m, mIdx) => (
                        <div key={mIdx} style={matRowStyle}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{m.matiere} <span style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "bold" }}>(x{m.coef})</span></span>
                            <span style={{ color: "#fbbf24", fontWeight: "bold" }}>{calculerMoyMat(m.cc, m.exam).toFixed(2)}</span>
                          </div>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <input type="number" min="0" max="20" step="0.25" placeholder="DS" style={darkInput} value={m.cc} onChange={e => {
                               const n = [...ues]; n[uIdx].matieres[mIdx].cc =validerNote(e.target.value); setUes(n);
                            }} />
                            <input type="number" min="0" max="20" step="0.25" placeholder="Ex" style={darkInput} value={m.exam} onChange={e => {
                               const n = [...ues]; n[uIdx].matieres[mIdx].exam = validerNote(e.target.value); setUes(n);
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <button onClick={calculerSemestre} style={calculateBtn}>Calculer Moyenne {config.semestre.toUpperCase()}</button>
              {bilanActuel && (
                 <div style={resultBadge}>Moyenne Semestre : <span style={{ color: "#fbbf24" }}>{bilanActuel.moy.toFixed(2)}</span></div>
              )}
            </div>
          </>
        ) : config.semestre ? (
          <div style={emptyState}>Données non disponibles pour cette sélection (Coming Soon).</div>
        ) : null}

        {/* CALCUL ANNUEL : AFFICHER UNIQUEMENT SI S2 CHOISI */}
        {config.semestre === "s2" && (
          <section style={{ ...glassCard, marginTop: "50px", border: "1px solid #fbbf24" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#fbbf24", marginBottom: "20px", textAlign: "center" }}>🏆 Moyenne Générale Annuelle</h2>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-end" }}>
              <div style={selectionGroup}>
                <label style={miniLabel}>Moyenne S1</label>
                <input type="number" style={darkInputLarge} value={moyS1} onChange={e => setMoyS1(e.target.value)} placeholder="0.00" />
              </div>
              <div style={selectionGroup}>
                <label style={miniLabel}>Moyenne S2</label>
                <input type="number" style={darkInputLarge} value={moyS2} onChange={e => setMoyS2(e.target.value)} placeholder="0.00" />
              </div>
              <button onClick={calculerAnnee} style={annualBtn}>Calculer l'Année</button>
            </div>
            {moyAnnuelle && (
              <div style={finalResult}>Moyenne Générale : {moyAnnuelle}</div>
            )}
          </section>
        )}

        <footer style={{ textAlign: "center", marginTop: "60px", opacity: 0.5, fontSize: "0.8rem", paddingBottom: "40px" }}>
          Développé par Yasmine Gaida Mahjoub • GI1 • ENIC 2026
        </footer>
      </div>
    </div>
  );
}

// --- STYLES ---
const glassCard = { background: "rgba(30, 41, 59, 0.5)", backdropFilter: "blur(12px)", borderRadius: "24px", padding: "25px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "30px" };
const glassUECard = { background: "rgba(15, 23, 42, 0.8)", borderRadius: "20px", overflow: "hidden", transition: "all 0.3s ease" };
const configGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" };
const selectionGroup = { display: "flex", flexDirection: "column" as const, gap: "8px" };
const miniLabel = { fontSize: "0.65rem", fontWeight: "bold", color: "#64748b", textTransform: "uppercase" as const };
const btnToggleGroup = { display: "flex", background: "#020617", padding: "4px", borderRadius: "12px", gap: "4px" };
const activeBtn = { flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "0.75rem" };
const inactiveBtn = { flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: "0.75rem" };
const disabledBtn = { flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "rgba(255,255,255,0.02)", color: "#334155", cursor: "not-allowed", fontSize: "0.7rem" };
const darkInput = { width: "100%", background: "#0f172a", border: "1px solid #334155", padding: "8px", borderRadius: "8px", color: "white" };
const darkInputLarge = { background: "#0f172a", border: "1px solid #fbbf24", padding: "12px", borderRadius: "12px", color: "white", width: "100px", textAlign: "center" as const };
const calculateBtn = { padding: "15px 30px", borderRadius: "12px", border: "none", background: "#3b82f6", color: "white", fontWeight: "bold", cursor: "pointer" };
const annualBtn = { padding: "15px 25px", borderRadius: "12px", border: "none", background: "#fbbf24", color: "#000", fontWeight: "900", cursor: "pointer" };
const resultBadge = { marginTop: "20px", fontSize: "1.5rem", fontWeight: "bold" };
const finalResult = { marginTop: "25px", textAlign: "center" as const, fontSize: "2.2rem", fontWeight: "950" };
const ueHeaderStyle = { padding: "12px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" };
const matRowStyle = { marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" };
const logoRectWrapper = { 
  width: "220px",            
  height: "80px",            
  borderRadius: "4px", 
  overflow: "hidden",        
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center",
  marginBottom: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
};

const rectImg = { 
  width: "100%", 
  height: "100%", 
  objectFit: "fill" as const, 
  display: "block"
};
const profileRoundWrapper = { 
  width: "90px", 
  height: "90px", 
  borderRadius: "50%", 
  background: "linear-gradient(135deg, #fbbf24, #3b82f6)", 
  padding: "2px", 
  margin: "0 auto", 
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)" 
};

const roundImg = { 
  width: "100%", 
  height: "100%", 
  borderRadius: "50%", 
  objectFit: "cover" as const, 
  border: "4px solid #020617" 
};
const responsiveGrid = { 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", // Réduit le minimum à 280px
  gap: "15px", // Espace légèrement réduit pour gagner de la place
  width: "100%"
};
const emptyState = { textAlign: "center" as const, padding: "40px", opacity: 0.5, fontStyle: "italic" };