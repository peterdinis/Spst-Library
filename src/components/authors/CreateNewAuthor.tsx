import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, X, UserPlus } from "lucide-react";
import { create } from "convex/authors";
import { uploadAuthorImage } from "@/lib/uploathing";

export default function NewAuthorPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    birthYear: "",
    deathYear: "",
    nationality: "",
    website: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // TanStack Query mutation
  const authorMutation = useMutation({
    mutationFn: async (data: {
      formData: typeof formData;
      photoFileId?: string;
    }) => {
      return await create({
        ...data.formData,
        birthYear: data.formData.birthYear ? parseInt(data.formData.birthYear) : undefined,
        deathYear: data.formData.deathYear ? parseInt(data.formData.deathYear) : undefined,
        photoFileId: data.photoFileId as any,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });

  // Handle form input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image selection
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.birthYear) {
      const year = parseInt(formData.birthYear);
      if (year < 1000 || year > new Date().getFullYear()) {
        newErrors.birthYear = "Birth year must be between 1000 and current year";
      }
    }

    if (formData.deathYear) {
      const year = parseInt(formData.deathYear);
      if (year < 1000 || year > new Date().getFullYear() + 10) {
        newErrors.deathYear = "Invalid death year";
      }
    }

    if (formData.birthYear && formData.deathYear) {
      const birth = parseInt(formData.birthYear);
      const death = parseInt(formData.deathYear);
      if (death < birth) {
        newErrors.deathYear = "Death year must be after birth year";
      }
    }

    if (formData.website && formData.website.trim() !== "") {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let photoFileId: string | undefined;

      // Upload image if selected
      if (imageFile) {
        setUploadProgress(30);
        try {
          // Upload image to UploadThing
          const uploadResult = await uploadAuthorImage(imageFile);
          setUploadProgress(70);
          
          if (uploadResult && uploadResult[0]) {
            photoFileId = uploadResult[0].serverData.fileId;
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast({
            title: "Image upload failed",
            description: "The author was created without a photo. You can add one later.",
            variant: "destructive",
          });
        }
      }

      setUploadProgress(90);

      // Create author in Convex
      await authorMutation.mutateAsync({
        formData,
        photoFileId,
      });

      setUploadProgress(100);

      toast({
        title: "Author created successfully",
        description: `${formData.name} has been added to the library.`,
      });

      // Navigate back to authors list
      setTimeout(() => {
        navigate({ to: "/authors" });
      }, 1500);

    } catch (error: any) {
      console.error("Error creating author:", error);
      toast({
        title: "Error creating author",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Author</h1>
        <p className="text-muted-foreground mt-2">
          Add a new author to your library database
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Author Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author Photo Upload */}
            <div className="space-y-4">
              <Label htmlFor="photo">Author Photo (Optional)</Label>
              <div className="flex items-start gap-6">
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center">
                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Upload Controls */}
                <div className="flex-1 space-y-2">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: Square image, max 5MB. JPEG, PNG, or WebP.
                  </p>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., J.K. Rowling"
                disabled={isSubmitting}
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Biography Field */}
            <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Write a brief biography of the author..."
                rows={4}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                {formData.biography.length}/5000 characters
              </p>
            </div>

            {/* Birth and Death Year Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="birthYear">Birth Year</Label>
                <Input
                  id="birthYear"
                  name="birthYear"
                  type="number"
                  value={formData.birthYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 1965"
                  disabled={isSubmitting}
                />
                {errors.birthYear && (
                  <p className="text-sm text-destructive">{errors.birthYear}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deathYear">Death Year</Label>
                <Input
                  id="deathYear"
                  name="deathYear"
                  type="number"
                  value={formData.deathYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023"
                  disabled={isSubmitting}
                />
                {errors.deathYear && (
                  <p className="text-sm text-destructive">{errors.deathYear}</p>
                )}
              </div>
            </div>

            {/* Nationality and Website Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="e.g., British"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                />
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website}</p>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {(isSubmitting || uploadProgress > 0) && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {uploadProgress < 100
                    ? "Creating author..."
                    : "Author created successfully!"}
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/authors" })}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Author
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}