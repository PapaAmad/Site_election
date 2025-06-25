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
  UserCheck,
  UserX,
  Eye,
  FileText,
  Image as ImageIcon,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
} from "lucide-react";
import { UserRole, CandidateStatus, ElectionStatus } from "@/lib/types";

const AdminCandidates = () => {
  const { currentUser } = useAuth();

  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterElection, setFilterElection] = useState<string>("all");

  // Mock candidates data
  const [candidates, setCandidates] = useState([
    {
      id: "1",
      firstName: "Aïssatou",
      lastName: "Diop",
      email: "aissatou.diop@education.sn",
      electionName: "Élection du Conseil Étudiant 2024",
      positionName: "Président",
      status: CandidateStatus.PENDING,
      submittedAt: "2024-03-10T10:00:00Z",
      reviewedAt: null,
      rejectionReason: null,
      description:
        "Étudiante en Master 2 Communication, passionnée par l'engagement étudiant et l'amélioration de la vie sur le campus de l'UCAD.",
      experience:
        "Déléguée de classe depuis 2 ans, membre du bureau des étudiants en communication",
      motivation:
        "Je souhaite représenter les étudiants et porter leurs voix pour améliorer les conditions d'études et la vie associative.",
      program:
        "1. Amélioration des infrastructures\n2. Développement de la vie associative\n3. Renforcement des services aux étudiants",
      hasPhoto: true,
      hasDocument: true,
      electionStatus: ElectionStatus.OPEN_FOR_CANDIDACY,
    },
    {
      id: "2",
      firstName: "Mamadou",
      lastName: "Fall",
      email: "mamadou.fall@education.sn",
      electionName: "Élection du Conseil Étudiant 2024",
      positionName: "Vice-Président",
      status: CandidateStatus.APPROVED,
      submittedAt: "2024-03-08T14:30:00Z",
      reviewedAt: "2024-03-09T09:15:00Z",
      rejectionReason: null,
      description:
        "Étudiant en Master 1 Management, expérience associative de 3 ans",
      experience:
        "Président de l'association sportive, organisateur d'événements étudiants",
      motivation:
        "Améliorer la représentation étudiante et faciliter la communication avec l'administration",
      program:
        "1. Digitalisation des services\n2. Amélioration de la restauration\n3. Développement durable",
      hasPhoto: true,
      hasDocument: false,
      electionStatus: ElectionStatus.VOTING_OPEN,
    },
    {
      id: "3",
      firstName: "Fatou",
      lastName: "Sarr",
      email: "fatou.sarr@education.sn",
      electionName: "Élection du Bureau des Étudiants",
      positionName: "Secrétaire",
      status: CandidateStatus.REJECTED,
      submittedAt: "2024-02-28T16:45:00Z",
      reviewedAt: "2024-03-01T11:20:00Z",
      rejectionReason:
        "Dossier incomplet : manque de détails sur l'expérience et motivation insuffisamment développée.",
      description: "Étudiante en Licence 3 Droit à l'Université Cheikh Anta Diop",
      experience: "Aucune expérience associative mentionnée",
      motivation: "Je veux aider",
      program: "",
      hasPhoto: false,
      hasDocument: false,
      electionStatus: ElectionStatus.RESULTS_PUBLISHED,
    },
    {
      id: "4",
      firstName: "Ibrahima",
      lastName: "Ba",
      email: "ibrahima.ba@education.sn",
      electionName: "Élection du Conseil Étudiant 2024",
      positionName: "Secrétaire",
      status: CandidateStatus.PENDING,
      submittedAt: "2024-03-12T09:30:00Z",
      reviewedAt: null,
      rejectionReason: null,
      description:
        "Étudiant en Master 1 Informatique, passionné par l'organisation et la communication",
      experience:
        "Secrétaire de l'association informatique, rédacteur du journal étudiant",
      motivation:
        "Mettre mes compétences organisationnelles au service de la représentation étudiante",
      program:
        "1. Amélioration de la communication\n2. Modernisation des processus\n3. Transparence des décisions",
      hasPhoto: true,
      hasDocument: true,
      electionStatus: ElectionStatus.OPEN_FOR_CANDIDACY,
    },
  ]);

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

  const approveCandidate = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: CandidateStatus.APPROVED,
              reviewedAt: new Date().toISOString(),
            }
          : candidate,
      ),
    );

    // Show success notification
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate) {
      alert(
        `Candidature de ${candidate.firstName} ${candidate.lastName} approuvée avec succès !`,
      );
    }
  };

  const rejectCandidate = (candidateId: string, reason: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: CandidateStatus.REJECTED,
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
            }
          : candidate,
      ),
    );
    setShowRejectDialog(false);
    setRejectionReason("");
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const statusMatch =
      filterStatus === "all" || candidate.status === filterStatus;
    const electionMatch =
      filterElection === "all" || candidate.electionName === filterElection;
    return statusMatch && electionMatch;
  });

  const stats = {
    total: candidates.length,
    pending: candidates.filter((c) => c.status === CandidateStatus.PENDING)
      .length,
    approved: candidates.filter((c) => c.status === CandidateStatus.APPROVED)
      .length,
    rejected: candidates.filter((c) => c.status === CandidateStatus.REJECTED)
      .length,
  };

  const elections = [...new Set(candidates.map((c) => c.electionName))];

  const exportCandidates = () => {
    let csv =
      "Nom,Prénom,Email,Élection,Poste,Statut,Date de soumission,Date de révision\n";
    filteredCandidates.forEach((candidate) => {
      csv += `"${candidate.lastName}","${candidate.firstName}","${candidate.email}","${candidate.electionName}","${candidate.positionName}","${getStatusText(candidate.status)}","${new Date(candidate.submittedAt).toLocaleDateString("fr-FR")}","${candidate.reviewedAt ? new Date(candidate.reviewedAt).toLocaleDateString("fr-FR") : ""}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidatures.csv";
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
              Gestion des candidatures
            </h1>
            <p className="text-muted-foreground mt-1">
              Validez, rejetez et gérez toutes les candidatures
            </p>
          </div>
          <Button onClick={exportCandidates} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total candidatures
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
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
              <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending candidates alert */}
        {stats.pending > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>{stats.pending} candidature(s)</strong> en attente de
              validation nécessitent votre attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtres</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value={CandidateStatus.PENDING}>
                      En attente
                    </SelectItem>
                    <SelectItem value={CandidateStatus.APPROVED}>
                      Approuvées
                    </SelectItem>
                    <SelectItem value={CandidateStatus.REJECTED}>
                      Rejetées
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Élection
                </label>
                <Select
                  value={filterElection}
                  onValueChange={setFilterElection}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les élections</SelectItem>
                    {elections.map((election) => (
                      <SelectItem key={election} value={election}>
                        {election}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterElection("all");
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Liste des candidatures ({filteredCandidates.length})
            </CardTitle>
            <CardDescription>
              Gérez et validez les candidatures soumises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Élection/Poste</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Soumission</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {candidate.firstName} {candidate.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {candidate.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {candidate.electionName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {candidate.positionName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(candidate.status)}
                      >
                        {getStatusText(candidate.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {candidate.hasPhoto && (
                          <ImageIcon className="h-4 w-4 text-green-600" />
                        )}
                        {candidate.hasDocument && (
                          <FileText className="h-4 w-4 text-blue-600" />
                        )}
                        {!candidate.hasPhoto && !candidate.hasDocument && (
                          <span className="text-sm text-muted-foreground">
                            Aucun
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(candidate.submittedAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowDetailDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>

                        {candidate.status === CandidateStatus.PENDING && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => approveCandidate(candidate.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setShowRejectDialog(true);
                              }}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredCandidates.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucune candidature trouvée
                </h3>
                <p className="text-muted-foreground">
                  Aucune candidature ne correspond aux filtres sélectionnés.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Candidate Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Candidature de {selectedCandidate?.firstName}{" "}
              {selectedCandidate?.lastName}
            </DialogTitle>
            <DialogDescription>
              {selectedCandidate?.electionName} -{" "}
              {selectedCandidate?.positionName}
            </DialogDescription>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-6">
              {/* Status and Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email :</span>
                      <span className="ml-2">{selectedCandidate.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Statut :</span>
                      <Badge
                        variant="secondary"
                        className={`ml-2 ${getStatusColor(selectedCandidate.status)}`}
                      >
                        {getStatusText(selectedCandidate.status)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Soumise le :
                      </span>
                      <span className="ml-2">
                        {new Date(
                          selectedCandidate.submittedAt,
                        ).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {selectedCandidate.reviewedAt && (
                      <div>
                        <span className="text-muted-foreground">
                          Révisée le :
                        </span>
                        <span className="ml-2">
                          {new Date(
                            selectedCandidate.reviewedAt,
                          ).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Documents joints</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm">
                        Photo :{" "}
                        {selectedCandidate.hasPhoto ? (
                          <span className="text-green-600">Oui</span>
                        ) : (
                          <span className="text-red-600">Non</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">
                        Programme PDF :{" "}
                        {selectedCandidate.hasDocument ? (
                          <span className="text-green-600">Oui</span>
                        ) : (
                          <span className="text-red-600">Non</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Présentation</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Expérience</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.experience}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Motivations</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.motivation}
                  </p>
                </div>

                {selectedCandidate.program && (
                  <div>
                    <h4 className="font-medium mb-2">Programme</h4>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedCandidate.program}
                    </pre>
                  </div>
                )}

                {selectedCandidate.rejectionReason && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Motif de rejet :</strong>{" "}
                      {selectedCandidate.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
            >
              Fermer
            </Button>

            {selectedCandidate?.status === CandidateStatus.PENDING && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    approveCandidate(selectedCandidate.id);
                    setShowDetailDialog(false);
                  }}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetailDialog(false);
                    setShowRejectDialog(true);
                  }}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la candidature</DialogTitle>
            <DialogDescription>
              Veuillez indiquer le motif de rejet pour informer le candidat.
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="reason">Motif de rejet *</Label>
            <Textarea
              id="reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Expliquez clairement les raisons du rejet..."
              className="mt-2"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim()}
              onClick={() =>
                selectedCandidate &&
                rejectCandidate(selectedCandidate.id, rejectionReason)
              }
            >
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCandidates;
