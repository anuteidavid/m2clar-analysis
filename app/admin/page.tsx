import AdminConsole from "@/components/admin-console";
export const metadata={title:"Administrare conținut | m2clar"};
export default function Page(){return <main className="wrap" style={{paddingTop:48,minHeight:"70vh"}}><span className="pill">Editorial</span><h1 className="serif" style={{fontSize:48}}>Administrare <em>conținut.</em></h1><p className="muted">Creează și versionază module și unități, verifică în previzualizare și publică versiuni aprobate.</p><AdminConsole/></main>}
