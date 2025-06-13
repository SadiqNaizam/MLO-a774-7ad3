import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, FileUp, UserCircle, ShieldCheck, Loader2, AlertCircle } from 'lucide-react'; // Example icons
import { useToast } from '@/hooks/use-toast';

// Schemas for each step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  nationality: z.string().min(2, "Nationality is required"),
  addressLine1: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const documentUploadSchema = z.object({
  documentType: z.enum(['passport', 'drivers_license', 'national_id'], { required_error: "Document type is required"}),
  documentFront: z.any().refine(file => file && file.length > 0, "Front of document is required."), // File validation is tricky with Zod alone for client-side
  documentBack: z.any().optional(), // Optional for some docs like passport
}).refine(data => data.documentType !== 'passport' || data.documentBack, { // Example: back required if not passport
    // This logic might be too simple, adjust as needed.
    // message: "Back of document is required for this type.",
    // path: ["documentBack"],
    // For now, keep it simpler for demonstration
});
type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

// For Selfie step - very basic, actual implementation needs camera access
const selfieSchema = z.object({
  selfieImage: z.any().refine(file => file && file.length > 0, "Selfie is required."),
});
type SelfieFormData = z.infer<typeof selfieSchema>;

type KYCStep = "personalInfo" | "documentUpload" | "selfie" | "pending" | "verified" | "rejected";

interface KYCStepperProps {
  initialStep?: KYCStep;
  userId: string; // To associate KYC data with a user
  onKYCSubmit: (data: any) => Promise<{ success: boolean; message?: string }>; // Simulate API submission
  currentKycStatus?: KYCStep; // If KYC status is already known
}

const stepsConfig: { id: KYCStep; title: string; icon: React.ElementType }[] = [
  { id: 'personalInfo', title: 'Personal Information', icon: UserCircle },
  { id: 'documentUpload', title: 'Document Upload', icon: FileUp },
  { id: 'selfie', title: 'Selfie Verification', icon: CheckCircle }, // Placeholder icon
];

const KYCStepper: React.FC<KYCStepperProps> = ({ initialStep = 'personalInfo', userId, onKYCSubmit, currentKycStatus }) => {
  const [currentStepId, setCurrentStepId] = useState<KYCStep>(currentKycStatus || initialStep);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { toast } = useToast();

  const methods = useForm({
    // resolver: zodResolver(currentStepSchema), // Resolver will be set per step
    defaultValues: {
      personalInfo: {},
      documentUpload: { documentType: undefined },
      selfie: {},
    },
  });
  
  const { handleSubmit, formState: { errors }, reset, control, register } = methods;

  const handleNextStep = async (data: any) => {
    console.log(`Data for step ${currentStepId}:`, data);
    const currentStepIndex = stepsConfig.findIndex(s => s.id === currentStepId);
    if (currentStepIndex < stepsConfig.length - 1) {
      setCurrentStepId(stepsConfig[currentStepIndex + 1].id);
    } else {
      // This is the final data collection step, prepare for submission
      setIsLoading(true);
      setSubmissionError(null);
      const allData = methods.getValues(); // Get all data from all steps
      console.log("Submitting all KYC data for user:", userId, allData);
      try {
        const result = await onKYCSubmit({ userId, ...allData });
        if (result.success) {
          setCurrentStepId('pending');
          toast({ title: "KYC Submitted", description: "Your information has been submitted for review." });
        } else {
          setSubmissionError(result.message || "Submission failed. Please try again.");
          toast({ title: "Submission Error", description: result.message || "Could not submit KYC.", variant: "destructive" });
        }
      } catch (error: any) {
        setSubmissionError(error.message || "An unexpected error occurred.");
        toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const currentStepConfig = stepsConfig.find(s => s.id === currentStepId);

  const renderStepContent = () => {
    switch (currentStepId) {
      case 'personalInfo':
        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4">
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              {/* Using useFormContext for nested components would be cleaner for very large forms */}
              <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" {...register('personalInfo.firstName', { required: "First name is required", minLength: {value: 2, message: "Too short"} })} />{errors.personalInfo?.firstName && <p className="text-red-500 text-xs mt-1">{errors.personalInfo.firstName.message}</p>}</div>
              <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" {...register('personalInfo.lastName', { required: "Last name is required" })} />{errors.personalInfo?.lastName && <p className="text-red-500 text-xs mt-1">{errors.personalInfo.lastName.message}</p>}</div>
              <div><Label htmlFor="dateOfBirth">Date of Birth (YYYY-MM-DD)</Label><Input id="dateOfBirth" type="date" {...register('personalInfo.dateOfBirth', { required: "Date of birth is required"})} />{errors.personalInfo?.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.personalInfo.dateOfBirth.message}</p>}</div>
              <div><Label htmlFor="nationality">Nationality</Label><Input id="nationality" {...register('personalInfo.nationality', { required: "Nationality is required" })} />{errors.personalInfo?.nationality && <p className="text-red-500 text-xs mt-1">{errors.personalInfo.nationality.message}</p>}</div>
              <div><Label htmlFor="addressLine1">Address Line 1</Label><Input id="addressLine1" {...register('personalInfo.addressLine1', { required: "Address is required" })} />{errors.personalInfo?.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.personalInfo.addressLine1.message}</p>}</div>
              <div><Label htmlFor="city">City</Label><Input id="city" {...register('personalInfo.city', { required: "City is required" })} />{errors.personalInfo?.city && <p className="text-red-500 text-xs mt-1">{errors.personalInfo.city.message}</p>}</div>
              <div><Label htmlFor="postalCode">Postal Code</Label><Input id="postalCode" {...register('personalInfo.postalCode', { required: "Postal code is required" })} />{errors.personalInfo?.postalCode && <p className="text-red-500 text-xs mt-1">{errors.personalInfo.postalCode.message}</p>}</div>
              <div><Label htmlFor="country">Country</Label><Input id="country" {...register('personalInfo.country', { required: "Country is required" })} />{errors.personalInfo?.country && <p className="text-red-500 text-xs mt-1">{errors.personalInfo.country.message}</p>}</div>
              <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Next: Document Upload</Button>
            </form>
          </FormProvider>
        );
      case 'documentUpload':
        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4">
              <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>
                <Controller
                    name="documentUpload.documentType"
                    control={control}
                    rules={{ required: "Document type is required" }}
                    render={({ field }) => (
                        <div>
                        <Label htmlFor="documentType">Document Type</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="documentType"><SelectValue placeholder="Select document type" /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="drivers_license">Driver's License</SelectItem>
                            <SelectItem value="national_id">National ID</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.documentUpload?.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentUpload.documentType.message}</p>}
                        </div>
                    )}
                />
              <div><Label htmlFor="documentFront">Document Front</Label><Input id="documentFront" type="file" {...register('documentUpload.documentFront', { required: "Document front is required" })} />{errors.documentUpload?.documentFront && <p className="text-red-500 text-xs mt-1">{errors.documentUpload.documentFront.message}</p>}</div>
              <div><Label htmlFor="documentBack">Document Back (if applicable)</Label><Input id="documentBack" type="file" {...register('documentUpload.documentBack')} />{errors.documentUpload?.documentBack && <p className="text-red-500 text-xs mt-1">{errors.documentUpload.documentBack.message}</p>}</div>
              <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Next: Selfie</Button>
            </form>
          </FormProvider>
        );
      case 'selfie':
        return (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4">
              <h3 className="text-lg font-semibold mb-3">Selfie Verification</h3>
              <p className="text-sm text-muted-foreground">Please upload a clear selfie. Ensure good lighting and no accessories like sunglasses or hats.</p>
              {/* Actual camera integration would go here. This is a placeholder. */}
              <div><Label htmlFor="selfieImage">Upload Selfie</Label><Input id="selfieImage" type="file" accept="image/*" {...register('selfie.selfieImage', { required: "Selfie is required" })} />{errors.selfie?.selfieImage && <p className="text-red-500 text-xs mt-1">{errors.selfie.selfieImage.message}</p>}</div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit KYC'} </Button>
            </form>
          </FormProvider>
        );
      case 'pending':
        return (
          <Alert>
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <AlertTitle>KYC Verification Pending</AlertTitle>
            <AlertDescription>
              Your documents have been submitted successfully and are now under review. This usually takes 1-2 business days. We'll notify you once the review is complete.
            </AlertDescription>
          </Alert>
        );
      case 'verified':
        return (
          <Alert variant="default" className="border-green-500 bg-green-50">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-700">KYC Verified!</AlertTitle>
            <AlertDescription className="text-green-600">
              Congratulations! Your identity has been successfully verified. You now have full access to all platform features.
            </AlertDescription>
          </Alert>
        );
       case 'rejected':
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>KYC Verification Rejected</AlertTitle>
            <AlertDescription>
              Unfortunately, your KYC verification was not successful. Reason: {submissionError || "Please check your email for details or contact support."}
              <Button variant="link" onClick={() => { setSubmissionError(null); setCurrentStepId('personalInfo'); reset(); }} className="p-0 h-auto mt-2">Retry KYC</Button>
            </AlertDescription>
          </Alert>
        );
      default:
        return <p>Unknown KYC step.</p>;
    }
  };

  // Progress bar logic
  const currentVisibleStepIndex = stepsConfig.findIndex(s => s.id === currentStepId);
  const progressPercentage = currentVisibleStepIndex >=0 ? ((currentVisibleStepIndex + 1) / stepsConfig.length) * 100 : 0;


  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Identity Verification (KYC)</CardTitle>
        <CardDescription>Please complete the following steps to verify your identity.</CardDescription>
        {/* Progress Bar for active steps */}
        {currentStepId !== 'pending' && currentStepId !== 'verified' && currentStepId !== 'rejected' && (
             <div className="mt-4">
                <div className="flex justify-between mb-1 text-sm text-muted-foreground">
                    {stepsConfig.map((step, index) => (
                        <div key={step.id} className={`flex-1 text-center ${index <= currentVisibleStepIndex ? 'font-semibold text-primary' : ''}`}>
                           {/* <step.icon className={`mx-auto mb-1 h-5 w-5 ${index <= currentVisibleStepIndex ? 'text-primary' : 'text-muted-foreground'}`} /> */}
                           {step.title}
                        </div>
                    ))}
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
        )}
      </CardHeader>
      <CardContent>
        {submissionError && currentStepId !== 'rejected' && (
            <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
        )}
        {renderStepContent()}
      </CardContent>
      {(currentStepId !== 'pending' && currentStepId !== 'verified' && currentStepId !== 'rejected') && (
        <CardFooter className="text-xs text-muted-foreground">
            <p>Your information is kept secure and confidential.</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default KYCStepper;