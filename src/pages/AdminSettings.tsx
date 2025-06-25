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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Save,
  Mail,
  Shield,
  Database,
  Users,
  Bell,
  Globe,
  Palette,
  Server,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { UserRole } from "@/lib/types";

const AdminSettings = () => {
  const { currentUser } = useAuth();

  const [settings, setSettings] = useState({
    // General Settings
    platformName: "VoteSecure",
    platformDescription:
      "Plateforme de vote électronique sécurisée pour les institutions",
    contactEmail: "admin@votesecure.sn",
    supportEmail: "support@votesecure.sn",
    websiteUrl: "https://votesecure.sn",

    // Security Settings
    twoFactorRequired: false,
    passwordMinLength: 8,
    sessionTimeout: 120, // minutes
    maxLoginAttempts: 5,
    accountLockoutDuration: 30, // minutes

    // Email Settings
    emailEnabled: true,
    smtpServer: "smtp.votesecure.sn",
    smtpPort: 587,
    smtpUsername: "no-reply@votesecure.sn",
    smtpPassword: "••••••••••••",
    emailFrom: "VoteSecure <no-reply@votesecure.sn>",

    // Voting Settings
    allowLateVoting: false,
    voteConfirmationRequired: true,
    resultDisplayMode: "percentage", // percentage, numbers, both
    autoPublishResults: false,
    anonymousVoting: true,

    // Notifications
    emailNotifications: true,
    candidateApprovalNotification: true,
    voterApprovalNotification: true,
    electionStartNotification: true,
    electionEndNotification: true,

    // Appearance
    primaryColor: "#3B82F6",
    theme: "light", // light, dark, auto
    logoUrl: "",
    customCss: "",

    // Registration Settings
    autoApproveVoters: false,
    autoApproveCandidates: false,
    allowSelfRegistration: true,
    requireEmailVerification: true,
  });

  const [saveStatus, setSaveStatus] = useState<string>("");

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage for persistence
      localStorage.setItem("votesecure_settings", JSON.stringify(settings));

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      alert("Erreur lors de la sauvegarde des paramètres.");
      setSaveStatus("");
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "votesecure-settings.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir restaurer les paramètres par défaut ? Cette action est irréversible.",
      )
    ) {
      // Reset to default values
      setSettings({
        platformName: "VoteSecure",
        platformDescription:
          "Plateforme de vote électronique sécurisée pour les institutions",
        contactEmail: "admin@votesecure.sn",
        supportEmail: "support@votesecure.sn",
        websiteUrl: "https://votesecure.sn",
        twoFactorRequired: false,
        passwordMinLength: 8,
        sessionTimeout: 120,
        maxLoginAttempts: 5,
        accountLockoutDuration: 30,
        emailEnabled: true,
        smtpServer: "smtp.votesecure.sn",
        smtpPort: 587,
        smtpUsername: "no-reply@votesecure.sn",
        smtpPassword: "",
        emailFrom: "VoteSecure <no-reply@votesecure.sn>",
        allowLateVoting: false,
        voteConfirmationRequired: true,
        resultDisplayMode: "percentage",
        autoPublishResults: false,
        anonymousVoting: true,
        emailNotifications: true,
        candidateApprovalNotification: true,
        voterApprovalNotification: true,
        electionStartNotification: true,
        electionEndNotification: true,
        primaryColor: "#3B82F6",
        theme: "light",
        logoUrl: "",
        customCss: "",
        autoApproveVoters: false,
        autoApproveCandidates: false,
        allowSelfRegistration: true,
        requireEmailVerification: true,
      });
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
              Paramètres de la plateforme
            </h1>
            <p className="text-muted-foreground mt-1">
              Configurez les paramètres généraux, de sécurité et de
              fonctionnement
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={exportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button onClick={saveSettings} disabled={saveStatus === "saving"}>
              <Save className="h-4 w-4 mr-2" />
              {saveStatus === "saving" ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus === "saved" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Les paramètres ont été sauvegardés avec succès.
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="voting">Vote</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Informations générales</span>
                </CardTitle>
                <CardDescription>
                  Configuration de base de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platformName">Nom de la plateforme</Label>
                    <Input
                      id="platformName"
                      value={settings.platformName}
                      onChange={(e) =>
                        handleSettingChange("platformName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="websiteUrl">URL du site web</Label>
                    <Input
                      id="websiteUrl"
                      value={settings.websiteUrl}
                      onChange={(e) =>
                        handleSettingChange("websiteUrl", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="platformDescription">Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={settings.platformDescription}
                    onChange={(e) =>
                      handleSettingChange("platformDescription", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email de contact</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        handleSettingChange("contactEmail", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Email de support</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) =>
                        handleSettingChange("supportEmail", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Inscription et comptes</span>
                </CardTitle>
                <CardDescription>
                  Paramètres d'inscription et de validation des comptes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-inscription</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre aux utilisateurs de s'inscrire sans invitation
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowSelfRegistration}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowSelfRegistration", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vérification email obligatoire</Label>
                    <p className="text-sm text-muted-foreground">
                      Exiger la vérification de l'email lors de l'inscription
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      handleSettingChange("requireEmailVerification", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-validation électeurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Approuver automatiquement les comptes électeurs
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoApproveVoters}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoApproveVoters", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-validation candidats</Label>
                    <p className="text-sm text-muted-foreground">
                      Approuver automatiquement les candidatures
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoApproveCandidates}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoApproveCandidates", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Paramètres de sécurité</span>
                </CardTitle>
                <CardDescription>
                  Configuration de la sécurité et de l'authentification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Exiger la 2FA pour tous les utilisateurs
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorRequired}
                    onCheckedChange={(checked) =>
                      handleSettingChange("twoFactorRequired", checked)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passwordMinLength">
                      Longueur minimale du mot de passe
                    </Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      min="6"
                      max="20"
                      value={settings.passwordMinLength}
                      onChange={(e) =>
                        handleSettingChange(
                          "passwordMinLength",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">
                      Timeout de session (minutes)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="15"
                      max="480"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange(
                          "sessionTimeout",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxLoginAttempts">
                      Tentatives de connexion max
                    </Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={settings.maxLoginAttempts}
                      onChange={(e) =>
                        handleSettingChange(
                          "maxLoginAttempts",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountLockoutDuration">
                      Durée de blocage (minutes)
                    </Label>
                    <Input
                      id="accountLockoutDuration"
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.accountLockoutDuration}
                      onChange={(e) =>
                        handleSettingChange(
                          "accountLockoutDuration",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voting Settings */}
          <TabsContent value="voting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Paramètres de vote</span>
                </CardTitle>
                <CardDescription>
                  Configuration du processus de vote et des résultats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vote anonyme</Label>
                    <p className="text-sm text-muted-foreground">
                      Garantir l'anonymat des votes
                    </p>
                  </div>
                  <Switch
                    checked={settings.anonymousVoting}
                    onCheckedChange={(checked) =>
                      handleSettingChange("anonymousVoting", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirmation de vote obligatoire</Label>
                    <p className="text-sm text-muted-foreground">
                      Demander confirmation avant soumission du vote
                    </p>
                  </div>
                  <Switch
                    checked={settings.voteConfirmationRequired}
                    onCheckedChange={(checked) =>
                      handleSettingChange("voteConfirmationRequired", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autoriser les votes tardifs</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre le vote après la date limite (admin seulement)
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowLateVoting}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowLateVoting", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Publication automatique des résultats</Label>
                    <p className="text-sm text-muted-foreground">
                      Publier automatiquement les résultats à la fin du vote
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoPublishResults}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoPublishResults", checked)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="resultDisplayMode">
                    Mode d'affichage des résultats
                  </Label>
                  <Select
                    value={settings.resultDisplayMode}
                    onValueChange={(value) =>
                      handleSettingChange("resultDisplayMode", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        Pourcentages uniquement
                      </SelectItem>
                      <SelectItem value="numbers">
                        Nombres de votes uniquement
                      </SelectItem>
                      <SelectItem value="both">
                        Pourcentages et nombres
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Configuration email</span>
                </CardTitle>
                <CardDescription>
                  Paramètres SMTP et envoi d'emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activer les emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre l'envoi d'emails depuis la plateforme
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailEnabled", checked)
                    }
                  />
                </div>

                {settings.emailEnabled && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpServer">Serveur SMTP</Label>
                        <Input
                          id="smtpServer"
                          value={settings.smtpServer}
                          onChange={(e) =>
                            handleSettingChange("smtpServer", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPort">Port SMTP</Label>
                        <Input
                          id="smtpPort"
                          type="number"
                          value={settings.smtpPort}
                          onChange={(e) =>
                            handleSettingChange(
                              "smtpPort",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpUsername">Nom d'utilisateur</Label>
                        <Input
                          id="smtpUsername"
                          value={settings.smtpUsername}
                          onChange={(e) =>
                            handleSettingChange("smtpUsername", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPassword">Mot de passe</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={settings.smtpPassword}
                          onChange={(e) =>
                            handleSettingChange("smtpPassword", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="emailFrom">Adresse expéditeur</Label>
                      <Input
                        id="emailFrom"
                        value={settings.emailFrom}
                        onChange={(e) =>
                          handleSettingChange("emailFrom", e.target.value)
                        }
                      />
                    </div>

                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Tester la configuration
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications automatiques</span>
                </CardTitle>
                <CardDescription>
                  Configuration des notifications email automatiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer l'envoi de notifications par email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked)
                    }
                  />
                </div>

                {settings.emailNotifications && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Approbation de candidature</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifier les candidats lors de l'approbation
                          </p>
                        </div>
                        <Switch
                          checked={settings.candidateApprovalNotification}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "candidateApprovalNotification",
                              checked,
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Approbation d'électeur</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifier les électeurs lors de l'approbation
                          </p>
                        </div>
                        <Switch
                          checked={settings.voterApprovalNotification}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "voterApprovalNotification",
                              checked,
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Début d'élection</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifier au démarrage d'une élection
                          </p>
                        </div>
                        <Switch
                          checked={settings.electionStartNotification}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "electionStartNotification",
                              checked,
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Fin d'élection</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifier à la fin d'une élection
                          </p>
                        </div>
                        <Switch
                          checked={settings.electionEndNotification}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "electionEndNotification",
                              checked,
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Apparence et thème</span>
                </CardTitle>
                <CardDescription>
                  Personnalisation de l'interface utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Couleur principale</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) =>
                          handleSettingChange("primaryColor", e.target.value)
                        }
                        className="w-20"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) =>
                          handleSettingChange("primaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="theme">Thème</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        handleSettingChange("theme", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="auto">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="logoUrl">URL du logo</Label>
                  <Input
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={(e) =>
                      handleSettingChange("logoUrl", e.target.value)
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <Label htmlFor="customCss">CSS personnalisé</Label>
                  <Textarea
                    id="customCss"
                    value={settings.customCss}
                    onChange={(e) =>
                      handleSettingChange("customCss", e.target.value)
                    }
                    rows={6}
                    placeholder="/* Ajoutez votre CSS personnalisé ici */"
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Warning */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important :</strong> Certaines modifications nécessitent un
            redémarrage du serveur pour prendre effet. Testez toujours vos
            paramètres avant de les appliquer en production.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
};

export default AdminSettings;
