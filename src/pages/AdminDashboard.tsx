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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Vote,
  Users,
  UserCheck,
  UserX,
  BarChart3,
  Settings,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { UserRole, UserStatus, ElectionStatus } from "@/lib/types";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { currentUser } = useAuth();

  // Mock data
  const stats = {
    totalElections: 5,
    activeElections: 1,
    totalVoters: 247,
    pendingVoters: 12,
    totalCandidates: 35,
    pendingCandidates: 8,
    totalVotes: 156,
    participationRate: 68,
  };

  const recentElections = [
    {
      id: "1",
      name: "Élection du Conseil Étudiant 2024",
      status: ElectionStatus.VOTING_OPEN,
      startDate: "2024-03-15",
      endDate: "2024-03-20",
      participants: 156,
      totalVoters: 247,
    },
    {
      id: "2",
      name: "Élection du Bureau des Étudiants",
      status: ElectionStatus.RESULTS_PUBLISHED,
      startDate: "2024-02-01",
      endDate: "2024-02-07",
      participants: 89,
      totalVoters: 120,
    },
    {
      id: "3",
      name: "Référendum - Nouveaux Services",
      status: ElectionStatus.DRAFT,
      startDate: "2024-04-01",
      endDate: "2024-04-05",
      participants: 0,
      totalVoters: 300,
    },
  ];

  const pendingCandidates = [
    {
      id: "1",
      name: "Marie Dubois",
      email: "aissatou.diop@education.sn",
      position: "Pr��sident",
      submittedAt: "2024-03-10",
      status: "pending",
    },
    {
      id: "2",
      name: "Pierre Martin",
      email: "mamadou.fall@education.sn",
      position: "Vice-Président",
      submittedAt: "2024-03-12",
      status: "pending",
    },
    {
      id: "3",
      name: "Sophie Bernard",
      email: "fatou.sarr@education.sn",
      position: "Secrétaire",
      submittedAt: "2024-03-13",
      status: "pending",
    },
  ];

  const pendingVoters = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "abdoulaye.sy@education.sn",
      registeredAt: "2024-03-14",
      status: "pending",
    },
    {
      id: "2",
      name: "Claire Moreau",
      email: "khady.ndiaye@education.sn",
      registeredAt: "2024-03-14",
      status: "pending",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "voting_open":
        return "bg-green-100 text-green-800 border-green-200";
      case "results_published":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Rejeté";
      case "voting_open":
        return "Vote en cours";
      case "results_published":
        return "Résultats publiés";
      case "draft":
        return "Brouillon";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tableau de bord administrateur
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les élections, validez les comptes et supervisez le
              processus de vote
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/admin/elections")}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle élection
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Élections totales
              </CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalElections}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.activeElections}</span>{" "}
                active(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Électeurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVoters}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-600">{stats.pendingVoters}</span>{" "}
                en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Candidatures
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-600">
                  {stats.pendingCandidates}
                </span>{" "}
                à valider
              </p>
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
              <div className="text-2xl font-bold">
                {stats.participationRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">{stats.totalVotes}</span> votes
                exprimés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{stats.pendingCandidates} candidatures</strong> en attente
              de validation
            </AlertDescription>
          </Alert>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              L'élection <strong>"Conseil Étudiant 2024"</strong> se termine
              dans 2 jours
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="elections">Élections</TabsTrigger>
            <TabsTrigger value="candidates">Candidatures</TabsTrigger>
            <TabsTrigger value="voters">Électeurs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Elections */}
            <Card>
              <CardHeader>
                <CardTitle>Élections récentes</CardTitle>
                <CardDescription>
                  État des élections et leur progression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentElections.map((election) => (
                    <div
                      key={election.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{election.name}</h4>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(election.status)}
                          >
                            {getStatusText(election.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {election.startDate} - {election.endDate}
                        </p>
                        {election.status === ElectionStatus.VOTING_OPEN && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Participation</span>
                              <span>
                                {Math.round(
                                  (election.participants /
                                    election.totalVoters) *
                                    100,
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                (election.participants / election.totalVoters) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start"
                    onClick={() => (window.location.href = "/admin/elections")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une nouvelle élection
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => (window.location.href = "/admin/settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres de la plateforme
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => (window.location.href = "/admin/results")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Rapports et statistiques
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="bg-green-100 p-1 rounded-full">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Candidature de Marie Dubois approuvée</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <Vote className="h-3 w-3 text-blue-600" />
                      </div>
                      <span>12 nouveaux votes enregistrés</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="bg-yellow-100 p-1 rounded-full">
                        <Clock className="h-3 w-3 text-yellow-600" />
                      </div>
                      <span>3 électeurs en attente de validation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="elections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des élections</CardTitle>
                <CardDescription>
                  Créez, modifiez et gérez toutes les élections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Gestion des élections
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Cette section contiendra la gestion complète des élections
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une élection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Candidatures en attente</CardTitle>
                    <CardDescription>
                      Validez ou rejetez les candidatures déposées
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {pendingCandidates.length} en attente
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Date de dépôt</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {candidate.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.position}</TableCell>
                        <TableCell>
                          {new Date(candidate.submittedAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voters" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Électeurs en attente</CardTitle>
                    <CardDescription>
                      Validez les comptes électeurs pour leur permettre de voter
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {pendingVoters.length} en attente
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Électeur</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingVoters.map((voter) => (
                      <TableRow key={voter.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{voter.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {voter.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(voter.registeredAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(voter.status)}
                          >
                            {getStatusText(voter.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Valider
                            </Button>
                            <Button size="sm" variant="destructive">
                              <UserX className="h-4 w-4 mr-1" />
                              Bloquer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
