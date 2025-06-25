import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Calendar,
  Users,
  Vote,
  Settings,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
} from "lucide-react";
import { UserRole, ElectionStatus } from "@/lib/types";

const AdminElections = () => {
  const { currentUser } = useAuth();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [newElection, setNewElection] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    candidacyEndDate: "",
    positions: [{ name: "", description: "", numberOfSeats: 1 }],
  });

  // Mock elections data
  const [elections, setElections] = useState([
    {
      id: "1",
      name: "Élection du Conseil Étudiant 2024",
      description:
        "Élection des représentants étudiants pour le mandat 2024-2025",
      status: ElectionStatus.VOTING_OPEN,
      startDate: "2024-03-15T08:00:00Z",
      endDate: "2024-03-20T18:00:00Z",
      candidacyEndDate: "2024-03-10T23:59:59Z",
      totalVoters: 247,
      totalVotes: 156,
      positions: [
        { id: "1", name: "Président", numberOfSeats: 1, candidates: 2 },
        { id: "2", name: "Vice-Président", numberOfSeats: 2, candidates: 3 },
      ],
      createdAt: "2024-02-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Élection du Bureau des Étudiants",
      description: "Renouvellement du bureau des étudiants",
      status: ElectionStatus.RESULTS_PUBLISHED,
      startDate: "2024-02-01T08:00:00Z",
      endDate: "2024-02-07T18:00:00Z",
      candidacyEndDate: "2024-01-25T23:59:59Z",
      totalVoters: 120,
      totalVotes: 89,
      positions: [
        {
          id: "3",
          name: "Secrétaire Général",
          numberOfSeats: 1,
          candidates: 2,
        },
      ],
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "3",
      name: "Référendum - Nouveaux Services",
      description: "Consultation sur la mise en place de nouveaux services",
      status: ElectionStatus.DRAFT,
      startDate: "2024-04-01T08:00:00Z",
      endDate: "2024-04-05T18:00:00Z",
      candidacyEndDate: "2024-03-25T23:59:59Z",
      totalVoters: 0,
      totalVotes: 0,
      positions: [
        { id: "4", name: "Question 1", numberOfSeats: 1, candidates: 0 },
        { id: "5", name: "Question 2", numberOfSeats: 1, candidates: 0 },
      ],
      createdAt: "2024-03-01T10:00:00Z",
    },
  ]);

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

  const addPosition = () => {
    setNewElection((prev) => ({
      ...prev,
      positions: [
        ...prev.positions,
        { name: "", description: "", numberOfSeats: 1 },
      ],
    }));
  };

  const removePosition = (index: number) => {
    setNewElection((prev) => ({
      ...prev,
      positions: prev.positions.filter((_, i) => i !== index),
    }));
  };

  const updatePosition = (index: number, field: string, value: any) => {
    setNewElection((prev) => ({
      ...prev,
      positions: prev.positions.map((pos, i) =>
        i === index ? { ...pos, [field]: value } : pos,
      ),
    }));
  };

  const handleCreateElection = () => {
    // Validate required fields
    if (
      !newElection.name ||
      !newElection.startDate ||
      !newElection.endDate ||
      !newElection.candidacyEndDate
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (newElection.positions.some((p) => !p.name)) {
      alert("Veuillez nommer tous les postes.");
      return;
    }

    // Simulate API call
    const id = (elections.length + 1).toString();
    const election = {
      id,
      ...newElection,
      status: ElectionStatus.DRAFT,
      totalVoters: 0,
      totalVotes: 0,
      positions: newElection.positions.map((pos, i) => ({
        id: `pos_${id}_${i}`,
        ...pos,
        candidates: 0,
      })),
      createdAt: new Date().toISOString(),
    };

    setElections((prev) => [election, ...prev]);
    setNewElection({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      candidacyEndDate: "",
      positions: [{ name: "", description: "", numberOfSeats: 1 }],
    });
    setShowCreateDialog(false);

    // Show success message
    alert(`Élection "${election.name}" créée avec succès !`);
  };

  const changeElectionStatus = (
    electionId: string,
    newStatus: ElectionStatus,
  ) => {
    setElections((prev) =>
      prev.map((election) =>
        election.id === electionId
          ? { ...election, status: newStatus }
          : election,
      ),
    );
  };

  const deleteElection = (electionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette élection ?")) {
      setElections((prev) => prev.filter((e) => e.id !== electionId));
    }
  };

  const canDelete = (status: ElectionStatus) => {
    return status === ElectionStatus.DRAFT;
  };

  const canModify = (status: ElectionStatus) => {
    return (
      status === ElectionStatus.DRAFT ||
      status === ElectionStatus.OPEN_FOR_CANDIDACY
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Gestion des élections
            </h1>
            <p className="text-muted-foreground mt-1">
              Créez, modifiez et gérez toutes les élections de la plateforme
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle élection
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total élections
              </CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{elections.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Élections actives
              </CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  elections.filter(
                    (e) => e.status === ElectionStatus.VOTING_OPEN,
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  elections.filter((e) => e.status === ElectionStatus.DRAFT)
                    .length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total votes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {elections.reduce((sum, e) => sum + e.totalVotes, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Elections List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des élections</CardTitle>
            <CardDescription>
              Gérez toutes les élections et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élection</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Postes</TableHead>
                  <TableHead>Participation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elections.map((election) => (
                  <TableRow key={election.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{election.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {election.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(election.status)}
                      >
                        {getStatusText(election.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          Du{" "}
                          {new Date(election.startDate).toLocaleDateString(
                            "fr-FR",
                          )}
                        </div>
                        <div>
                          Au{" "}
                          {new Date(election.endDate).toLocaleDateString(
                            "fr-FR",
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{election.positions.length} postes</div>
                        <div className="text-muted-foreground">
                          {election.positions.reduce(
                            (sum, pos) => sum + pos.candidates,
                            0,
                          )}{" "}
                          candidats
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{election.totalVotes} votes</div>
                        <div className="text-muted-foreground">
                          /{election.totalVoters} électeurs
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>

                        {canModify(election.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedElection(election);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        )}

                        {election.status === ElectionStatus.DRAFT && (
                          <Button
                            size="sm"
                            onClick={() =>
                              changeElectionStatus(
                                election.id,
                                ElectionStatus.OPEN_FOR_CANDIDACY,
                              )
                            }
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Publier
                          </Button>
                        )}

                        {election.status === ElectionStatus.VOTING_OPEN && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              changeElectionStatus(
                                election.id,
                                ElectionStatus.VOTING_CLOSED,
                              )
                            }
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Fermer
                          </Button>
                        )}

                        {canDelete(election.status) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteElection(election.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      </main>

      {/* Create Election Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle élection</DialogTitle>
            <DialogDescription>
              Configurez les détails de votre élection et définissez les postes
              à pourvoir.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de l'élection *</Label>
                  <Input
                    id="name"
                    value={newElection.name}
                    onChange={(e) =>
                      setNewElection((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Ex: Élection du Conseil Étudiant 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newElection.description}
                    onChange={(e) =>
                      setNewElection((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description courte de l'élection"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Calendrier</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="candidacyEndDate">
                    Fin des candidatures *
                  </Label>
                  <Input
                    id="candidacyEndDate"
                    type="datetime-local"
                    value={newElection.candidacyEndDate}
                    onChange={(e) =>
                      setNewElection((prev) => ({
                        ...prev,
                        candidacyEndDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Début du vote *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={newElection.startDate}
                    onChange={(e) =>
                      setNewElection((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fin du vote *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={newElection.endDate}
                    onChange={(e) =>
                      setNewElection((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Positions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Postes à pourvoir ({newElection.positions.length})
                </h3>
                <Button type="button" onClick={addPosition} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un poste
                </Button>
              </div>

              <div className="space-y-4">
                {newElection.positions.map((position, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4">
                          <Label>Nom du poste *</Label>
                          <Input
                            value={position.name}
                            onChange={(e) =>
                              updatePosition(index, "name", e.target.value)
                            }
                            placeholder="Ex: Président"
                          />
                        </div>
                        <div className="md:col-span-5">
                          <Label>Description</Label>
                          <Input
                            value={position.description}
                            onChange={(e) =>
                              updatePosition(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Rôle et responsabilités"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Sièges *</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={position.numberOfSeats}
                            onChange={(e) =>
                              updatePosition(
                                index,
                                "numberOfSeats",
                                parseInt(e.target.value) || 1,
                              )
                            }
                          />
                        </div>
                        <div className="md:col-span-1">
                          {newElection.positions.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removePosition(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateElection}
              disabled={
                !newElection.name ||
                !newElection.startDate ||
                !newElection.endDate ||
                !newElection.candidacyEndDate ||
                newElection.positions.some((p) => !p.name)
              }
            >
              Créer l'élection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminElections;
