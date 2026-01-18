import { FC, useState } from 'react';
import { motion} from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2,
  Loader2,
  Tag,
  Hash,
  Palette,
  Sparkles,
  X,
  FileText
} from 'lucide-react';

// Simulácia Convex mutácie
const useCreateCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const mutate = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Kategória vytvorená:', data);
    setIsLoading(false);
    return { success: true };
  };
  
  return { mutate, isLoading };
};

const CreateCategoryForm: FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isLoading } = useCreateCategory();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#8b5cf6',
    icon: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Názov kategórie je povinný';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Názov môže mať maximálne 100 znakov';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug je povinný';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug môže obsahovať len malé písmená, čísla a pomlčky';
    } else if (formData.slug.length > 100) {
      newErrors.slug = 'Slug môže mať maximálne 100 znakov';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Popis môže mať maximálne 500 znakov';
    }

    if (formData.color && !/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
      newErrors.color = 'Neplatný formát farby (použite #RRGGBB)';
    }

    if (formData.icon && formData.icon.length > 50) {
      newErrors.icon = 'Ikona môže mať maximálne 50 znakov';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await mutate(formData);
      setIsSubmitted(true);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    updateField('slug', slug);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#8b5cf6',
      icon: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <CheckCircle2 className="h-24 w-24 text-green-500 relative" strokeWidth={1.5} />
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
          >
            Kategória vytvorená!
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-2"
          >
            Kategória <strong>{formData.name}</strong> bola úspešne vytvorená.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200 text-left"
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-muted-foreground">Farba:</span>
                <span className="font-mono">{formData.color}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Slug:</span>
                <span className="ml-2 font-mono text-violet-700">{formData.slug}</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              Vytvoriť ďalšiu kategóriu
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl shadow-violet-500/10 backdrop-blur overflow-hidden">
          {/* Decorative header gradient */}
          <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
          
          <CardHeader className="space-y-4 pb-6">
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Nová kategória
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Vytvorte novú kategóriu pre knihy
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Názov kategórie */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-base">
                  <Tag className="h-4 w-4 text-violet-600" />
                  Názov kategórie *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  onBlur={generateSlug}
                  placeholder="napr. Science Fiction"
                  className={`transition-all h-11 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-violet-500'}`}
                  maxLength={100}
                />
                <div className="flex justify-between items-center">
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formData.name.length}/100
                  </span>
                </div>
              </motion.div>

              {/* Slug */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="slug" className="flex items-center gap-2 text-base">
                  <Hash className="h-4 w-4 text-violet-600" />
                  Slug (URL) *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="science-fiction"
                    className={`transition-all h-11 font-mono ${errors.slug ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-violet-500'}`}
                    maxLength={100}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                    className="shrink-0"
                    disabled={!formData.name}
                  >
                    Generovať
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  {errors.slug && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {errors.slug}
                    </motion.p>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formData.slug.length}/100
                  </span>
                </div>
              </motion.div>

              {/* Popis */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-violet-600" />
                  Popis (nepovinné)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Krátky popis kategórie..."
                  rows={4}
                  className="focus-visible:ring-violet-500 resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  {errors.description && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {errors.description}
                    </motion.p>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formData.description.length}/500
                  </span>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Farba */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="color" className="flex items-center gap-2 text-base">
                    <Palette className="h-4 w-4 text-violet-600" />
                    Farba
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="color"
                        type="text"
                        value={formData.color}
                        onChange={(e) => updateField('color', e.target.value)}
                        placeholder="#8b5cf6"
                        className={`transition-all h-11 font-mono pr-12 ${errors.color ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-violet-500'}`}
                        maxLength={7}
                      />
                      <div 
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded border-2 border-white shadow-sm ring-1 ring-black/10"
                        style={{ backgroundColor: formData.color }}
                      />
                    </div>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => updateField('color', e.target.value)}
                      className="w-12 h-11 rounded border cursor-pointer"
                    />
                  </div>
                  {errors.color && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {errors.color}
                    </motion.p>
                  )}
                </motion.div>

                {/* Ikona */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="icon" className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-violet-600" />
                    Ikona (nepovinné)
                  </Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => updateField('icon', e.target.value)}
                    placeholder="BookOpen"
                    className="transition-all h-11 focus-visible:ring-violet-500"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    Názov ikony z lucide-react
                  </p>
                </motion.div>
              </div>

              {/* Náhľad */}
              <motion.div 
                variants={itemVariants}
                className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200"
              >
                <h4 className="font-semibold text-sm mb-3 text-violet-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Náhľad kategórie
                </h4>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.name.charAt(0).toUpperCase() || 'K'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">
                      {formData.name || 'Názov kategórie'}
                    </div>
                    {formData.slug && (
                      <div className="text-xs text-muted-foreground font-mono">
                        /{formData.slug}
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: `${formData.color}20`,
                      color: formData.color,
                      borderColor: `${formData.color}40`
                    }}
                  >
                    Kategória
                  </Badge>
                </div>
              </motion.div>

              {/* Tlačidlá */}
              <motion.div 
                variants={itemVariants}
                className="flex gap-3 pt-4"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Zrušiť
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vytváranie...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Vytvoriť kategóriu
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default CreateCategoryForm