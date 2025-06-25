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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SimpleBarChart,
  SimplePieChart,
  SimpleProgressBar,
} from "@/components/charts/SimpleCharts";
import {
  Trophy,
  Users,
  TrendingUp,
  Download,
  Calendar,
  Vote,
  Award,
  BarChart3,
} from "lucide-react";
import { UserRole, Election, ElectionStatus } from "@/lib/types";

const ResultsPage = () => {
  const { currentUser } = useAuth();

  const [selectedElection, setSelectedElection] = useState("1");

  // Mock elections data with results
  const elections = [
    {
      id: "1",
      name: "Élection du Conseil Étudiant 2024",
      description:
        "Élection des représentants étudiants pour le mandat 2024-2025",
      status: ElectionStatus.RESULTS_PUBLISHED,
      endDate: "2024-03-20",
      totalVoters: 247,
      totalVotes: 189,
      participationRate: 76.5,
      positions: [
        {
          id: "1",
          name: "Président",
          numberOfSeats: 1,
          totalVotes: 189,
          candidates: [
            {
              id: "1",
              name: "Pierre Martin",
              votes: 112,
              percentage: 59.3,
              elected: true,
            },
            {
              id: "2",
              name: "Marie Dubois",
              votes: 77,
              percentage: 40.7,
              elected: false,
            },
          ],
        },
        {
          id: "2",
          name: "Vice-Président",
          numberOfSeats: 2,
          totalVotes: 189,
          candidates: [
            {
              id: "3",
              name: "Thomas Bernard",
              votes: 98,
              percentage: 51.9,
              elected: true,
            },
            {
              id: "4",
              name: "Sophie Moreau",
              votes: 87,
              percentage: 46.0,
              elected: true,
            },
            {
              id: "5",
              name: "Alexandre Petit",
              votes: 73,
              percentage: 38.6,
              elected: false,
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Élection du Bureau des Étudiants",
      description: "Renouvellement du bureau des étudiants",
      status: ElectionStatus.RESULTS_PUBLISHED,
      endDate: "2024-02-07",
      totalVoters: 120,
      totalVotes: 89,
      participationRate: 74.2,
      positions: [
        {
          id: "3",
          name: "Secrétaire Général",
          numberOfSeats: 1,
          totalVotes: 89,
          candidates: [
            {
              id: "6",
              name: "Claire Moreau",
              votes: 52,
              percentage: 58.4,
              elected: true,
            },
            {
              id: "7",
              name: "Lucas Durand",
              votes: 37,
              percentage: 41.6,
              elected: false,
            },
          ],
        },
      ],
    },
  ];

  const selectedElectionData = elections.find((e) => e.id === selectedElection);

  const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];

  const getChartData = (position: any) => {
    return position.candidates.map((candidate: any, index: number) => ({
      name: candidate.name,
      votes: candidate.votes,
      percentage: candidate.percentage,
      color: COLORS[index % COLORS.length],
    }));
  };

  const exportResults = () => {
    if (!selectedElectionData) return;

    // Mock CSV export
    let csv = "Élection,Poste,Candidat,Votes,Pourcentage,Élu\n";
    selectedElectionData.positions.forEach((position) => {
      position.candidates.forEach((candidate) => {
        csv += `"${selectedElectionData.name}","${position.name}","${candidate.name}",${candidate.votes},${candidate.percentage}%,${candidate.elected ? "Oui" : "Non"}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultats-${selectedElectionData.name.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!selectedElectionData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentUser={currentUser} onLogout={() => {}} />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Aucune élection sélectionnée
          </h1>
          <Button onClick={() => (window.location.href = "/")}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Résultats des élections
            </h1>
            <p className="text-muted-foreground mt-1">
              Consultez les résultats officiels des élections terminées
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={selectedElection}
              onValueChange={setSelectedElection}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Sélectionnez une élection" />
              </SelectTrigger>
              <SelectContent>
                {elections.map((election) => (
                  <SelectItem key={election.id} value={election.id}>
                    {election.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportResults} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Election Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {selectedElectionData.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {selectedElectionData.description}
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 border-green-200"
              >
                Résultats publiés
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedElectionData.participationRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Participation
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedElectionData.totalVotes}
                </div>
                <div className="text-sm text-muted-foreground">
                  Votes exprimés
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedElectionData.totalVoters}
                </div>
                <div className="text-sm text-muted-foreground">
                  Électeurs inscrits
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedElectionData.positions.length}
                </div>
                <div className="text-sm text-muted-foreground">Postes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results by Position */}
        <div className="space-y-8">
          {selectedElectionData.positions.map((position, index) => (
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
                    <CardDescription>
                      {position.numberOfSeats} siège
                      {position.numberOfSeats > 1 ? "s" : ""} à pourvoir •
                      {position.totalVotes} votes exprimés
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {position.candidates.filter((c) => c.elected).length} élu
                      {position.candidates.filter((c) => c.elected).length > 1
                        ? "s"
                        : ""}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="results" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="results">Résultats</TabsTrigger>
                    <TabsTrigger value="chart">Graphique</TabsTrigger>
                    <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  </TabsList>

                  <TabsContent value="results" className="space-y-4 mt-6">
                    {position.candidates
                      .sort((a, b) => b.votes - a.votes)
                      .map((candidate, candidateIndex) => (
                        <div
                          key={candidate.id}
                          className={`p-4 border rounded-lg ${
                            candidate.elected
                              ? "bg-green-50 border-green-200"
                              : "bg-background border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  candidate.elected
                                    ? "bg-green-600 text-white"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {candidateIndex + 1}
                              </div>
                              <div>
                                <div className="font-medium flex items-center space-x-2">
                                  <span>{candidate.name}</span>
                                  {candidate.elected && (
                                    <Badge className="bg-green-600 hover:bg-green-700">
                                      <Trophy className="h-3 w-3 mr-1" />
                                      Élu
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">
                                {candidate.votes} votes
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {candidate.percentage}%
                              </div>
                            </div>
                          </div>
                          <Progress
                            value={candidate.percentage}
                            className="h-2"
                          />
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="chart" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Bar Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Répartition des votes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <SimpleBarChart
                            data={getChartData(position)}
                            height={300}
                          />
                        </CardContent>
                      </Card>

                      {/* Pie Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Répartition en pourcentages
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <SimplePieChart
                            data={getChartData(position)}
                            size={280}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {position.candidates.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Candidats
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Vote className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {position.totalVotes}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Votes exprimés
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold">
                            {Math.max(
                              ...position.candidates.map((c) => c.votes),
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Votes max
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Analyse des résultats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Écart entre 1er et 2ème :</span>
                            <span className="font-medium">
                              {position.candidates.length > 1
                                ? `${Math.abs(position.candidates[0].votes - position.candidates[1].votes)} votes`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Moyenne des votes :</span>
                            <span className="font-medium">
                              {Math.round(
                                position.candidates.reduce(
                                  (sum, c) => sum + c.votes,
                                  0,
                                ) / position.candidates.length,
                              )}{" "}
                              votes
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Seuil d'élection :</span>
                            <span className="font-medium">
                              {position.numberOfSeats === 1
                                ? "Majorité relative"
                                : `Top ${position.numberOfSeats}`}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Statistiques globales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {selectedElectionData.participationRate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Taux de participation
                </div>
              </div>

              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {selectedElectionData.totalVotes}
                </div>
                <div className="text-sm text-muted-foreground">
                  Bulletins valides
                </div>
              </div>

              <div className="text-center">
                <Vote className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {selectedElectionData.positions.reduce(
                    (sum, pos) =>
                      sum + pos.candidates.filter((c) => c.elected).length,
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Représentants élus
                </div>
              </div>

              <div className="text-center">
                <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {new Date(selectedElectionData.endDate).toLocaleDateString(
                    "fr-FR",
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Date de clôture
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ResultsPage;
