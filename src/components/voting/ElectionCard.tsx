import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  Vote,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Election, ElectionStatus, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ElectionCardProps {
  election: Election;
  userRole: UserRole;
  onVote?: (electionId: string) => void;
  onViewResults?: (electionId: string) => void;
  onManage?: (electionId: string) => void;
  className?: string;
}

const ElectionCard = ({
  election,
  userRole,
  onVote,
  onViewResults,
  onManage,
  className,
}: ElectionCardProps) => {
  const getStatusColor = (status: ElectionStatus) => {
    switch (status) {
      case ElectionStatus.DRAFT:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case ElectionStatus.OPEN_FOR_CANDIDACY:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ElectionStatus.VOTING_OPEN:
        return "bg-green-100 text-green-800 border-green-200";
      case ElectionStatus.VOTING_CLOSED:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case ElectionStatus.RESULTS_PUBLISHED:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ElectionStatus) => {
    switch (status) {
      case ElectionStatus.DRAFT:
        return "Brouillon";
      case ElectionStatus.OPEN_FOR_CANDIDACY:
        return "Candidatures ouvertes";
      case ElectionStatus.VOTING_OPEN:
        return "Vote en cours";
      case ElectionStatus.VOTING_CLOSED:
        return "Vote terminé";
      case ElectionStatus.RESULTS_PUBLISHED:
        return "Résultats publiés";
      default:
        return "Statut inconnu";
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const endDate = new Date(election.endDate);
    const timeDiff = endDate.getTime() - now.getTime();

    if (timeDiff <= 0) return null;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (days > 0) {
      return `${days}j ${hours}h restantes`;
    }
    return `${hours}h restantes`;
  };

  const getVotingProgress = () => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) return 0;
    if (now > endDate) return 100;

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();

    return Math.round((elapsed / totalDuration) * 100);
  };

  const canVote =
    userRole === UserRole.VOTER &&
    election.status === ElectionStatus.VOTING_OPEN;
  const canViewResults = election.status === ElectionStatus.RESULTS_PUBLISHED;
  const canManage = userRole === UserRole.ADMIN;

  const totalCandidates = election.positions.reduce(
    (total, position) => total + position.candidates.length,
    0,
  );

  return (
    <Card
      className={cn(
        "vote-card hover:shadow-lg transition-all duration-200",
        className,
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{election.name}</CardTitle>
            <CardDescription className="text-sm">
              {election.description}
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={getStatusColor(election.status)}
          >
            {getStatusText(election.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Election Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(election.startDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(election.endDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Vote className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {election.positions.length} poste
              {election.positions.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {totalCandidates} candidat{totalCandidates > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Progress for active elections */}
        {election.status === ElectionStatus.VOTING_OPEN && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression du vote</span>
              <span className="text-muted-foreground">
                {getVotingProgress()}%
              </span>
            </div>
            <Progress value={getVotingProgress()} className="h-2" />
            {getTimeRemaining() && (
              <div className="flex items-center space-x-1 text-sm text-orange-600">
                <Clock className="h-3 w-3" />
                <span>{getTimeRemaining()}</span>
              </div>
            )}
          </div>
        )}

        {/* Positions List */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Postes à pourvoir :</h4>
          <div className="space-y-1">
            {election.positions.map((position) => (
              <div
                key={position.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{position.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {position.numberOfSeats} siège
                    {position.numberOfSeats > 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {position.candidates.length} candidat
                    {position.candidates.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          {election.status === ElectionStatus.VOTING_OPEN && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span className="text-xs font-medium">Actif</span>
            </div>
          )}
          {election.status === ElectionStatus.VOTING_CLOSED && (
            <div className="flex items-center space-x-1 text-orange-600">
              <XCircle className="h-3 w-3" />
              <span className="text-xs font-medium">Terminé</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {canVote && (
            <Button
              onClick={() => onVote?.(election.id)}
              className="vote-button"
            >
              <Vote className="h-4 w-4 mr-2" />
              Voter
            </Button>
          )}

          {canViewResults && (
            <Button
              variant="outline"
              onClick={() => onViewResults?.(election.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Résultats
            </Button>
          )}

          {canManage && (
            <Button variant="secondary" onClick={() => onManage?.(election.id)}>
              Gérer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
