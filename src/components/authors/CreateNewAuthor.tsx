import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, UserPlus } from "lucide-react";
import { useUploadThing } from "@/lib/uploathing";
import { api } from "convex/_generated/api";

export default function NewAuthorPage() {
  const navigate = useNavigate();
  
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

  // Convex mutation
  const createAuthor = useMutation(api.authors.create);

  // UploadThing hook
  const { startUpload, isUploading } = useUploadThing("authorImage", {
    onClientUploadComplete: (res) => {
      console.log("Upload complete", res);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: "Failed to upload image. Please try again.",
      });
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
      toast.error("Invalid file type", {
        description: "Please select an image file (JPEG, PNG, etc.)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB",
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
    } else if (formData.name.length > 200) {
      newErrors.name = "Name is too long (max 200 characters)";
    }

    if (formData.biography && formData.biography.length > 5000) {
      newErrors.biography = "Biography is too long (max 5000 characters)";
    }

    if (formData.birthYear) {
      const year = parseInt(formData.birthYear);
      if (isNaN(year)) {
        newErrors.birthYear = "Please enter a valid year";
      } else if (year < 1000 || year > new Date().getFullYear()) {
        newErrors.birthYear = "Birth year must be between 1000 and current year";
      }
    }

    if (formData.deathYear) {
      const year = parseInt(formData.deathYear);
      if (isNaN(year)) {
        newErrors.deathYear = "Please enter a valid year";
      } else if (year < 1000 || year > new Date().getFullYear() + 10) {
        newErrors.deathYear = "Invalid death year";
      }
    }

    if (formData.birthYear && formData.deathYear) {
      const birth = parseInt(formData.birthYear);
      const death = parseInt(formData.deathYear);
      if (!isNaN(birth) && !isNaN(death) && death < birth) {
        newErrors.deathYear = "Death year must be after birth year";
      }
    }

    if (formData.nationality && formData.nationality.length > 100) {
      newErrors.nationality = "Nationality is too long (max 100 characters)";
    }

    if (formData.website && formData.website.trim() !== "") {
      try {
        // Add protocol if missing
        const url = formData.website.includes("://") 
          ? formData.website 
          : `https://${formData.website}`;
        new URL(url);
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
    let toastId: string | number | undefined;

    try {
      toastId = toast.loading("Creating author...");

      let photoFileId: string | undefined;

      // Upload image if selected
      if (imageFile) {
        setUploadProgress(30);
        toast.loading("Uploading image...", { id: toastId });
        
        try {
          // Upload image to UploadThing
          const uploadResult = await startUpload([imageFile]);
          setUploadProgress(70);
          
          if (uploadResult && uploadResult[0]) {
            // Assuming UploadThing returns file ID in serverData
            photoFileId = uploadResult[0].serverData?.fileKey
            // OR if using UploadThing's URL, you might need to save it to Convex files table first
            // Let me know if you need help with that integration
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.warning("Image upload failed", {
            id: toastId,
            description: "The author was created without a photo. You can add one later.",
          });
        }
      }

      setUploadProgress(90);
      toast.loading("Saving author information...", { id: toastId });

      // Parse numeric values
      const birthYear = formData.birthYear ? parseInt(formData.birthYear) : undefined;
      const deathYear = formData.deathYear ? parseInt(formData.deathYear) : undefined;
      
      // Convert empty string to undefined for website
      const website = formData.website?.trim() === "" ? undefined : formData.website;

      // Create author in Convex
      const authorId = await createAuthor({
        name: formData.name,
        biography: formData.biography || undefined,
        birthYear,
        deathYear,
        nationality: formData.nationality || undefined,
        photoFileId: photoFileId as any,
        website,
      });

      setUploadProgress(100);
      
      toast.success("Author created successfully", {
        id: toastId,
        description: `${formData.name} has been added to the library.`,
        action: {
          label: "View",
          onClick: () => navigate({ to: `/authors/${authorId}` }),
        },
      });

      // Navigate back to authors list
      setTimeout(() => {
        navigate({ to: "/authors" });
      }, 2000);

    } catch (error: any) {
      console.error("Error creating author:", error);
      
      toast.error("Error creating author", {
        id: toastId,
        description: error.message || "Please try again",
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
                      disabled={isSubmitting || isUploading}
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
                    disabled={isSubmitting || isUploading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended: Square image, max 5MB. JPEG, PNG, or WebP.
                  </p>
                  {isUploading && (
                    <p className="text-sm text-blue-600">
                      Uploading image...
                    </p>
                  )}
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
                disabled={isSubmitting || isUploading}
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
                disabled={isSubmitting || isUploading}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {formData.biography.length}/5000 characters
                </p>
                {errors.biography && (
                  <p className="text-sm text-destructive">{errors.biography}</p>
                )}
              </div>
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
                  disabled={isSubmitting || isUploading}
                  min={1000}
                  max={new Date().getFullYear()}
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
                  disabled={isSubmitting || isUploading}
                  min={1000}
                  max={new Date().getFullYear() + 10}
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
                  disabled={isSubmitting || isUploading}
                />
                {errors.nationality && (
                  <p className="text-sm text-destructive">{errors.nationality}</p>
                )}
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
                  disabled={isSubmitting || isUploading}
                />
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website}</p>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {(isSubmitting || isUploading || uploadProgress > 0) && (
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
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isUploading}
              >
                {(isSubmitting || isUploading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Creating..."}
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