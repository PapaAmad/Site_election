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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Vote,
  Eye,
  Edit,
  Plus,
} from "lucide-react";
import { UserRole, CandidateStatus, ElectionStatus } from "@/lib/types";

const CandidateDashboard = () => {
  const { currentUser } = useAuth();

  // Mock candidate data
  const candidateProfile = {
    id: "1",
    firstName: "Aïssatou",
    lastName: "Diop",
    email: "aissatou.diop@education.sn",
    phone: "+33 6 12 34 56 78",
    bio: "Étudiante en Master 2 Communication, passionnée par l'engagement étudiant et l'amélioration de la vie sur le campus.",
    experience:
      "Déléguée de classe depuis 2 ans, membre du bureau des étudiants en communication",
    motivations:
      "Je souhaite représenter les étudiants et porter leurs voix pour améliorer les conditions d'études et la vie associative.",
  };

  const candidateApplications = [
    {
      id: "1",
      electionName: "Élection du Conseil Étudiant 2024",
      position: "Président",
      status: CandidateStatus.APPROVED,
      submittedAt: "2024-03-10T10:00:00Z",
      reviewedAt: "2024-03-12T14:30:00Z",
      electionStatus: ElectionStatus.VOTING_OPEN,
      startDate: "2024-03-15T08:00:00Z",
      endDate: "2024-03-20T18:00:00Z",
      currentVotes: 89,
      totalVotes: 156,
      ranking: 2,
      totalCandidates: 2,
    },
    {
      id: "2",
      electionName: "Élection du Bureau des Étudiants",
      position: "Vice-Président Communication",
      status: CandidateStatus.PENDING,
      submittedAt: "2024-04-01T09:00:00Z",
      electionStatus: ElectionStatus.OPEN_FOR_CANDIDACY,
      startDate: "2024-04-15T08:00:00Z",
      endDate: "2024-04-20T18:00:00Z",
    },
  ];

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case CandidateStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case CandidateStatus.APPROVED:
        return "bg-green-100 text-green-800 border-green-200";
      case CandidateStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: CandidateStatus) => {
    switch (status) {
      case CandidateStatus.PENDING:
        return "En attente";
      case CandidateStatus.APPROVED:
        return "Approuvée";
      case CandidateStatus.REJECTED:
        return "Rejetée";
      default:
        return status;
    }
  };

  const getElectionStatusColor = (status: ElectionStatus) => {
    switch (status) {
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

  const getElectionStatusText = (status: ElectionStatus) => {
    switch (status) {
      case ElectionStatus.OPEN_FOR_CANDIDACY:
        return "Candidatures ouvertes";
      case ElectionStatus.VOTING_OPEN:
        return "Vote en cours";
      case ElectionStatus.VOTING_CLOSED:
        return "Vote terminé";
      case ElectionStatus.RESULTS_PUBLISHED:
        return "Résultats publiés";
      default:
        return status;
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - now.getTime();

    if (timeDiff <= 0) return "Terminé";

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (days > 0) return `${days}j ${hours}h restantes`;
    return `${hours}h restantes`;
  };

  const pendingApplications = candidateApplications.filter(
    (app) => app.status === CandidateStatus.PENDING,
  );
  const activeElections = candidateApplications.filter(
    (app) =>
      app.status === CandidateStatus.APPROVED &&
      (app.electionStatus === ElectionStatus.VOTING_OPEN ||
        app.electionStatus === ElectionStatus.VOTING_CLOSED),
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Mon espace candidat
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos candidatures et suivez vos résultats
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "/candidate/application")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle candidature
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Candidatures
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {candidateApplications.length}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-600">
                  {pendingApplications.length}
                </span>{" "}
                en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Élections actives
              </CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeElections.length}</div>
              <p className="text-xs text-muted-foreground">
                Élections en cours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Votes reçus</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {candidateApplications.reduce(
                  (sum, app) => sum + (app.currentVotes || 0),
                  0,
                )}
              </div>
              <p className="text-xs text-muted-foreground">Total des votes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Meilleur score
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(
                  ...candidateApplications.map((app) =>
                    app.currentVotes && app.totalVotes
                      ? Math.round((app.currentVotes / app.totalVotes) * 100)
                      : 0,
                  ),
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Pourcentage des votes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {pendingApplications.length > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Vous avez{" "}
              <strong>{pendingApplications.length} candidature(s)</strong> en
              attente de validation par l'administration.
            </AlertDescription>
          </Alert>
        )}

        {activeElections.length > 0 && (
          <Alert>
            <Vote className="h-4 w-4" />
            <AlertDescription>
              <strong>{activeElections.length} élection(s)</strong> en cours !
              Suivez vos résultats en temps réel.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
            <TabsTrigger value="profile">Mon profil</TabsTrigger>
            <TabsTrigger value="results">Mes résultats</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes candidatures</CardTitle>
                <CardDescription>
                  Suivez l'état de vos candidatures et leurs résultats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élection</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Statut candidature</TableHead>
                      <TableHead>Statut élection</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidateApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {application.electionName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                application.startDate,
                              ).toLocaleDateString("fr-FR")}{" "}
                              -
                              {new Date(application.endDate).toLocaleDateString(
                                "fr-FR",
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{application.position}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(application.status)}
                          >
                            {getStatusText(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getElectionStatusColor(
                              application.electionStatus,
                            )}
                          >
                            {getElectionStatusText(application.electionStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                            {application.status === CandidateStatus.PENDING && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mon profil candidat</CardTitle>
                <CardDescription>
                  Informations visibles par les électeurs et l'administration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">
                      Informations personnelles
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Nom complet :
                        </span>
                        <span className="ml-2 font-medium">
                          {candidateProfile.firstName}{" "}
                          {candidateProfile.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email :</span>
                        <span className="ml-2">{candidateProfile.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Téléphone :
                        </span>
                        <span className="ml-2">{candidateProfile.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Photo de profil</h4>
                    <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Changer la photo
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Présentation</h4>
                  <p className="text-sm text-muted-foreground">
                    {candidateProfile.bio}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Expérience</h4>
                  <p className="text-sm text-muted-foreground">
                    {candidateProfile.experience}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Motivations</h4>
                  <p className="text-sm text-muted-foreground">
                    {candidateProfile.motivations}
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier le profil
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Télécharger le programme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {/* Active Elections Results */}
            {activeElections.map((application) => (
              <Card key={application.id} className="vote-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{application.electionName}</CardTitle>
                      <CardDescription>
                        Poste : {application.position}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="secondary"
                        className={getElectionStatusColor(
                          application.electionStatus,
                        )}
                      >
                        {getElectionStatusText(application.electionStatus)}
                      </Badge>
                      {application.electionStatus ===
                        ElectionStatus.VOTING_OPEN && (
                        <div className="text-sm text-orange-600 mt-1">
                          {getTimeRemaining(application.endDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {application.currentVotes !== undefined &&
                    application.totalVotes && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {application.currentVotes}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Votes reçus
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {Math.round(
                              (application.currentVotes /
                                application.totalVotes) *
                                100,
                            )}
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Pourcentage
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {application.ranking}
                            {application.ranking === 1 ? "er" : "ème"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Position (/{application.totalCandidates})
                          </div>
                        </div>
                      </div>
                    )}

                  {application.currentVotes !== undefined &&
                    application.totalVotes && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progression</span>
                          <span>
                            {application.currentVotes} /{" "}
                            {application.totalVotes} votes
                          </span>
                        </div>
                        <Progress
                          value={
                            (application.currentVotes /
                              application.totalVotes) *
                            100
                          }
                          className="h-3"
                        />
                      </div>
                    )}

                  {application.electionStatus ===
                    ElectionStatus.VOTING_OPEN && (
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        Le vote est en cours ! Les résultats sont mis à jour en
                        temps réel.
                        {application.ranking === 1 && (
                          <span className="text-green-600 font-medium ml-2">
                            Vous êtes actuellement en tête !
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}

            {activeElections.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="text-xl mb-2">
                    Aucune élection active
                  </CardTitle>
                  <CardDescription>
                    Vos résultats apparaîtront ici lors des élections en cours.
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CandidateDashboard;
