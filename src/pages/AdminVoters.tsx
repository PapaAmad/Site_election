import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  UserPlus,
} from "lucide-react";
import { UserRole, UserStatus, User } from "@/lib/types";
import { apiClient } from "@/lib/api";

const AdminVoters = () => {
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedVoter, setSelectedVoter] = useState<any>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const [voters, setVoters] = useState<User[]>([]);

  // Load voters from API
  useEffect(() => {
    const loadVoters = async () => {
      try {
        const response = await apiClient.getVoters();
        setVoters(response.users);
      } catch (error) {
        console.error("Failed to load voters:", error);
        // Handle error (show toast, etc.)
      }
    };

    loadVoters();
  }, []);

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case UserStatus.APPROVED:
        return "bg-green-100 text-green-800 border-green-200";
      case UserStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      case UserStatus.BLOCKED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case UserStatus.PENDING:
        return "En attente";
      case UserStatus.APPROVED:
        return "Approuvé";
      case UserStatus.REJECTED:
        return "Rejeté";
      case UserStatus.BLOCKED:
        return "Bloqué";
      default:
        return status;
    }
  };

  const updateUserStatus = async (userId: string, newStatus: UserStatus) => {
    try {
      await apiClient.updateUserStatus(userId, newStatus);

      // Update local state
      setVoters((prev) =>
        prev.map((voter) =>
          voter.id === userId ? { ...voter, status: newStatus } : voter,
        ),
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Erreur lors de la mise à jour du statut utilisateur.");
    }
  };

  const approveVoter = async (voterId: string) => {
    await updateUserStatus(voterId, UserStatus.APPROVED);

    // Show success notification
    const voter = voters.find((v) => v.id === voterId);
    if (voter) {
      alert(
        `Électeur ${voter.firstName} ${voter.lastName} approuvé avec succès !`,
      );
    }
  };

  const rejectVoter = async (voterId: string) => {
    await updateUserStatus(voterId, UserStatus.REJECTED);

    const voter = voters.find((v) => v.id === voterId);
    if (voter) {
      alert(`Électeur ${voter.firstName} ${voter.lastName} rejeté.`);
    }
  };

  const blockVoter = async (voterId: string) => {
    await updateUserStatus(voterId, UserStatus.BLOCKED);
    setShowBlockDialog(false);

    const voter = voters.find((v) => v.id === voterId);
    if (voter) {
      alert(`Électeur ${voter.firstName} ${voter.lastName} bloqué.`);
    }
  };

  const unblockVoter = async (voterId: string) => {
    await updateUserStatus(voterId, UserStatus.APPROVED);

    const voter = voters.find((v) => v.id === voterId);
    if (voter) {
      alert(`Électeur ${voter.firstName} ${voter.lastName} débloqué.`);
    }
  };

  const filteredVoters = voters.filter((voter) => {
    const matchesSearch =
      voter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || voter.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: voters.length,
    pending: voters.filter((v) => v.status === UserStatus.PENDING).length,
    approved: voters.filter((v) => v.status === UserStatus.APPROVED).length,
    rejected: voters.filter((v) => v.status === UserStatus.REJECTED).length,
    blocked: voters.filter((v) => v.status === UserStatus.BLOCKED).length,
    activeVoters: voters.filter(
      (v) => v.status === UserStatus.APPROVED && v.lastLogin,
    ).length,
    participationRate: 0, // Will be calculated when we have vote data
  };

  const exportVoters = () => {
    let csv =
      "Nom,Prénom,Email,Rôle,Statut,Date d'inscription,Dernière connexion\n";
    filteredVoters.forEach((voter) => {
      csv += `"${voter.lastName}","${voter.firstName}","${voter.email}","${voter.role}","${getStatusText(voter.status)}","${new Date(voter.createdAt).toLocaleDateString("fr-FR")}","${voter.lastLogin ? new Date(voter.lastLogin).toLocaleDateString("fr-FR") : "Jamais"}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "electeurs.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Gestion des électeurs
            </h1>
            <p className="text-muted-foreground mt-1">
              Validez et gérez tous les comptes électeurs de la plateforme
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter des électeurs
            </Button>
            <Button onClick={exportVoters} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total électeurs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.activeVoters}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bloqués</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats.blocked}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Participation
              </CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.participationRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending voters alert */}
        {stats.pending > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>{stats.pending} électeur(s)</strong> en attente de
              validation nécessitent votre attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Recherche et filtres</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rechercher
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom, prénom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value={UserStatus.PENDING}>
                      En attente
                    </SelectItem>
                    <SelectItem value={UserStatus.APPROVED}>
                      Approuvés
                    </SelectItem>
                    <SelectItem value={UserStatus.REJECTED}>Rejetés</SelectItem>
                    <SelectItem value={UserStatus.BLOCKED}>Bloqués</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voters List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des électeurs ({filteredVoters.length})</CardTitle>
            <CardDescription>
              Gérez les comptes électeurs et leurs permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Électeur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Participation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVoters.map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {voter.firstName} {voter.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {voter.email}
                        </div>
                      </div>
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
                      <div className="text-sm">
                        {new Date(voter.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {voter.lastLogin
                          ? new Date(voter.lastLogin).toLocaleDateString(
                              "fr-FR",
                            )
                          : "Jamais"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>0/0 élections</div>
                        <div className="text-muted-foreground">N/A</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {voter.status === UserStatus.PENDING && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => approveVoter(voter.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Valider
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => rejectVoter(voter.id)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </>
                        )}

                        {voter.status === UserStatus.APPROVED && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVoter(voter);
                              setShowBlockDialog(true);
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Bloquer
                          </Button>
                        )}

                        {voter.status === UserStatus.BLOCKED && (
                          <Button
                            size="sm"
                            onClick={() => unblockVoter(voter.id)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Débloquer
                          </Button>
                        )}

                        {(voter.status === UserStatus.REJECTED ||
                          voter.status === UserStatus.BLOCKED) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approveVoter(voter.id)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Réactiver
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredVoters.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun électeur trouvé
                </h3>
                <p className="text-muted-foreground">
                  Aucun électeur ne correspond aux critères de recherche.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Block Confirmation Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquer l'électeur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir bloquer{" "}
              <strong>
                {selectedVoter?.firstName} {selectedVoter?.lastName}
              </strong>{" "}
              ? Cette action empêchera l'électeur de se connecter et de voter.
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              L'électeur bloqué ne pourra plus accéder à son compte ni
              participer aux votes. Vous pourrez débloquer le compte à tout
              moment.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedVoter && blockVoter(selectedVoter.id)}
            >
              Confirmer le blocage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVoters;
