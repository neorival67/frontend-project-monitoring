import { TeamManager } from "@/presentation/features/TeamManager";
import { MasterTeamManager } from "@/presentation/features/MasterTeamManager";

export default function MasterTimPage() {
  return (
    <div className="space-y-12">
      <MasterTeamManager />
      
      <div className="pt-8 border-t border-slate-200">
        <TeamManager />
      </div>
    </div>
  );
}
