import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Vote,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Lock,
} from "lucide-react";
import { UserRole, Election, Position, Candidate } from "@/lib/types";

const VotingPage = () => {
  const { currentUser } = useAuth();

  const [selectedVotes, setSelectedVotes] = useState<{
    [positionId: string]: string[];
  }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  // Mock election data
  const election: Election = {
    id: "1",
    name: "Élection du Conseil Étudiant 2024",
    description:
      "Élection des représentants étudiants pour le mandat 2024-2025",
    startDate: new Date("2024-03-15T08:00:00"),
    endDate: new Date("2024-03-20T18:00:00"),
    status: "voting_open" as any,
    positions: [
      {
        id: "1",
        name: "Président",
        description: "Président du conseil étudiant - Mandat de 2 ans",
        numberOfSeats: 1,
        candidates: [
          {
            id: "1",
            userId: "1",
            positionId: "1",
            description:
              "Étudiant en Master 2 Management, expérience associative de 3 ans",
            photoUrl:
              "https://images.unsplash.com/photo-1614289371518-722f2615943d?w=150&h=150&fit=crop&crop=face",
            status: "approved" as any,
            votes: 0,
            submittedAt: new Date(),
            user: {
              id: "1",
              firstName: "Mamadou",
              lastName: "Fall",
              email: "mamadou.fall@education.sn",
              role: UserRole.CANDIDATE,
              status: "approved" as any,
              createdAt: new Date(),
            },
          },
          {
            id: "2",
            userId: "2",
            positionId: "1",
            description:
              "Étudiante en Master 1 Communication, déléguée de classe depuis 2 ans",
            photoUrl:
              "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
            status: "approved" as any,
            votes: 0,
            submittedAt: new Date(),
            user: {
              id: "2",
              firstName: "Aïssatou",
              lastName: "Diop",
              email: "aissatou.diop@education.sn",
              role: UserRole.CANDIDATE,
              status: "approved" as any,
              createdAt: new Date(),
            },
          },
        ],
        electionId: "1",
      },
      {
        id: "2",
        name: "Vice-Président",
        description: "Vice-Président du conseil étudiant - Mandat de 2 ans",
        numberOfSeats: 2,
        candidates: [
          {
            id: "3",
            userId: "3",
            positionId: "2",
            description:
              "Étudiant en Licence 3 Économie, trésorier de l'association sportive",
            photoUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            status: "approved" as any,
            votes: 0,
            submittedAt: new Date(),
            user: {
              id: "3",
              firstName: "Ibrahima",
              lastName: "Ba",
              email: "ibrahima.ba@education.sn",
              role: UserRole.CANDIDATE,
              status: "approved" as any,
              createdAt: new Date(),
            },
          },
          {
            id: "4",
            userId: "4",
            positionId: "2",
            description:
              "Étudiante en Master 1 Informatique, responsable événementiel",
            photoUrl:
              "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&h=150&fit=crop&crop=face",
            status: "approved" as any,
            votes: 0,
            submittedAt: new Date(),
            user: {
              id: "4",
              firstName: "Fatou",
              lastName: "Sarr",
              email: "fatou.sarr@education.sn",
              role: UserRole.CANDIDATE,
              status: "approved" as any,
              createdAt: new Date(),
            },
          },
          {
            id: "5",
            userId: "5",
            positionId: "2",
            description:
              "Étudiant en Licence 2 Droit, président du bureau des étudiants",
            photoUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            status: "approved" as any,
            votes: 0,
            submittedAt: new Date(),
            user: {
              id: "5",
              firstName: "Moussa",
              lastName: "Diouf",
              email: "moussa.diouf@education.sn",
              role: UserRole.CANDIDATE,
              status: "approved" as any,
              createdAt: new Date(),
            },
          },
        ],
        electionId: "1",
      },
    ],
    createdBy: "admin",
    createdAt: new Date(),
  };

  const handleVoteChange = (
    positionId: string,
    candidateId: string,
    checked: boolean = true,
  ) => {
    const position = election.positions.find((p) => p.id === positionId);
    if (!position) return;

    setSelectedVotes((prev) => {
      const currentVotes = prev[positionId] || [];

      if (position.numberOfSeats === 1) {
        // Single seat - radio button behavior
        return { ...prev, [positionId]: [candidateId] };
      } else {
        // Multiple seats - checkbox behavior
        if (checked) {
          if (
            currentVotes.length < position.numberOfSeats &&
            !currentVotes.includes(candidateId)
          ) {
            return { ...prev, [positionId]: [...currentVotes, candidateId] };
          }
        } else {
          return {
            ...prev,
            [positionId]: currentVotes.filter((id) => id !== candidateId),
          };
        }
      }
      return prev;
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const endDate = new Date(election.endDate);
    const timeDiff = endDate.getTime() - now.getTime();

    if (timeDiff <= 0) return "Vote terminé";

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}j ${hours}h ${minutes}m restantes`;
    if (hours > 0) return `${hours}h ${minutes}m restantes`;
    return `${minutes}m restantes`;
  };

  const getProgress = () => {
    const totalPositions = election.positions.length;
    const votedPositions = Object.keys(selectedVotes).filter((positionId) => {
      const votes = selectedVotes[positionId];
      return votes && votes.length > 0;
    }).length;

    return Math.round((votedPositions / totalPositions) * 100);
  };

  const canSubmitVote = () => {
    return election.positions.every((position) => {
      const votes = selectedVotes[position.id];
      return votes && votes.length > 0;
    });
  };

  const handleSubmitVote = () => {
    setShowConfirmation(true);
  };

  const confirmSubmitVote = async () => {
    try {
      // Simulate API call with loading
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save vote to localStorage (for demo purposes)
      const voteData = {
        electionId: election.id,
        votes: selectedVotes,
        submittedAt: new Date().toISOString(),
        confirmationNumber: `VT-2024-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      localStorage.setItem("user_vote", JSON.stringify(voteData));

      setVoteSubmitted(true);
      setShowConfirmation(false);
    } catch (error) {
      alert("Erreur lors de la soumission du vote. Veuillez réessayer.");
    }
  };

  const getCandidateVotesText = (position: Position) => {
    const votes = selectedVotes[position.id] || [];
    if (position.numberOfSeats === 1) {
      return votes.length > 0 ? "1 vote exprimé" : "Aucun vote";
    } else {
      return `${votes.length}/${position.numberOfSeats} votes exprimés`;
    }
  };

  if (voteSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-800 mb-2">
                Vote enregistré avec succès !
              </h1>
              <p className="text-green-700">
                Votre bulletin de vote a été enregistré de manière sécurisée et
                anonyme.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de votre vote</CardTitle>
                <CardDescription>Élection : {election.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {election.positions.map((position) => {
                  const votes = selectedVotes[position.id] || [];
                  const selectedCandidates = position.candidates.filter((c) =>
                    votes.includes(c.id),
                  );

                  return (
                    <div key={position.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{position.name}</h4>
                      {selectedCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>
                            {candidate.user?.firstName}{" "}
                            {candidate.user?.lastName}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Numéro de confirmation :{" "}
                    <span className="font-mono">
                      VT-2024-
                      {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => (window.location.href = "/")}>
                Retour à l'accueil
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/results")}
              >
                Voir les r��sultats
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentUser={currentUser} onLogout={() => {}} />

      <main className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {election.name}
          </h1>
          <p className="text-muted-foreground">{election.description}</p>

          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 font-medium">
                {getTimeRemaining()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">Vote sécurisé</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression du vote</span>
              <span className="text-sm text-muted-foreground">
                {getProgress()}%
              </span>
            </div>
            <Progress value={getProgress()} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {election.positions.length} postes à voter
            </p>
          </CardContent>
        </Card>

        {/* Voting Instructions */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important :</strong> Vous devez voter pour tous les postes
            avant de pouvoir valider votre bulletin. Pour les postes avec
            plusieurs sièges, vous pouvez sélectionner plusieurs candidats.
          </AlertDescription>
        </Alert>

        {/* Voting Sections */}
        <div className="space-y-8">
          {election.positions.map((position, index) => (
            <Card key={position.id} className="vote-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span>{position.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {position.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {position.numberOfSeats} siège
                      {position.numberOfSeats > 1 ? "s" : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getCandidateVotesText(position)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {position.numberOfSeats === 1 ? (
                  <RadioGroup
                    value={selectedVotes[position.id]?.[0] || ""}
                    onValueChange={(value) =>
                      handleVoteChange(position.id, value)
                    }
                  >
                    <div className="space-y-4">
                      {position.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <RadioGroupItem
                            value={candidate.id}
                            id={candidate.id}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={candidate.id}
                              className="cursor-pointer"
                            >
                              <div className="flex items-start space-x-4">
                                {candidate.photoUrl && (
                                  <img
                                    src={candidate.photoUrl}
                                    alt={`${candidate.user?.firstName} ${candidate.user?.lastName}`}
                                    className="w-16 h-16 rounded-full object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-base">
                                    {candidate.user?.firstName}{" "}
                                    {candidate.user?.lastName}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {candidate.description}
                                  </p>
                                  {candidate.documentUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="mt-2 p-0 h-auto"
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      Programme détaillé
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="space-y-4">
                    {position.candidates.map((candidate) => {
                      const isSelected =
                        selectedVotes[position.id]?.includes(candidate.id) ||
                        false;
                      const canSelect =
                        !isSelected &&
                        (selectedVotes[position.id]?.length || 0) <
                          position.numberOfSeats;

                      return (
                        <div
                          key={candidate.id}
                          className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <Checkbox
                            id={candidate.id}
                            checked={isSelected}
                            disabled={!canSelect && !isSelected}
                            onCheckedChange={(checked) =>
                              handleVoteChange(
                                position.id,
                                candidate.id,
                                checked as boolean,
                              )
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={candidate.id}
                              className="cursor-pointer"
                            >
                              <div className="flex items-start space-x-4">
                                {candidate.photoUrl && (
                                  <img
                                    src={candidate.photoUrl}
                                    alt={`${candidate.user?.firstName} ${candidate.user?.lastName}`}
                                    className="w-16 h-16 rounded-full object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-base">
                                    {candidate.user?.firstName}{" "}
                                    {candidate.user?.lastName}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {candidate.description}
                                  </p>
                                  {candidate.documentUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="mt-2 p-0 h-auto"
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      Programme détaillé
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      );
                    })}

                    {position.numberOfSeats > 1 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Vous pouvez sélectionner jusqu'à{" "}
                        {position.numberOfSeats} candidat
                        {position.numberOfSeats > 1 ? "s" : ""}.
                        {selectedVotes[position.id]?.length > 0 && (
                          <span className="ml-2 text-primary font-medium">
                            {selectedVotes[position.id].length} sélectionné
                            {selectedVotes[position.id].length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Section */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Finaliser votre vote</h3>
              <p className="text-sm text-muted-foreground">
                Vérifiez vos choix avant de valider définitivement votre
                bulletin de vote.
              </p>

              <div className="flex justify-center">
                <Button
                  onClick={handleSubmitVote}
                  disabled={!canSubmitVote()}
                  size="lg"
                  className="px-8"
                >
                  <Vote className="h-5 w-5 mr-2" />
                  Valider mon vote
                </Button>
              </div>

              {!canSubmitVote() && (
                <p className="text-xs text-destructive">
                  Vous devez voter pour tous les postes avant de pouvoir
                  valider.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer votre vote</DialogTitle>
            <DialogDescription>
              Veuillez vérifier vos choix avant la validation définitive. Une
              fois validé, votre vote ne pourra plus être modifié.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {election.positions.map((position) => {
              const votes = selectedVotes[position.id] || [];
              const selectedCandidates = position.candidates.filter((c) =>
                votes.includes(c.id),
              );

              return (
                <div key={position.id} className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">{position.name}</h4>
                  {selectedCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>
                        {candidate.user?.firstName} {candidate.user?.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Modifier mes choix
            </Button>
            <Button onClick={confirmSubmitVote}>Confirmer et valider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VotingPage;
