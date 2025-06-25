import Navigation from "@/components/layout/Navigation";
import ElectionCard from "@/components/voting/ElectionCard";
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Vote,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  Info,
} from "lucide-react";
import { UserRole, ElectionStatus, Election } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser, login, register, logout, error, isLoading } = useAuth();

  // Mock data for demonstration
  const mockElections: Election[] = [
    {
      id: "1",
      name: "Élection du Conseil Étudiant 2024",
      description:
        "Élection des représentants étudiants pour le mandat 2024-2025",
      startDate: new Date("2024-03-15T08:00:00"),
      endDate: new Date("2024-03-20T18:00:00"),
      status: ElectionStatus.VOTING_OPEN,
      positions: [
        {
          id: "1",
          name: "Président",
          description: "Président du conseil étudiant",
          numberOfSeats: 1,
          candidates: [
            {
              id: "1",
              userId: "1",
              positionId: "1",
              description: "Candidat expérimenté",
              status: "approved" as any,
              votes: 0,
              submittedAt: new Date(),
            },
            {
              id: "2",
              userId: "2",
              positionId: "1",
              description: "Nouvelle vision",
              status: "approved" as any,
              votes: 0,
              submittedAt: new Date(),
            },
          ],
          electionId: "1",
        },
        {
          id: "2",
          name: "Vice-Président",
          description: "Vice-Président du conseil étudiant",
          numberOfSeats: 2,
          candidates: [
            {
              id: "3",
              userId: "3",
              positionId: "2",
              description: "Candidat motivé",
              status: "approved" as any,
              votes: 0,
              submittedAt: new Date(),
            },
            {
              id: "4",
              userId: "4",
              positionId: "2",
              description: "Expérience en gestion",
              status: "approved" as any,
              votes: 0,
              submittedAt: new Date(),
            },
            {
              id: "5",
              userId: "5",
              positionId: "2",
              description: "Innovation et créativité",
              status: "approved" as any,
              votes: 0,
              submittedAt: new Date(),
            },
          ],
          electionId: "1",
        },
      ],
      createdBy: "admin",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Élection du Bureau des Étudiants",
      description:
        "Renouvellement du bureau des étudiants - Résultats disponibles",
      startDate: new Date("2024-02-01T08:00:00"),
      endDate: new Date("2024-02-07T18:00:00"),
      status: ElectionStatus.RESULTS_PUBLISHED,
      positions: [
        {
          id: "3",
          name: "Secrétaire Général",
          description: "Secrétaire général du bureau",
          numberOfSeats: 1,
          candidates: [
            {
              id: "6",
              userId: "6",
              positionId: "3",
              description: "Organisation parfaite",
              status: "approved" as any,
              votes: 45,
              submittedAt: new Date(),
            },
            {
              id: "7",
              userId: "7",
              positionId: "3",
              description: "Communication efficace",
              status: "approved" as any,
              votes: 32,
              submittedAt: new Date(),
            },
          ],
          electionId: "2",
        },
      ],
      createdBy: "admin",
      createdAt: new Date(),
    },
  ];

  const handleVote = (electionId: string) => {
    // Navigate to voting page
    window.location.href = "/vote";
  };

  const handleViewResults = (electionId: string) => {
    // Navigate to results page
    window.location.href = "/results";
  };

  const handleManageElection = (electionId: string) => {
    // Navigate to admin page
    window.location.href = "/admin/elections";
  };

  if (!currentUser) {
    return (
      <LoginForm
        onLogin={login}
        onRegister={register}
        error={error}
        loading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentUser={currentUser} onLogout={logout} />

      <main className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Bienvenue, {currentUser.firstName} !
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentUser.role === UserRole.ADMIN &&
              "Gérez les élections et supervisez le processus de vote en toute sécurité."}
            {currentUser.role === UserRole.VOTER &&
              "Participez aux élections en cours et consultez les résultats."}
            {currentUser.role === UserRole.CANDIDATE &&
              "Suivez vos candidatures et consultez les résultats des élections."}
            {currentUser.role === UserRole.SPECTATOR &&
              "Consultez les résultats des élections publiques."}
          </p>
        </div>

        {/* Quick Stats for Admin */}
        {currentUser.role === UserRole.ADMIN && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Élections actives
                </CardTitle>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Vote en cours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Candidatures
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  En attente de validation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Électeurs</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">Comptes validés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Participation
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  Taux de participation
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Elections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              {currentUser.role === UserRole.ADMIN
                ? "Gestion des élections"
                : "Élections"}
            </h2>
            {currentUser.role === UserRole.ADMIN && (
              <Button
                onClick={() => (window.location.href = "/admin/elections")}
              >
                Créer une élection
              </Button>
            )}
          </div>

          {/* Active Elections Alert */}
          {mockElections.some((e) => e.status === ElectionStatus.VOTING_OPEN) &&
            currentUser.role === UserRole.VOTER && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Une élection est actuellement en cours ! N'oubliez pas de
                  voter avant la date limite.
                </AlertDescription>
              </Alert>
            )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                userRole={currentUser.role}
                onVote={handleVote}
                onViewResults={handleViewResults}
                onManage={handleManageElection}
              />
            ))}
          </div>

          {mockElections.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">
                  Aucune élection disponible
                </CardTitle>
                <CardDescription>
                  Il n'y a actuellement aucune élection en cours ou programmée.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Platform Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Sécurité Maximale</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Chiffrement de bout en bout et authentification multi-facteurs
                pour garantir l'intégrité de votre vote.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Gestion Simplifiée</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Interface intuitive pour les administrateurs et processus de
                validation transparent pour tous les utilisateurs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Résultats en Temps Réel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dépouillement automatique et publication immédiate des résultats
                avec visualisations détaillées.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle>Besoin d'aide ?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Consultez notre guide d'utilisation ou contactez le support
              technique pour toute question.
            </CardDescription>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => window.open("/guide-utilisation.html", "_blank")}
              >
                Guide d'utilisation
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  (window.location.href =
                    "mailto:support@votesecure.sn?subject=Demande de support VoteSecure&body=Bonjour,%0D%0A%0D%0AJe souhaite obtenir de l'aide concernant :%0D%0A%0D%0AMon rôle sur la plateforme : %0D%0ADescription du problème : %0D%0A%0D%0AMerci pour votre assistance.%0D%0A%0D%0ACordialement")
                }
              >
                Contacter le support
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
