import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { Loader2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const passwordRequirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    const { error } = await signUp(data.email, data.password, {
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      accountType: data.accountType,
    });
    
    if (error) {
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
      } else if (error.message.includes("Password")) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
      });
      setIsLoading(false);
      return;
    }
    
    toast({
      title: "Account created!",
      description: "Welcome to Tre.David. You are now signed in.",
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-xl border border-border p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                {t("register.createAccount")}
              </h1>
              <p className="text-muted-foreground">
                {t("register.joinTreDavid")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("register.firstName")}</Label>
                  <Input 
                    id="firstName" 
                    placeholder={t("register.firstNamePlaceholder")} 
                    {...register("firstName")}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("register.lastName")}</Label>
                  <Input 
                    id="lastName" 
                    placeholder={t("register.lastNamePlaceholder")}
                    {...register("lastName")}
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("register.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("register.emailPlaceholder")}
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
              <Label htmlFor="companyName">{t("register.companyName")}</Label>
                <Input 
                  id="companyName" 
                  placeholder={t("register.companyNamePlaceholder")}
                  {...register("companyName")}
                  disabled={isLoading}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountType">{t("register.accountType")}</Label>
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value ?? ""}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("register.accountTypeDesc")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">{t("register.buyer")}</SelectItem>
                        <SelectItem value="supplier">{t("register.supplier")}</SelectItem>
                        <SelectItem value="manufacturer">{t("register.manufacturer")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.accountType && (
                  <p className="text-sm text-destructive">{errors.accountType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("register.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                />
                {password && (
                  <div className="space-y-1 mt-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {req.valid ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={req.valid ? "text-green-500" : "text-muted-foreground"}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {t("register.terms1")}{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  {t("register.terms2")}
                </Link>{" "}
                {t("register.terms3")}{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  {t("register.terms4")}
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("register.creatingAcc")}
                  </>
                ) : (
                  t("register.createAccBtn")
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t("register.alreadyHaveAccount")}{" "}
              <Link to="/signin" className="text-primary hover:underline font-medium">
                {t("register.signInNow")}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
