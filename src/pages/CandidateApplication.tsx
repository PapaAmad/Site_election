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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  User,
  CheckCircle,
  AlertTriangle,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { UserRole } from "@/lib/types";

const CandidateApplication = () => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    electionId: "",
    positionId: "",
    description: "",
    motivation: "",
    experience: "",
    program: "",
    photo: null as File | null,
    document: null as File | null,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock elections and positions data
  const availableElections = [
    {
      id: "1",
      name: "Élection du Conseil Étudiant 2024",
      description:
        "Élection des représentants étudiants pour le mandat 2024-2025",
      candidacyEndDate: "2024-03-25T23:59:59Z",
      positions: [
        {
          id: "1",
          name: "Président",
          description: "Président du conseil étudiant - Mandat de 2 ans",
          numberOfSeats: 1,
          requirements:
            "Étudiant inscrit en Master 1 ou 2, expérience associative souhaitée",
        },
        {
          id: "2",
          name: "Vice-Président",
          description: "Vice-Président du conseil étudiant - Mandat de 2 ans",
          numberOfSeats: 2,
          requirements: "Étudiant inscrit, expérience en gestion de projet",
        },
        {
          id: "3",
          name: "Secrétaire",
          description: "Secrétaire du conseil étudiant - Mandat de 2 ans",
          numberOfSeats: 1,
          requirements:
            "Bonnes compétences rédactionnelles et organisationnelles",
        },
      ],
    },
    {
      id: "2",
      name: "Élection du Bureau des Étudiants",
      description: "Renouvellement du bureau des étudiants",
      candidacyEndDate: "2024-04-10T23:59:59Z",
      positions: [
        {
          id: "4",
          name: "Président BDE",
          description: "Président du bureau des étudiants",
          numberOfSeats: 1,
          requirements: "Leadership, expérience événementielle",
        },
        {
          id: "5",
          name: "Responsable Communication",
          description: "Responsable communication du BDE",
          numberOfSeats: 1,
          requirements: "Compétences en communication digitale et graphisme",
        },
      ],
    },
  ];

  const selectedElection = availableElections.find(
    (e) => e.id === formData.electionId,
  );
  const selectedPosition = selectedElection?.positions.find(
    (p) => p.id === formData.positionId,
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const isFormValid = () => {
    return (
      formData.electionId &&
      formData.positionId &&
      formData.description.trim() &&
      formData.motivation.trim() &&
      formData.experience.trim()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setShowConfirmation(true);
    }
  };

  const confirmSubmission = async () => {
    try {
      // Simulate API call with proper loading
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save application to localStorage (for demo purposes)
      const applicationData = {
        ...formData,
        id: `app-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: "pending",
        confirmationNumber: `CAND-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      };

      // Get existing applications or create new array
      const existingApps = JSON.parse(
        localStorage.getItem("user_applications") || "[]",
      );
      existingApps.push(applicationData);
      localStorage.setItem("user_applications", JSON.stringify(existingApps));

      setSubmitted(true);
      setShowConfirmation(false);
    } catch (error) {
      alert(
        "Erreur lors de la soumission de la candidature. Veuillez réessayer.",
      );
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - now.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-800 mb-2">
                Candidature déposée avec succès !
              </h1>
              <p className="text-green-700">
                Votre candidature a été transmise à l'administration pour
                validation.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de votre candidature</CardTitle>
              </CardHeader>
              <CardContent className="text-left space-y-4">
                <div>
                  <span className="font-medium">Élection :</span>
                  <span className="ml-2">{selectedElection?.name}</span>
                </div>
                <div>
                  <span className="font-medium">Poste :</span>
                  <span className="ml-2">{selectedPosition?.name}</span>
                </div>
                <div>
                  <span className="font-medium">Statut :</span>
                  <span className="ml-2 text-yellow-600 font-medium">
                    En attente de validation
                  </span>
                </div>
                <div>
                  <span className="font-medium">Numéro de candidature :</span>
                  <span className="ml-2 font-mono">
                    CAND-2024-
                    {Math.random().toString(36).substr(2, 6).toUpperCase()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Vous recevrez un email de confirmation une fois votre
                candidature validée par l'administration. En attendant, vous
                pouvez suivre l'état de votre candidature dans votre espace
                personnel.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => (window.location.href = "/candidate/dashboard")}
              >
                Mon espace candidat
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Retour à l'accueil
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

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Déposer une candidature
            </h1>
            <p className="text-muted-foreground">
              Complétez le formulaire ci-dessous pour déposer votre candidature
              à une élection
            </p>
          </div>

          {/* Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Information importante :</strong> Assurez-vous de bien
              remplir tous les champs obligatoires. Votre candidature sera
              soumise à validation par l'administration avant d'être publiée.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Election Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Sélection de l'élection</span>
                </CardTitle>
                <CardDescription>
                  Choisissez l'élection et le poste pour lequel vous souhaitez
                  candidater
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="election">Élection *</Label>
                  <Select
                    value={formData.electionId}
                    onValueChange={(value) =>
                      handleInputChange("electionId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une élection" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableElections.map((election) => (
                        <SelectItem key={election.id} value={election.id}>
                          <div>
                            <div className="font-medium">{election.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Candidatures jusqu'au{" "}
                              {new Date(
                                election.candidacyEndDate,
                              ).toLocaleDateString("fr-FR")}
                              {getDaysRemaining(election.candidacyEndDate) >
                                0 && (
                                <span className="ml-2 text-orange-600">
                                  ({getDaysRemaining(election.candidacyEndDate)}{" "}
                                  jours restants)
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedElection && (
                  <div>
                    <Label htmlFor="position">Poste *</Label>
                    <Select
                      value={formData.positionId}
                      onValueChange={(value) =>
                        handleInputChange("positionId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un poste" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedElection.positions.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            <div>
                              <div className="font-medium">{position.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {position.numberOfSeats} siège
                                {position.numberOfSeats > 1 ? "s" : ""} à
                                pourvoir
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedPosition && (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Poste : {selectedPosition.name}</strong>
                      <br />
                      {selectedPosition.description}
                      <br />
                      <em>Prérequis : {selectedPosition.requirements}</em>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Présentation personnelle</span>
                </CardTitle>
                <CardDescription>
                  Présentez-vous aux électeurs et expliquez vos motivations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">
                    Présentation personnelle *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Présentez-vous en quelques lignes (formation, parcours, centres d'intérêt...)"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/500 caractères
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">
                    Expérience et compétences *
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Décrivez votre expérience pertinente (associative, professionnelle, scolaire...)"
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.experience.length}/500 caractères
                  </div>
                </div>

                <div>
                  <Label htmlFor="motivation">Motivations et objectifs *</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Expliquez pourquoi vous candidatez et quels sont vos objectifs pour ce poste"
                    value={formData.motivation}
                    onChange={(e) =>
                      handleInputChange("motivation", e.target.value)
                    }
                    className="min-h-[120px]"
                    maxLength={800}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.motivation.length}/800 caractères
                  </div>
                </div>

                <div>
                  <Label htmlFor="program">Programme et propositions</Label>
                  <Textarea
                    id="program"
                    placeholder="Détaillez vos propositions et votre programme (optionnel, vous pourrez aussi joindre un document)"
                    value={formData.program}
                    onChange={(e) =>
                      handleInputChange("program", e.target.value)
                    }
                    className="min-h-[120px]"
                    maxLength={1000}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.program.length}/1000 caractères (optionnel)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>Documents</span>
                </CardTitle>
                <CardDescription>
                  Ajoutez une photo et/ou des documents de support (optionnel)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="photo">Photo de candidat</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        {formData.photo ? (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        ) : (
                          <User className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(
                              "photo",
                              e.target.files?.[0] || null,
                            )
                          }
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("photo")?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choisir une photo
                        </Button>
                        {formData.photo && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {formData.photo.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Format accepté : JPG, PNG. Taille maximale : 2MB. Photo
                      professionnelle recommandée.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="document">Programme détaillé (PDF)</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <Input
                          id="document"
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            handleFileChange(
                              "document",
                              e.target.files?.[0] || null,
                            )
                          }
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("document")?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Télécharger un PDF
                        </Button>
                        {formData.document && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {formData.document.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Format accepté : PDF uniquement. Taille maximale : 5MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">
                    Finaliser votre candidature
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vérifiez que toutes les informations sont correctes avant de
                    soumettre votre candidature.
                  </p>

                  {!isFormValid() && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Veuillez remplir tous les champs obligatoires (*) avant
                        de soumettre.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={!isFormValid()}
                    size="lg"
                    className="px-8"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Déposer ma candidature
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer votre candidature</DialogTitle>
            <DialogDescription>
              Veuillez vérifier les informations de votre candidature avant
              soumission finale. Une fois soumise, vous ne pourrez plus la
              modifier.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Élection :</span>
              <span className="ml-2">{selectedElection?.name}</span>
            </div>
            <div>
              <span className="font-medium">Poste :</span>
              <span className="ml-2">{selectedPosition?.name}</span>
            </div>
            <div>
              <span className="font-medium">Documents joints :</span>
              <div className="ml-2">
                {formData.photo && <div>• Photo de candidat</div>}
                {formData.document && <div>• Programme détaillé (PDF)</div>}
                {!formData.photo && !formData.document && (
                  <div>Aucun document</div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Modifier ma candidature
            </Button>
            <Button onClick={confirmSubmission}>Confirmer et soumettre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateApplication;
