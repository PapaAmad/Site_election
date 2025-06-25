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
import {
  AlertTriangle,
  Users,
  Vote,
  BarChart3,
  CheckCircle,
  Clock,
  UserCheck,
  Calendar,
  TrendingUp,
  Activity,
  Bell,
  Settings,
} from "lucide-react";
import { UserRole, ElectionStatus } from "@/lib/types";

const AdminDashboard = () => {
  const { currentUser } = useAuth();

  // Mock data with SENEGALESE NAMES
  const mockCandidates = [
    {
      id: "1",
      name: "Aissatou Diop",
      email: "aissatou.diop@email.sn",
      position: "Président",
      status: "approved",
      votes: 245,
    },
    {
      id: "2",
      name: "Mamadou Sall",
      email: "mamadou.sall@email.sn",
      position: "Vice-Président",
      status: "pending",
      votes: 189,
    },
    {
      id: "3",
      name: "Fatou Ndiaye",
      email: "fatou.ndiaye@email.sn",
      position: "Secrétaire",
      status: "rejected",
      votes: 156,
    },
    {
      id: "4",
      name: "Ousmane Ba",
      email: "ousmane.ba@email.sn",
      position: "Trésorier",
      status: "approved",
      votes: 201,
    },
  ];

  const mockElections = [
    {
      id: "1",
      title: "Élection Présidentielle Sénégal 2024",
      status: ElectionStatus.VOTING,
      startDate: "2024-03-15",
      endDate: "2024-03-20",
      totalVotes: 1247,
      totalVoters: 2500,
    },
    {
      id: "2",
      title: "Élection Législatives 2024",
      status: ElectionStatus.CANDIDACY,
      startDate: "2024-04-10",
      endDate: "2024-04-15",
      totalVotes: 0,
      totalVoters: 2500,
    },
  ];

  const stats = {
    totalVoters: 2500,
    pendingVoters: 45,
    approvedCandidates: 12,
    activeElections: 2,
    totalVotes: 1247,
    participationRate: 49.9,
    pendingCandidates: 8,
    completedElections: 5,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getElectionStatusColor = (status: ElectionStatus) => {
    switch (status) {
      case ElectionStatus.VOTING:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ElectionStatus.CANDIDACY:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case ElectionStatus.RESULTS:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getElectionStatusText = (status: ElectionStatus) => {
    switch (status) {
      case ElectionStatus.DRAFT:
        return "Brouillon";
      case ElectionStatus.CANDIDACY:
        return "Candidatures";
      case ElectionStatus.VOTING:
        return "Vote en cours";
      case ElectionStatus.RESULTS:
        return "Résultats";
      case ElectionStatus.CLOSED:
        return "Clôturée";
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
              Dashboard Administrateur
            </h1>
            <p className="text-muted-foreground mt-1">
              Bienvenue, {currentUser?.firstName} {currentUser?.lastName}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Électeurs inscrits
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVoters}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.pendingVoters} en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Candidats approuvés
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.approvedCandidates}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats.pendingCandidates} en attente
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
              <div className="text-2xl font-bold">{stats.activeElections}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedElections} terminées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taux de participation
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.participationRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalVotes} votes exprimés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto p-6 flex flex-col space-y-2">
                <Vote className="h-8 w-8" />
                <span className="text-sm font-medium">Créer une élection</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col space-y-2"
              >
                <Users className="h-8 w-8" />
                <span className="text-sm font-medium">Gérer les électeurs</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col space-y-2"
              >
                <BarChart3 className="h-8 w-8" />
                <span className="text-sm font-medium">Voir les résultats</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Elections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Élections récentes</span>
              </CardTitle>
              <CardDescription>
                État des élections en cours et à venir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockElections.map((election) => (
                  <div
                    key={election.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{election.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(election.startDate).toLocaleDateString(
                          "fr-FR",
                        )}{" "}
                        -{" "}
                        {new Date(election.endDate).toLocaleDateString("fr-FR")}
                      </p>
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          {election.totalVotes}/{election.totalVoters} votes
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={getElectionStatusColor(election.status)}
                    >
                      {getElectionStatusText(election.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Candidates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Candidats récents</span>
              </CardTitle>
              <CardDescription>Dernières candidatures soumises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCandidates.slice(0, 4).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {candidate.position}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.email}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(candidate.status)}
                    >
                      {candidate.status === "approved"
                        ? "Approuvé"
                        : candidate.status === "pending"
                          ? "En attente"
                          : "Rejeté"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Activité récente</span>
            </CardTitle>
            <CardDescription>
              Dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Candidature d'Aissatou Diop approuvée
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il y a 2 heures
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    15 nouveaux électeurs inscrits
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il y a 4 heures
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Vote className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Élection Présidentielle 2024 démarrée
                  </p>
                  <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    8 candidatures en attente de validation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il y a 2 jours
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
